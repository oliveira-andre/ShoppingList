class AddPositionToShoppingItems < ActiveRecord::Migration[8.0]
  def up
    add_column :shopping_items, :position, :integer
    # Backfill existing rows with a stable order.
    execute <<~SQL
      UPDATE shopping_items s
      SET position = t.rn
      FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, id) - 1 AS rn
            FROM shopping_items) t
      WHERE s.id = t.id
    SQL
    change_column_default :shopping_items, :position, 0
    add_index :shopping_items, :position
  end

  def down
    remove_column :shopping_items, :position
  end
end
