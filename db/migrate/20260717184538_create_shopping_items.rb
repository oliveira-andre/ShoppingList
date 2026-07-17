class CreateShoppingItems < ActiveRecord::Migration[8.0]
  def change
    create_table :shopping_items do |t|
      t.string :name, null: false
      t.string :status, null: false, default: "open"

      t.timestamps
    end

    add_index :shopping_items, :status
  end
end
