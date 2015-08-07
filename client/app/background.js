/* @flow */

import PIXI from 'pixi.js'
import {WIDTH, HEIGHT} from './constants'

var sky = new PIXI.Graphics()
sky.beginFill(0x98c2ea)
sky.drawRect(0, 0, WIDTH, HEIGHT)
sky.endFill()

var cloud = new PIXI.Sprite.fromImage('img/cloud01.svg')
cloud.position.x = 10
cloud.position.y = 10

var cloud2 = new PIXI.Sprite.fromImage('img/cloud02.svg')
cloud2.position.x = 400
cloud2.position.y = 120

var tree = new PIXI.Sprite.fromImage('img/tree01.svg')
tree.position.x = 50

export var container = new PIXI.Container()
container.addChild(sky)
container.addChild(cloud)
container.addChild(cloud2)
container.addChild(tree)

export function update() {
  tree.position.y = HEIGHT - tree.height

  cloud.position.x -= 0.2
  if (cloud.position.x + cloud.width < 0) {
    cloud.position.x = WIDTH
  }

  cloud2.position.x -= 0.1
  if (cloud2.position.x + cloud2.width < 0) {
    cloud2.position.x = WIDTH
  }
}
