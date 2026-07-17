import { Controller } from "@hotwired/stimulus"

// Keeps a count in sync with the number of rows actually shown in a list.
// Driven by the DOM (via MutationObserver), so it can never disagree with what
// the user sees — no matter how rows arrive (Turbo broadcast, reload, etc.).
export default class extends Controller {
  static targets = ["list", "count"]

  connect() {
    this.update()
    this.observer = new MutationObserver(() => this.update())
    this.observer.observe(this.listTarget, { childList: true })
  }

  disconnect() {
    this.observer?.disconnect()
  }

  update() {
    this.countTarget.textContent = this.listTarget.querySelectorAll("li").length
  }
}
