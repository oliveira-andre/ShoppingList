import { Controller } from "@hotwired/stimulus"

// Inline-edit helper: save on blur, cancel (revert to the label) on Escape.
export default class extends Controller {
  submit() {
    if (this.cancelled) return
    this.element.form?.requestSubmit()
  }

  cancel(event) {
    event.preventDefault()
    this.cancelled = true
    const frame = this.element.closest("turbo-frame")
    if (frame && this.element.dataset.showUrl) frame.src = this.element.dataset.showUrl
  }
}
