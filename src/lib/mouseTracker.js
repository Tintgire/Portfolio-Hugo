// Shared mouse position tracker.
//
// Multiple components (e.g. all ParticleShapeField2D instances on the
// Experience timeline) need to know the cursor position. Each one
// installing its own `window.addEventListener('mousemove')` means N
// listeners + N getBoundingClientRect() calls per pointer move, which
// is painful when N grows (we have 7 timeline rows). This module
// exposes a single shared listener; consumers read the cached
// position from `getMouseX()` / `getMouseY()` during their own RAF
// tick instead of subscribing to events.

let _x = -9999
let _y = -9999
let _refs = 0
let _attached = false

function _onMove(e) {
  _x = e.clientX
  _y = e.clientY
}

// Reference-counted attach/detach so the listener exists exactly while at
// least one consumer is mounted. Returns the unsubscribe function.
export function subscribeMouse() {
  _refs += 1
  if (!_attached) {
    window.addEventListener('mousemove', _onMove, { passive: true })
    _attached = true
  }
  return () => {
    _refs -= 1
    if (_refs <= 0 && _attached) {
      window.removeEventListener('mousemove', _onMove)
      _attached = false
      _refs = 0
    }
  }
}

export function getMouseX() {
  return _x
}

export function getMouseY() {
  return _y
}
