-- Add raw plastic tracking to inventory snapshots
ALTER TABLE production_inventory 
ADD COLUMN raw_plastic_kg INTEGER DEFAULT 0;
