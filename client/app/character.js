/* @flow */

import PIXI from 'pixi.js'
import {any, map, range} from 'lodash'

import {keyMap, LEFT, RIGHT, UP, SHIFT, CTRL} from './input'
import {jump, land} from './music'
import * as C from './constants'
import gameMap from './maps/test'

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
  var imgs = map(range(1, 5), num => `img/char/frame0${num}_handUp.png`)
  var textureArray = map(imgs, img => PIXI.Texture.fromImage(img))
  var char = new PIXI.MovieClip(textureArray)
  char.animationSpeed = 0.2
  char.scale.x = char.scale.y = 0.0625
  char.anchor.x = char.anchor.y = 0.5
  return char
}

export var container = new PIXI.Container()
var char = createCharacter()
char.gotoAndStop(1)
container.addChild(char)
var torch = new PIXI.Sprite.fromImage('img/char/torch.png')
torch.scale.x = torch.scale.y = 0.0625
torch.position.x = 22
torch.position.y = -23
container.addChild(torch)
container.position.x = 230
container.position.y = gameMap.height - char.height

var dy = 0
var dx = 0
var dl = 0
var onGround = true
var posture = C.POSTURE_STANDING
var light = 1
// var minLight = 0

export function update(obstacles: any) {
  // UPDATE X
  var oldX = container.position.x
  if (keyMap[LEFT]) {
    container.scale.x = -1
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
    container.scale.x = 1
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
  var isMoving = dx !== 0
  container.position.x += dx
  if (container.position.x < char.width / 2) {
    container.position.x = char.width / 2
    isMoving = false
  }
  if (container.position.x > gameMap.width - char.width / 2) {
    container.position.x = gameMap.width - char.width / 2
    isMoving = false
  }
  // if character collides, x wise, go back to old x
  var collidesX = any(obstacles, obs => doesCollide(container, obs))
  if (collidesX) {
    container.position.x = oldX
    isMoving = false
  }
  if (isMoving) {
    char.play()
  } else {
    char.gotoAndStop(1)
  }
  // UPDATE Y
  var oldY = container.position.y
  if (keyMap[UP]) {
    if (onGround) {
      dy = C.SPRING
      jump.play()
    }
  }
  var oldOnGround = onGround
  onGround = false
  dy += C.GRAVITY
  container.position.y += dy
  if (container.position.y > gameMap.height - char.height / 2) {
    container.position.y = gameMap.height - char.height / 2
    dy = 0
    onGround = true
    if (!oldOnGround) {
      land.play()
    }
  }
  // if character collides, y wise, go back to old y
  var collidesY = any(obstacles, obs => doesCollide(container, obs))
  if (collidesY) {
    container.position.y = oldY
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
  var X_OFFSET = container.scale.x === -1 ? -25 : 25
  lightMask.position.x = container.position.x - lightMask.width / 2 + X_OFFSET
  lightMask.position.y = container.position.y - lightMask.height / 2 - 8
}

function setPosture(newPosture) {
  posture = newPosture
}

function doesCollide(obj1, obj2) {
  var w1 = Math.abs(obj1.width)
  var x1 = obj1.x - w1 / 2
  var y1 = obj1.y - obj1.height / 2
  return (x1 + w1 > obj2.x && x1 < obj2.x + obj2.width)
    && (y1 + obj1.height > obj2.y && y1 < obj2.y + obj2.height)
}
