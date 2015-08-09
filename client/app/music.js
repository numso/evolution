/* @flow */

import {Howl} from 'howler'

export var bg = new Howl({
  urls: ['snd/ossuary-5-rest.mp3'],
  volume: 0.5,
  loop: true
})

export var jump = new Howl({
  urls: ['snd/jump.mp3']
})

export var land = new Howl({
  urls: ['snd/land.mp3']
})
