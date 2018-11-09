function createDraggable(el) {
  let x = 0, ex = 0
  el.addEventListener('mousedown', HandleMouseDown)
  
  function HandleMouseDown(evt) {
    x = evt.x
    ex = el.getBoundingClientRect().x
    el.addEventListener('mousemove', HandleMouseMove)
    el.addEventListener('mouseup', HandleMouseUp)
  }

  function HandleMouseUp(evt) {
    el.removeEventListener('mousemove', HandleMouseMove)
    el.removeEventListener('mouseup', HandleMouseUp)
  }

  function HandleMouseMove(evt) {
    el.style.transform = `translateX(${ex + evt.x - x}px)`
  }
}

createDraggable(document.getElementById('el'))
