class CreateEstimationTypes < ActiveRecord::Migration
  def self.up
    create_table :estimation_types do |t|
      t.string   :name
      t.timestamps
    end
  end

  def self.down
    drop_table :estimation_types
  end
end
