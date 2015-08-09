/* @flow */

import PIXI from 'pixi.js'
import {any} from 'lodash'

import {keyMap, LEFT, RIGHT, UP} from './input'
import {jump, land} from './music'
import {WIDTH, HEIGHT, SPRING, GRAVITY, ACCEL, MAX_SPEED} from './constants'

export var lightMask = new PIXI.Sprite.fromImage('img/alpha-mask.png')
function rescaleLight(num) {
  lightMask.scale.x = lightMask.scale.y = num
}

function createCharacter() {
  var char = new PIXI.Sprite.fromImage('img/beardy.png')
  char.scale.x = char.scale.y = 0.0625
  char.position.x = 230
  char.position.y = HEIGHT - char.height
  return char
}

var char = createCharacter()
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
  if (char.position.x > WIDTH - char.width) {
    char.position.x = WIDTH - char.width
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
      jump.play()
    }
  }
  var oldOnGround = onGround
  onGround = false
  dy += GRAVITY
  char.position.y += dy
  if (char.position.y > HEIGHT - char.height) {
    char.position.y = HEIGHT - char.height
    dy = 0
    onGround = true
    if (!oldOnGround) {
      land.play()
    }
  }
  // if character collides, y wise, go back to old y
  var collidesY = any(obstacles, obs => doesCollide(char, obs))
  if (collidesY) {
    char.position.y = oldY
    if (dy > 0) {
      onGround = true
      if (!oldOnGround) {
        land.play()
      }
    }
    dy = 0
  }

  // lightMask logic
  var speed = Math.abs(dx)
  var mod = (8 - speed) / 8
  mod = mod * 0.6 + 0.4
  rescaleLight(mod)
  lightMask.position.x = char.position.x + char.width / 2 - lightMask.width / 2 + 25
  lightMask.position.y = char.position.y + char.height / 2 - lightMask.height / 2 - 8
}


function doesCollide(obj1, obj2) {
  return (obj1.x + obj1.width > obj2.x && obj1.x < obj2.x + obj2.width)
    && (obj1.y + obj1.height > obj2.y && obj1.y < obj2.y + obj2.height)
}
