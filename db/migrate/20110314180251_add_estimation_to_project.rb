class AddEstimationToProject < ActiveRecord::Migration
  def self.up
    add_column :projects, :estimation, :integer    
  end

  def self.down
     remove_column :projects, :public
  end
end