var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser')
const Games = require('../models/games')
var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({port: 3030, path:'/game'})

router.use(bodyParser.json())

router.post('/games', async function(req, res) {
  const {width, height, mines} = req.body
  const uuid = Games.create(width, height, mines)
  res.send(uuid)
})
router.post('/games/:id/activate', async function(req, res) {
  const game = Games.get(req.params.id) 
  game.activate(req.body)
  sendGame(game)
  res.send('ok')
})

router.post('/games/:id/putFlag', async function(req, res) {
  const game = Games.get(req.params.id) 
  game.putFlag(req.body)
  sendGame(game)
  res.send('ok')
})
router.get('/games/:id', async function(req, res) {
  const game = Games.get(req.params.id) 
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
