/* @flow */

import PIXI from 'pixi.js'

import * as music from './music'
import * as bg from './background'
import * as fg from './foreground'
import * as char from './character'
import * as obstacles from './obstacles'
import {SCREEN_WIDTH, SCREEN_HEIGHT} from './constants'
import gameMap from './maps/test'

var renderer = PIXI.autoDetectRenderer()
// renderer.view.style.width = window.innerWidth + 'px'
// renderer.view.style.height = window.innerHeight + 'px'
renderer.view.style.display = 'block'
document.body.appendChild(renderer.view)

var stage = new PIXI.Container()
stage.addChild(bg.container)
stage.addChild(char.container)
stage.addChild(obstacles.container)
stage.addChild(fg.container)

stage.addChild(char.lightMask)
// stage.mask = char.lightMask
char.lightMask.visible = false

// DEBUG MODE
window.addEventListener('keydown', e => {
  if (e.keyCode === 68) {
    if (stage.mask) {
      stage.mask = null
      char.lightMask.visible = false
    } else {
      stage.mask = char.lightMask
      char.lightMask.visible = true
    }
  }
})

function gameLoop() {
  window.requestAnimationFrame(gameLoop)
  update()
  renderer.render(stage)
}

function update() {
  bg.update()
  char.update(obstacles.obstacles)
  obstacles.update()
  fg.update()
  updateStagePosition(char.container.position)
}

music.bg.play()
window.requestAnimationFrame(gameLoop)

function updateStagePosition(c) {
  var stageX = bound(c.x - SCREEN_WIDTH / 2, 0, gameMap.width - SCREEN_WIDTH)
  var stageY = bound(c.y - SCREEN_HEIGHT / 2, 0, gameMap.height - SCREEN_HEIGHT)
  stage.x = -stageX
  stage.y = -stageY
}

function bound(num, lower, upper) {
  return Math.min(Math.max(num, lower), upper)
}
