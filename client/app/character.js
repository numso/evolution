/* @flow */

import PIXI from 'pixi.js'
import {any} from 'lodash'

import {keyMap, LEFT, RIGHT, UP, SHIFT, CTRL} from './input'
import {jump, land} from './music'
import * as C from './constants'

export var lightMask = new PIXI.Sprite.fromImage('img/alpha-mask.png')
function rescaleLight(num) {
  if (num > 1) {
    num = 1
  } else if (num < 0.4) {
    num = 0.4
  }
  lightMask.scale.x = lightMask.scale.y = num
}

function createCharacter() {
  var char = new PIXI.Sprite.fromImage('img/beardy.png')
  char.scale.x = char.scale.y = 0.0625
  char.position.x = 230
  char.position.y = C.HEIGHT - char.height
  return char
}

var char = createCharacter()
export var container = char

var dy = 0
var dx = 0
var dl = 0
var onGround = true
var posture = C.POSTURE_STANDING
var light = 1
var minLight = 0

export function update(obstacles: any) {
  // UPDATE X
  var oldX = char.position.x
  if (keyMap[LEFT]) {
    if (keyMap[SHIFT]) {
      dx -= C.RUN_ACCEL
      dx = Math.max(dx, -C.RUN_MAX_SPEED)
      setPosture(C.POSTURE_RUNNING)
    } else if (keyMap[CTRL]) {
      dx -= C.CROUCH_ACCEL
      dx = Math.max(dx, -C.CROUCH_MAX_SPEED)
      setPosture(C.POSTURE_CROUCHING)
    } else {
      dx -= C.ACCEL
      dx = Math.max(dx, -C.MAX_SPEED)
      setPosture(C.POSTURE_WALKING)
    }
  } else if (keyMap[RIGHT]) {
    if (keyMap[SHIFT]) {
      dx += C.RUN_ACCEL
      dx = Math.min(dx, C.RUN_MAX_SPEED)
      setPosture(C.POSTURE_RUNNING)
    } else if (keyMap[CTRL]) {
      dx += C.CROUCH_ACCEL
      dx = Math.min(dx, C.CROUCH_MAX_SPEED)
      setPosture(C.POSTURE_CROUCHING)
    } else {
      dx += C.ACCEL
      dx = Math.min(dx, C.MAX_SPEED)
      setPosture(C.POSTURE_WALKING)
    }
  } else {
    if (dx > 0) {
      dx -= C.ACCEL
      dx = Math.max(0, dx)
      setPosture(C.POSTURE_WALKING)
    } else if (dx < 0) {
      dx += C.ACCEL
      dx = Math.min(0, dx)
      setPosture(C.POSTURE_WALKING)
    } else {
      setPosture(C.POSTURE_STANDING)
    }
  }
  char.position.x += dx
  if (char.position.x < 0) {
    char.position.x = 0
  }
  if (char.position.x > C.WIDTH - char.width) {
    char.position.x = C.WIDTH - char.width
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
      dy = C.SPRING
      jump.play()
    }
  }
  var oldOnGround = onGround
  onGround = false
  dy += C.GRAVITY
  char.position.y += dy
  if (char.position.y > C.HEIGHT - char.height) {
    char.position.y = C.HEIGHT - char.height
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
  var maxSpeed = posture * 4
  if (speed > 0 && light > 0.4) {
    dl = ((speed) * (-.0001 * maxSpeed))
    light += dl
  } else if (light < 1) {
    dl = .01
    light += dl
  }

  rescaleLight(light)

  // var mod = (8 - speed) / 8
  // mod = mod * 0.6 + 0.4
  // rescaleLight(mod)
  lightMask.position.x = char.position.x + char.width / 2 - lightMask.width / 2 + 25
  lightMask.position.y = char.position.y + char.height / 2 - lightMask.height / 2 - 8
}

function setPosture(newPosture) {
  posture = newPosture
}

function doesCollide(obj1, obj2) {
  return (obj1.x + obj1.width > obj2.x && obj1.x < obj2.x + obj2.width)
    && (obj1.y + obj1.height > obj2.y && obj1.y < obj2.y + obj2.height)
}
