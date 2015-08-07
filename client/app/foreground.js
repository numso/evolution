/* @flow */

import PIXI from 'pixi.js'
import {HEIGHT} from './constants'

var tree = new PIXI.Sprite.fromImage('img/tree02.svg')
tree.position.x = 350

export var container = new PIXI.Container()
container.addChild(tree)

export function update() {
  tree.position.y = HEIGHT - tree.height
}
