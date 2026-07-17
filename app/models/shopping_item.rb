class ShoppingItem < ApplicationRecord
  STATUSES = %w[open done].freeze

  validates :name, presence: true
  validates :status, inclusion: { in: STATUSES }

  before_validation :normalize

  # acts_as_list manages `position` per status list (adds new items to the
  # bottom, keeps positions contiguous, moves items when their status changes).
  acts_as_list scope: [:status]

  scope :open_items, -> { where(status: "open").order(:position) }
  scope :done_items, -> { where(status: "done").order(updated_at: :desc) }

  # Persist a new open-list order from an array of ids, then push the
  # reordered list to every client.
  def self.reorder!(ordered_ids)
    transaction do
      ordered_ids.each_with_index do |id, index|
        find_by(id: id)&.insert_at(index + 1) # acts_as_list positions are 1-based
      end
    end
    broadcast_open_list
  end

  def self.broadcast_open_list
    Turbo::StreamsChannel.broadcast_replace_to "shopping_items",
      target: "open_items",
      partial: "shopping_items/open_list",
      locals: { items: open_items }
  end

  def open?
    status == "open"
  end

  def done?
    status == "done"
  end

  def toggle!
    update!(status: open? ? "done" : "open")
  end

  # ---- Realtime (Turbo Stream broadcasts over Action Cable) ----
  # Every connected client subscribes with `turbo_stream_from "shopping_items"`,
  # so these push add/move/remove/edit to everyone in real time.
  after_create_commit :broadcast_created
  after_update_commit :broadcast_updated
  after_destroy_commit :broadcast_destroyed

  private

  def normalize
    self.status = "open" if status.blank?
    self.name = name.strip.sub(/\A(.)/) { $1.upcase } if name.present?
  end

  def broadcast_created
    broadcast_append_to "shopping_items", target: "open_items",
      partial: "shopping_items/shopping_item", locals: { item: self }
  end

  def broadcast_updated
    if saved_change_to_status?
      # Moved between lists: remove, then re-add to the target. Done items go
      # to the TOP (newest first, matching the done_items scope); open items to
      # the bottom (their acts_as_list position).
      broadcast_remove_to "shopping_items", target: self
      if done?
        broadcast_prepend_to "shopping_items", target: "done_items",
          partial: "shopping_items/shopping_item", locals: { item: self }
      else
        broadcast_append_to "shopping_items", target: "open_items",
          partial: "shopping_items/shopping_item", locals: { item: self }
      end
    else
      # Renamed in place.
      broadcast_replace_to "shopping_items", target: self,
        partial: "shopping_items/shopping_item", locals: { item: self }
    end
  end

  def broadcast_destroyed
    broadcast_remove_to "shopping_items", target: self
  end
end
