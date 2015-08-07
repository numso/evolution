/* @flow */

export var LEFT = 37
export var UP = 38
export var RIGHT = 39
export var DOWN = 40
export var SPACE = 32 // I think?

export var keyMap: Array<bool> = []

document.addEventListener('keydown', function (e) {
  keyMap[e.keyCode] = true
})

document.addEventListener('keyup', function (e) {
  keyMap[e.keyCode] = false
})
