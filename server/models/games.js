const uuidV4 = require('uuid/v4')
const Game = require('../models/game')

/** All games are store on field corresponding to id */
const games = {

}

module.exports = {
  create(width, height, mines) {
    const game = new Game(width, height, mines) 
    const uuid = uuidV4()
    games[uuid] = game
    return uuid
  },
  get(id) {
    return games[id]
  }
}