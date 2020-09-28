const SISCO_OPTIONS = {
  id: 'sisco',
  startAt: 0,
}

const CISCO_CLASSES = {
  MOVE: 'sisco--moving', 
  ACTIVE: 'sisco--active',
}

function sisco(id, ...args) {
  if (typeof id !== 'string') return console.error('CISCO: Invalid id provided')
  const element = document.getElementById(id)
  if (!element) return console.error(`CISCO: Element id "${id}" not found`)
  
  let callback
  let options = {}
  if (typeof args[0] === 'function') {
    callback = args[0]
  } else if (typeof args[0] === 'object') {
    options = args[0]
    if (args[1]) callback = args[1]
  }

  const props = {
    ...SISCO_OPTIONS,
    ...options,
  }

  let currentChild = element.children[props.startAt]
  let currentPosition = props.startAt
  let state = { left: 0, x: 0, startX: 0, isDragging: false }
  let isScrolling
  element.children[currentPosition].classList.add(CISCO_CLASSES.ACTIVE)

  const handleCallback = () => {
    if (typeof callback === 'function') {
      const result = {
        position: currentPosition,
        child: currentChild,

      }
      callback(result)
    }
  }

  const setCurrent = (nextPosition) => {
    if (nextPosition < 0 || nextPosition >= element.children.length) return null
    currentChild.classList.remove(CISCO_CLASSES.ACTIVE)
    currentPosition = nextPosition

    currentChild = element.children[currentPosition]
    element.scrollLeft = currentChild.offsetLeft

    handleCallback()
  }

  const next = () => setCurrent(currentPosition + 1)
  const previous = () => setCurrent(currentPosition - 1)

  const setCurrentChild = () => {
    let i = 0
    for (let child of element.children) {
      child.classList.remove(CISCO_CLASSES.ACTIVE)
      if (child.offsetLeft === element.scrollLeft) {
        currentPosition = i
        currentChild = child
        currentChild.classList.add(CISCO_CLASSES.ACTIVE)
      }
      ++i
    }
  }

  const mouseDownHandler = function(e) {
    element.classList.add(CISCO_CLASSES.MOVE)
    element.style.scrollBehavior = 'unset'

    state.left = element.scrollLeft
    state.x = e.clientX
    state.startX = e.clientX
    state.isDragging = true
    
    document.addEventListener('mousemove', mouseMoveHandler)
    document.addEventListener('mouseup', mouseUpHandler)
  }

  const mouseMoveHandler = function(e) {
    const dx = e.clientX - state.x
    element.scrollLeft = (state.left - dx)
  }

  const mouseUpHandler = function(e) {
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)

    state.isDragging = false
    element.classList.remove(CISCO_CLASSES.MOVE)
    element.style.scrollBehavior = ''

    const dx = state.startX - e.clientX
    const direction = dx > 0 ? 1 : -1
    setCurrent(currentPosition + direction)
  }

  element.addEventListener('mousedown', mouseDownHandler)

  element.addEventListener('scroll', () => {
    window.clearTimeout( isScrolling )
    isScrolling = setTimeout(() => {
        if (!state.isDragging) setCurrentChild()
    }, 66)
  }, false)

  element.addEventListener('touchstart', () => {
    element.classList.add(CISCO_CLASSES.IS_MOVING)
    state.isDragging = true
  })

  element.addEventListener('touchend', () => {
    element.classList.remove(CISCO_CLASSES.IS_MOVING)
    state.isDragging = false
  })

  return {
    next,
    previous,
    setCurrent,
  }
}
