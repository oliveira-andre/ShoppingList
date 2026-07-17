import { Controller } from "@hotwired/stimulus"
import Sortable from "sortablejs"

// Drag-to-reorder for a list. On drop, POSTs the new order of ids to `urlValue`.
// The delay/touch options let a quick horizontal swipe or a vertical scroll pass
// through (drag only starts after a short hold), so this coexists with the
// swipe-to-done gesture on touch devices.
export default class extends Controller {
  static values = {
    url: String,
    delay: { type: Number, default: 100 },
    group: String
  }

  connect() {
    const options = {
      animation: 150,
      delay: this.delayValue,
      delayOnTouchOnly: true,
      touchStartThreshold: 5,
      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",
      dragClass: "sortable-drag",
      forceFallback: true,
      onEnd: this.onEnd.bind(this)
    }

    if (this.hasGroupValue && this.groupValue) options.group = this.groupValue

    this.sortable = Sortable.create(this.element, options)
  }

  disconnect() {
    this.sortable?.destroy()
    this.sortable = null
  }

  onEnd() {
    if (!this.hasUrlValue) return
    const ids = Array.from(this.element.querySelectorAll(".item"))
      .map((row) => row.id.replace("shopping_item_", ""))

    fetch(this.urlValue, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/vnd.turbo-stream.html",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')?.content
      },
      body: JSON.stringify({ ids })
    })
  }
}
