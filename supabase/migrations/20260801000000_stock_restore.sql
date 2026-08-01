-- Restores stock when an order is cancelled or refunded.
--
-- Needs an explicit flag rather than inferring from paid_at: an admin can set
-- payment_status = 'paid' by hand in the back office, which sets paid_at WITHOUT
-- any stock having moved. Restoring off that would invent inventory.
alter table orders
  add column if not exists stock_decremented boolean not null default false;

-- Existing rows stay false on purpose. Orders paid before this migration won't
-- auto-restore — under-restoring is recoverable by hand, over-restoring silently
-- inflates inventory and oversells.

-- Replaces the previous version: same behaviour, plus it records whether stock
-- actually moved so the restore below knows what it may safely give back.
create or replace function mark_order_paid(p_reference text)
returns jsonb
language plpgsql
as $$
declare
  v_order      orders%rowtype;
  v_item       record;
  v_shortfalls jsonb := '[]'::jsonb;
  v_rows       integer;
begin
  select * into v_order
  from orders
  where payment_reference = p_reference
  for update;

  if not found then
    return jsonb_build_object('found', false, 'updated', false, 'shortfalls', v_shortfalls);
  end if;

  if v_order.payment_status <> 'pending' then
    return jsonb_build_object('found', true, 'updated', false, 'orderId', v_order.id, 'shortfalls', v_shortfalls);
  end if;

  for v_item in
    select oi.product_id, oi.quantity, oi.product_name
    from order_items oi
    where oi.order_id = v_order.id
      and oi.product_id is not null
  loop
    update products
       set stock_qty = stock_qty - v_item.quantity,
           status = case
                      when stock_qty - v_item.quantity <= 0 then 'sold_out'::product_status
                      else status
                    end
     where id = v_item.product_id
       and stock_qty >= v_item.quantity;

    get diagnostics v_rows = row_count;

    if v_rows = 0 then
      v_shortfalls := v_shortfalls || jsonb_build_object(
        'productId', v_item.product_id,
        'name', v_item.product_name,
        'wanted', v_item.quantity
      );
    end if;
  end loop;

  update orders
     set status = 'paid',
         payment_status = 'paid',
         paid_at = now(),
         -- Only claim a clean decrement when every line succeeded. A partial
         -- decrement is flagged as a shortfall and needs manual handling, so we
         -- must not let the restore hand back stock that never came off.
         stock_decremented = (v_shortfalls = '[]'::jsonb)
   where id = v_order.id;

  return jsonb_build_object('found', true, 'updated', true, 'orderId', v_order.id, 'shortfalls', v_shortfalls);
end;
$$;

-- Puts an order's stock back. Idempotent: the stock_decremented flag is cleared
-- on the way out, so repeated cancel/refund edits can't inflate inventory.
create or replace function restore_order_stock(p_order_id uuid)
returns jsonb
language plpgsql
as $$
declare
  v_order    orders%rowtype;
  v_item     record;
  v_restored jsonb := '[]'::jsonb;
begin
  select * into v_order
  from orders
  where id = p_order_id
  for update;

  if not found then
    return jsonb_build_object('found', false, 'restored', false, 'items', v_restored);
  end if;

  -- Never decremented (or already restored) — nothing to give back.
  if not v_order.stock_decremented then
    return jsonb_build_object('found', true, 'restored', false, 'items', v_restored);
  end if;

  for v_item in
    select oi.product_id, oi.quantity, oi.product_name
    from order_items oi
    where oi.order_id = v_order.id
      and oi.product_id is not null
  loop
    update products
       set stock_qty = stock_qty + v_item.quantity,
           -- Bring it back on sale, but only if it went sold_out. Don't override
           -- a deliberate draft/archived state.
           status = case
                      when status = 'sold_out' then 'active'::product_status
                      else status
                    end
     where id = v_item.product_id;

    v_restored := v_restored || jsonb_build_object(
      'productId', v_item.product_id,
      'name', v_item.product_name,
      'quantity', v_item.quantity
    );
  end loop;

  update orders set stock_decremented = false where id = v_order.id;

  return jsonb_build_object('found', true, 'restored', true, 'items', v_restored);
end;
$$;
