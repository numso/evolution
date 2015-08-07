/* @flow */

import PIXI from 'pixi.js'
import {any} from 'lodash'

import {keyMap, LEFT, RIGHT, UP} from './input'
import {WIDTH, HEIGHT, CHAR_COLOR, SPRING, GRAVITY, ACCEL, MAX_SPEED} from './constants'

function createCharacter() {
  var char = new PIXI.Graphics()
  char.lineStyle(5, CHAR_COLOR, 1)
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
  char.beginFill(CHAR_COLOR)
  char.drawRect(10, 5, 30, 30)
  char.endFill()
  return char
}

var char = createCharacter()
char.position.x = WIDTH - 50 - 200
char.position.y = HEIGHT - 125
export var container = char

var dy = 0
var dx = 0
var onGround = true

export function update(obstacles: any) {
  // UPDATE X
  var oldX = char.position.x
  if (keyMap[LEFT]) {
    dx -= ACCEL
    dx = Math.max(dx, -MAX_SPEED)
  } else if (keyMap[RIGHT]) {
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
  if (char.position.x > WIDTH - 50) {
    char.position.x = WIDTH - 50
  }
  // if character collides, x wise, go back to old x
  var collidesX = any(obstacles, obs => doesCollide(char, obs))
  if (collidesX) {
    char.position.x = oldX
  }
  // UPDATE Y
  var oldY = char.position.y
  if (keyMap[UP]) {
    if (onGround) {
      dy = SPRING
    }
  }
  onGround = false
  dy += GRAVITY
  char.position.y += dy
  if (char.position.y > HEIGHT - 125) {
    char.position.y = HEIGHT - 125
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


function doesCollide(obj1, obj2) {
  return (obj1.x + obj1.width > obj2.x && obj1.x < obj2.x + obj2.width)
    && (obj1.y + obj1.height > obj2.y && obj1.y < obj2.y + obj2.height)
}
