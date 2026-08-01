-- Renames the payment-provider checkout id column after the Yoco -> iKhokha switch.
-- Written to be safely re-runnable: does nothing if it has already been applied.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'orders' and column_name = 'yoco_checkout_id'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'orders' and column_name = 'ikhokha_checkout_id'
  ) then
    alter table orders rename column yoco_checkout_id to ikhokha_checkout_id;
  end if;
end $$;
