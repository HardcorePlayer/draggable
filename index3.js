function createDraggable(el) {
  let x = 0
  
  el.addEventListener('mousedown', HandleMouseDown)
  el.style.position = 'absolute'
  el.style.left = el.getBoundingClientRect().x + 'px'
  
  function HandleMouseDown(evt) {
    x = evt.x
    el.addEventListener('mousemove', HandleMouseMove)
    el.addEventListener('mouseup', HandleMouseUp)
  }

  function HandleMouseUp(evt) {
    el.style.left = el.getBoundingClientRect().x + 'px'
    el.style.transform = `translateX(0)`
    el.removeEventListener('mousemove', HandleMouseMove)
    el.removeEventListener('mouseup', HandleMouseUp)
  }

  function HandleMouseMove(evt) {
    el.style.transform = `translateX(${evt.x - x}px)`
  }
}
