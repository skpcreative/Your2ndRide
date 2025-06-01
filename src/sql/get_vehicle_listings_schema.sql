-- Query to get the schema of the vehicle_listings table
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM 
  information_schema.columns
WHERE 
  table_name = 'vehicle_listings'
ORDER BY 
  ordinal_position;
