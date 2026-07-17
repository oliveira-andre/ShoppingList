class HomeController < ApplicationController
  def index
    @item = ShoppingItem.new
    @open_items = ShoppingItem.open_items
    @done_items = ShoppingItem.done_items
  end
end
