const Game = require('../models/game')

/** All games are store on field corresponding to id */
const games = {

}

module.exports = {
  create(width, height, mines) {
    const game = new Game(width, height, mines) 
    games[game.id] = game
    return game.id
  },
  get(id) {
    return games[id]
  }
}