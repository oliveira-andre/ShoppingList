import { Controller } from "@hotwired/stimulus"

// Swipe an OPEN row to the RIGHT past the threshold to mark it done.
// Touch-only: reordering (mouse drag included) is handled by SortableJS on the
// list, so we leave non-touch pointers alone to avoid fighting over the drag.
const SWIPE_THRESHOLD = 110
const START = 8

export default class extends Controller {
  connect() {
    this.active = false
    this.axis = null
    this.dx = 0
    this._down = this.down.bind(this)
    this._move = this.move.bind(this)
    this._up = this.up.bind(this)
    this.element.addEventListener("pointerdown", this._down)
  }

  disconnect() {
    this.element.removeEventListener("pointerdown", this._down)
    this.teardown()
  }

  down(event) {
    if (event.pointerType !== "touch") return
    if (event.target.closest(".item__toggle") || event.target.closest(".item__edit-form")) return
    this.active = true
    this.axis = null
    this.dx = 0
    this.startX = event.clientX
    this.startY = event.clientY
    window.addEventListener("pointermove", this._move)
    window.addEventListener("pointerup", this._up)
    window.addEventListener("pointercancel", this._up)
  }

  move(event) {
    if (!this.active) return
    const dx = event.clientX - this.startX
    const dy = event.clientY - this.startY

    if (!this.axis) {
      if (Math.hypot(dx, dy) < START) return
      this.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y"
    }
    if (this.axis !== "x") return // vertical => let SortableJS / native scroll handle it

    this.dx = Math.max(0, dx)
    this.element.style.transform = `translateX(${this.dx}px)`
    this.element.style.opacity = String(Math.max(0.3, 1 - this.dx / 260))
    this.element.classList.toggle("item--will-done", this.dx > SWIPE_THRESHOLD)
    event.preventDefault()
  }

  up() {
    if (!this.active) return
    this.active = false
    this.teardown()
    if (this.axis !== "x") return

    const passed = this.dx > SWIPE_THRESHOLD
    this.element.classList.remove("item--will-done")
    if (passed) {
      this.element.querySelector(".item__toggle")?.requestSubmit()
    } else {
      this.element.style.transform = ""
      this.element.style.opacity = ""
    }
  }

  teardown() {
    window.removeEventListener("pointermove", this._move)
    window.removeEventListener("pointerup", this._up)
    window.removeEventListener("pointercancel", this._up)
  }
}
