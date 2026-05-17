-- Widen the products.product_type CHECK constraint so the canonical
-- 'stretch_bed' value is accepted alongside the legacy 'weave_bed' label.
--
-- Background: the original 20260121000001_products.sql migration declared
-- the CHECK as IN ('basket_bed', 'stretch_bed', 'washing_machine', 'accessory')
-- but the live database drifted: by 2026-05-17 the live CHECK accepted
-- ('weave_bed', 'basket_bed', 'washing_machine', 'accessory') and rejected
-- 'stretch_bed'. This migration reconciles by allowing BOTH so we can
-- migrate existing rows from 'weave_bed' → 'stretch_bed' without breakage.
--
-- Once all rows are on 'stretch_bed', a follow-up migration can drop
-- 'weave_bed' from the allowed set.

ALTER TABLE products
  DROP CONSTRAINT IF EXISTS products_product_type_check;

ALTER TABLE products
  ADD CONSTRAINT products_product_type_check
  CHECK (product_type IN ('basket_bed', 'stretch_bed', 'weave_bed', 'washing_machine', 'accessory'));
