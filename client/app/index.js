/* @flow */

import PIXI from 'pixi.js'

import * as music from './music'
import * as bg from './background'
import * as fg from './foreground'
import * as char from './character'
import * as obstacles from './obstacles'

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
stage.mask = char.lightMask

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
}

music.bg.play()
window.requestAnimationFrame(gameLoop)
