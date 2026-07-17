class ShoppingItemsController < ApplicationController
  before_action :set_item, only: %i[show edit update destroy toggle]

  # The list DOM is driven entirely by model Turbo broadcasts (append / move /
  # remove / replace), which reach every connected client — including the one
  # making the request. So these actions only need to handle the submitter's
  # own form state (reset the add form, close the inline editor).

  def create
    @item = ShoppingItem.new(item_params)
    if @item.save
      # Broadcast appends the row for everyone; here we just reset the add form.
      render turbo_stream: reset_form_stream(ShoppingItem.new)
    else
      render turbo_stream: reset_form_stream(@item), status: :unprocessable_entity
    end
  end

  def show
    # Used to cancel an inline edit: reloads the name frame back to its label.
    render partial: "shopping_items/shopping_item", locals: { item: @item }
  end

  def edit
    # Renders the inline edit form into the item's name turbo frame.
  end

  def update
    if @item.update(item_params)
      # Broadcast replaces the row for everyone; respond with the show partial
      # so the submitter's edit frame swaps back to the label.
      render partial: "shopping_items/shopping_item", locals: { item: @item }
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def toggle
    @item.toggle!
    head :no_content # broadcast moves the row between lists for everyone
  end

  def destroy
    @item.destroy
    head :no_content # broadcast removes the row for everyone
  end

  def clear
    ShoppingItem.destroy_all # each destroy broadcasts its own removal
    head :no_content
  end

  def reorder
    ShoppingItem.reorder!(Array(params[:ids])) # persists + broadcasts new order
    head :no_content
  end

  private

  def set_item
    @item = ShoppingItem.find(params[:id])
  end

  def item_params
    params.require(:shopping_item).permit(:name)
  end

  def reset_form_stream(item)
    turbo_stream.replace("new_item_form", partial: "shopping_items/form", locals: { item: item })
  end
end
