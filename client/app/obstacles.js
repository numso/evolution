/* @flow */

import PIXI from 'pixi.js'
import {each} from 'lodash'

import {OBS_COLOR} from './constants'
import gameMap from './maps/test'

function createObstacle(x, y, w, h) {
  var obs = new PIXI.Graphics()
  obs.beginFill(OBS_COLOR)
  obs.drawRect(0, 0, w, h)
  obs.endFill()
  obs.position.x = x
  obs.position.y = y
  return obs
}

export var container = new PIXI.Container()
export var obstacles: Array<any> = []

each(gameMap.obstacles, (obs) => {
  var gameObject = createObstacle(obs.x, obs.y, obs.w, obs.h)
  container.addChild(gameObject)
  obstacles.push(gameObject)
})

export function update() {

}
