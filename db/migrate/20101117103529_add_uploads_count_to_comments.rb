class AddUploadsCountToComments < ActiveRecord::Migration
  def self.up
    add_column :comments, :uploads_count, :integer, :default => 0
  end

  def self.down
    remove_column :comments, :uploads_count
  end
end
