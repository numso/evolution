/* @flow */

import PIXI from 'pixi.js'

import gameMap from './maps/test'

var tree = new PIXI.Sprite.fromImage('img/tree02.svg')
tree.position.x = 450

export var container = new PIXI.Container()
container.addChild(tree)

export function update() {
  tree.position.y = gameMap.height - tree.height
}
