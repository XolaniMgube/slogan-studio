-- Marks an order paid AND decrements product stock in a single transaction.
--
-- Why a function instead of doing this from the app:
--   1. Stock must be decremented with a conditional UPDATE
--      (`set stock_qty = stock_qty - n where stock_qty >= n`) so two concurrent
--      payments for the last unit can't both succeed. supabase-js can't express
--      a self-referencing column update, and a read-then-write from JS races.
--   2. Marking paid and moving stock must be atomic — an order should never be
--      recorded as paid without its stock having moved (or being flagged).
--
-- Idempotent: `for update` serializes the concurrent webhook + success-page
-- callers, and the `payment_status = 'pending'` check means only the first one
-- through does any work.
--
-- Note: if stock is insufficient we STILL mark the order paid — the customer's
-- money has already been taken, so the sale must be recorded. The shortfall is
-- returned to the caller so it can be logged and resolved manually.
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

  -- Already processed by the other confirmation path — no-op.
  if v_order.payment_status <> 'pending' then
    return jsonb_build_object('found', true, 'updated', false, 'orderId', v_order.id, 'shortfalls', v_shortfalls);
  end if;

  for v_item in
    select oi.product_id, oi.quantity, oi.product_name
    from order_items oi
    where oi.order_id = v_order.id
      and oi.product_id is not null
  loop
    -- Atomic guarded decrement. Also flips the product to sold_out at zero.
    update products
       set stock_qty = stock_qty - v_item.quantity,
           status = case
                      when stock_qty - v_item.quantity <= 0 then 'sold_out'::product_status
                      else status
                    end
     where id = v_item.product_id
       and stock_qty >= v_item.quantity;

    get diagnostics v_rows = row_count;

    -- 0 rows means the guard failed: not enough stock left.
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
         paid_at = now()
   where id = v_order.id;

  return jsonb_build_object('found', true, 'updated', true, 'orderId', v_order.id, 'shortfalls', v_shortfalls);
end;
$$;
