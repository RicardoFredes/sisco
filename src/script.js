const CLASSES = { IS_MOVING: 'siscom--is-moving', ACTIVE: 'active' }
const container = document.getElementById('siscom-items')
const previous = document.getElementById('previous')
const next = document.getElementById('next')

let currentChild = container.children[0]
let currentPosition = 0
let containerScrollPosition = { left: 0, x: 0, i: 0 }
let isDrag = false

container.children[0].classList.add(CLASSES.ACTIVE)

const mouseDownHandler = function(e) {
    container.classList.add(CLASSES.IS_MOVING)
    container.style.scrollBehavior = 'unset'
    isDrag = true

    containerScrollPosition = {
        left: container.scrollLeft,
        x: e.clientX,
        i: e.clientX
    }

    document.addEventListener('mousemove', mouseMoveHandler)
    document.addEventListener('mouseup', mouseUpHandler)
}

const mouseMoveHandler = function(e) {
    const dx = e.clientX - containerScrollPosition.x
    container.scrollLeft = (containerScrollPosition.left - dx)
}

const mouseUpHandler = function(e) {
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)

    isDrag = false
    container.classList.remove(CLASSES.IS_MOVING)
    container.style.scrollBehavior = ''

    const dx = containerScrollPosition.i - e.clientX
    const direction = dx > 0 ? 1 : -1
    movePosition(currentPosition + direction)
}

next.onclick = () => movePosition(currentPosition + 1)
previous.onclick = () => movePosition(currentPosition - 1)

function movePosition(nextPosition) {
    if (nextPosition < 0 || nextPosition >= container.children.length) return null
    currentChild.classList.remove(CLASSES.ACTIVE)
    currentPosition = nextPosition

    currentChild = container.children[currentPosition]
    container.scrollLeft = currentChild.offsetLeft
}

container.addEventListener('mousedown', mouseDownHandler)

var isScrolling
container.addEventListener('scroll', (e) => {
    window.clearTimeout( isScrolling )
    isScrolling = setTimeout(() => {
        if (!isDrag) ChangeCurrentChild()
    }, 66)
}, false)

container.addEventListener('touchstart', () => {
    container.classList.add(CLASSES.IS_MOVING)
    isDrag = true
})
container.addEventListener('touchend', () => {
    container.classList.remove(CLASSES.IS_MOVING)
    isDrag = false
})

function ChangeCurrentChild() {
    let i = 0
    for (let child of container.children) {
        child.classList.remove(CLASSES.ACTIVE)
        if (child.offsetLeft === container.scrollLeft) {
            currentPosition = i
            currentChild = child
            currentChild.classList.add(CLASSES.ACTIVE)
            console.log(i)
        }
        ++i
    }

}