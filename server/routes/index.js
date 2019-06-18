var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser')
const uuidV4 = require('uuid/v4')
const Game = require('../models/game')
var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({port: 3030, path:'/game'})
console.log('hey')
wss.on('connection', function (ws) {
  ws.on('message', function (message) {
    console.log('received: %s', message)
  })
})
const games = {

}
router.use(bodyParser.json())

router.post('/games', async function(req, res, next) {
  const game = new Game() 
  const uuid = uuidV4()
  games[uuid] = game
  res.send(uuid)
})
router.post('/games/:id/activate', async function(req, res, next) {
  const game = games[req.params.id] 
  game.activate(req.body)
  sendGame(game)
  res.send('ok')
})

router.post('/games/:id/putFlag', async function(req, res, next) {
  const game = games[req.params.id] 
  game.putFlag(req.body)
  sendGame(game)
  res.send('ok')
})
router.get('/games/:id', async function(req, res, next) {
  const game = games[req.params.id]
  if(!game) res.status(404).send('No game')
  else res.send({
    gameOver: game.gameOver,
    time: game.time,
    map: game.map,
    success: game.success,
    nbMines: game.nbMines,
    nbFlags: game.nbFlags,
    width: game.width,
    height: game.height,
  })
});

function sendGame(game) {
  wss.clients.forEach(client => client.send(JSON.stringify({
    gameOver: game.gameOver,
    time: game.time,
    map: game.map,
    success: game.success,
    nbMines: game.nbMines,
    nbFlags: game.nbFlags,
    width: game.width,
    height: game.height,
  })))
}

module.exports = router;
