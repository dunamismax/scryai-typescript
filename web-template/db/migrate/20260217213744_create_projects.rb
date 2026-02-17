class CreateProjects < ActiveRecord::Migration[8.1]
  def change
    create_table :projects do |t|
      t.string :name, null: false
      t.text :summary
      t.integer :status, null: false, default: 0
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end

    add_index :projects, [ :user_id, :updated_at ]
  end
end
