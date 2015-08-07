/* @flow */

import PIXI from 'pixi.js'

import {WIDTH, HEIGHT, OBS_COLOR} from './constants'

function createObstacle(w, h, x, y) {
  var obs = new PIXI.Graphics()
  obs.beginFill(OBS_COLOR)
  obs.drawRect(0, 0, w, h)
  obs.endFill()
  obs.position.x = x
  obs.position.y = y
  return obs
}

var obs1 = createObstacle(300, 20, 300, 280)
var obs2 = createObstacle(300, 20, 100, 450)
var obs3 = createObstacle(150, 150, WIDTH - 150, HEIGHT - 150)

export var container = new PIXI.Container()
container.addChild(obs1)
container.addChild(obs2)
container.addChild(obs3)

export function update() {

}

export var obstacles = [obs1, obs2, obs3]
