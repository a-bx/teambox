class AddEstimationTypeToProject < ActiveRecord::Migration
  def self.up
    add_column :projects, :estimation_type_id, :integer, :default => 1
  end

  def self.down
    remove_column :projects, :estimation_type_id 
  end
end