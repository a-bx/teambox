class AddEstimationToProject < ActiveRecord::Migration
  def self.up
    add_column :projects, :estimation, :float    
  end

  def self.down
     remove_column :projects, :public
  end
end
 