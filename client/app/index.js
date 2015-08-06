/* @flow */

// This is very much hacky. Just trying to throw something together in the smallest amount of time.
// It will get better. I promise

import PIXI from 'pixi.js'
import {any} from 'lodash'

var renderer = PIXI.autoDetectRenderer()
// renderer.view.style.width = window.innerWidth + 'px'
// renderer.view.style.height = window.innerHeight + 'px'
renderer.view.style.display = 'block'
document.body.appendChild(renderer.view)

// create background
var bg = new PIXI.Graphics()
bg.beginFill(0xBAFFD9)
bg.drawRect(0, 0, 800, 600)
bg.endFill()

// create obstacle
var obs1 = new PIXI.Graphics()
obs1.beginFill(0x774320)
obs1.drawRect(0, 0, 300, 20)
obs1.endFill()
obs1.position.x = 300
obs1.position.y = 280

// create obstacle
var obs2 = new PIXI.Graphics()
obs2.beginFill(0x774320)
obs2.drawRect(0, 0, 300, 20)
obs2.endFill()
obs2.position.x = 100
obs2.position.y = 450

// create obstacle
var obs3 = new PIXI.Graphics()
obs3.beginFill(0x774320)
obs3.drawRect(0, 0, 150, 150)
obs3.endFill()
obs3.position.x = 800 - 150
obs3.position.y = 600 - 150

// create character
var char = new PIXI.Graphics()
char.lineStyle(5, 0x4731FF, 1)
char.beginFill(null, 0)
char.moveTo(0, 125)
char.lineTo(25, 75)
char.moveTo(50, 125)
char.lineTo(25, 75)
char.moveTo(25, 75)
char.lineTo(25, 25)
char.moveTo(0, 50)
char.lineTo(50, 50)
char.endFill()
char.beginFill(0x4731FF)
char.drawRect(10, 5, 30, 30)
char.endFill()

char.position.x = 800 - 50 - 200
char.position.y = 600 - 125

// create stage
var stage = new PIXI.Container()
stage.addChild(bg)
stage.addChild(char)
stage.addChild(obs1)
stage.addChild(obs2)
stage.addChild(obs3)

var obstacles = [obs1, obs2, obs3]

function gameLoop() {
  requestAnimationFrame(gameLoop)
  update()
  renderer.render(stage)
}

var dy = 0
var dx = 0
var SPRING = -25
var GRAVITY = 1.5
var ACCEL = 1
var MAX_SPEED = 8
var onGround = true
function update() {
  // UPDATE X
  var oldX = char.position.x
  if (keyMap[37]) {
    dx -= ACCEL
    dx = Math.max(dx, -MAX_SPEED)
  } else if (keyMap[39]) {
    dx += ACCEL
    dx = Math.min(dx, MAX_SPEED)
  } else {
    if (dx > 0) {
      dx -= ACCEL
      dx = Math.max(0, dx)
    } else if (dx < 0) {
      dx += ACCEL
      dx = Math.min(0, dx)
    }
  }
  char.position.x += dx
  if (char.position.x < 0) {
    char.position.x = 0
  }
  if (char.position.x > 800 - 50) {
    char.position.x = 800 - 50
  }
  // if character collides, x wise, go back to old x
  var collidesX = any(obstacles, obs => doesCollide(char, obs))
  if (collidesX) {
    char.position.x = oldX
  }
  // UPDATE Y
  var oldY = char.position.y
  if (keyMap[38]) {
    if (onGround) {
      dy = SPRING
    }
  }
  onGround = false
  dy += GRAVITY
  char.position.y += dy
  if (char.position.y > 600 - 125) {
    char.position.y = 600 - 125
    dy = 0
    onGround = true
  }
  // if character collides, y wise, go back to old y
  var collidesY = any(obstacles, obs => doesCollide(char, obs))
  if (collidesY) {
    char.position.y = oldY
    if (dy > 0) {
      onGround = true
    }
    dy = 0
  }
}

requestAnimationFrame(gameLoop)


var keyMap = []
document.addEventListener('keydown', function (e) {
  keyMap[e.keyCode] = true
})
document.addEventListener('keyup', function (e) {
  keyMap[e.keyCode] = false
})

function doesCollide(obj1, obj2) {
  return (obj1.x + obj1.width > obj2.x && obj1.x < obj2.x + obj2.width)
    && (obj1.y + obj1.height > obj2.y && obj1.y < obj2.y + obj2.height)
}
