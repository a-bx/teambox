class AddEstimationToHistory < ActiveRecord::Migration
  def self.up
    add_column :tasks, :estimation, :integer    
  end

  def self.down
     remove_column :tasks, :estimation
  end
end
