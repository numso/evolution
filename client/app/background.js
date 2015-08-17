/* @flow */

import PIXI from 'pixi.js'
import gameMap from './maps/test'

var sky = new PIXI.Graphics()
sky.beginFill(0x98c2ea)
sky.drawRect(0, 0, gameMap.width, gameMap.height)
sky.endFill()

var cloud = new PIXI.Sprite.fromImage('img/cloud01.svg')
cloud.position.x = 10
cloud.position.y = 10

var cloud2 = new PIXI.Sprite.fromImage('img/cloud02.svg')
cloud2.position.x = 400
cloud2.position.y = 320

var tree = new PIXI.Sprite.fromImage('img/tree01.svg')
tree.position.x = 50

var tree2 = new PIXI.Sprite.fromImage('img/tree01.svg')
tree2.position.x = 950

var tree3 = new PIXI.Sprite.fromImage('img/tree01.svg')
tree3.position.x = 1050

export var container = new PIXI.Container()
container.addChild(sky)
container.addChild(cloud)
container.addChild(cloud2)
container.addChild(tree)
container.addChild(tree2)
container.addChild(tree3)

export function update() {
  tree.position.y = gameMap.height - tree.height
  tree2.position.y = gameMap.height - tree2.height
  tree3.position.y = gameMap.height - tree3.height + 10

  cloud.position.x -= 0.2
  if (cloud.position.x + cloud.width < 0) {
    cloud.position.x = gameMap.width
  }

  cloud2.position.x -= 0.1
  if (cloud2.position.x + cloud2.width < 0) {
    cloud2.position.x = gameMap.width
  }
}
