function Game(width = 20, height = 20, mines = 100) {
  this.timeInterval = null
  this.time = 0
  this.map = []
  this.success = true
  this.gameOver  = false
  this.nbMines = +mines
  this.nbFlags = this.nbMines
  this.width = +width
  this.height = +height

  this.launchTime()
  this.generateMap()
  this.putMines()
  this.calculateNeighborhood()
}
Game.prototype.calculateNeighborhood = function() {
  this.map.map(x => {
    x.map(cell => {
      if(cell.mine) return
      const O = this.map[cell.x - 1] && this.map[cell.x - 1][cell.y].mine ? 1 : 0
      const E = this.map[cell.x + 1] && this.map[cell.x + 1][cell.y].mine ? 1 : 0
      const N = this.map[cell.x][cell.y - 1] && this.map[cell.x][cell.y - 1].mine ? 1 : 0
      const S = this.map[cell.x][cell.y + 1] && this.map[cell.x][cell.y + 1].mine ? 1 : 0
      const NO = this.map[cell.x - 1] && this.map[cell.x - 1][cell.y - 1] &&  this.map[cell.x - 1][cell.y - 1] .mine ? 1 : 0
      const NE = this.map[cell.x + 1] && this.map[cell.x + 1][cell.y - 1] &&  this.map[cell.x + 1][cell.y - 1] .mine ? 1 : 0
      const SE = this.map[cell.x + 1] && this.map[cell.x + 1][cell.y + 1] &&  this.map[cell.x + 1][cell.y + 1] .mine ? 1 : 0
      const SO = this.map[cell.x - 1] && this.map[cell.x - 1][cell.y + 1] &&  this.map[cell.x - 1][cell.y + 1] .mine ? 1 : 0
      cell.number = O + E + N + S + NO + NE + SE + SO
    })
  })
}
Game.prototype.generateMap = function() {
  this.map = Array(this.width).fill('').map((_, x) => {
    return Array(this.height).fill('').map((_, y) => {
      return {
        x, y
      }
    })
  })
},
Game.prototype.activate = function(cell) {
  cell = this.map[cell.x][cell.y]
  if(cell.flag) return
  cell.active = true
  if(cell.mine) {
    this.setGameOver()
  }
  if(cell.number === 0) {
    this.resolveBlank(cell)
  }
}

Game.prototype.launchTime = function() {
  this.timeInterval = setInterval(() => {
    if(this.gameOver) return 
    this.time++ 
  }, 1000);
}

Game.prototype.putFlag = function(cell) {
  cell = this.map[cell.x][cell.y]
  if(this.nbFlags > 0 && !cell.active) {
    this.nbFlags = cell.flag ? this.nbFlags + 1 : this.nbFlags - 1
    cell.flag = !cell.flag
  }
  if(this.nbFlags <= 0) {
    this.setGameOver()
  }
}

Game.prototype.setGameOver = function() {
  if(this.gameOver) return 
  this.end()
  this.gameOver = true
  clearInterval(this.timeInterval)
}


Game.prototype.end = function() {
  this.map.map(x => {
    x.map(cell => {
      if(!cell.flag && cell.mine && this.success)  this.success = false
      cell.active = true
    })
  })
}

Game.prototype.resolveBlank = function(cell) {
  if(this.map[cell.x - 1] && this.map[cell.x - 1][cell.y].number === 0 && this.map[cell.x - 1] && !this.map[cell.x - 1][cell.y].active) { // O
    this.map[cell.x - 1][cell.y].active = true
    this.resolveBlank(this.map[cell.x - 1][cell.y])
  } else if(this.map[cell.x - 1] && this.map[cell.x - 1][cell.y] && !this.map[cell.x - 1][cell.y].active) {
    this.map[cell.x - 1][cell.y].active = true
  }
  if(this.map[cell.x + 1] && this.map[cell.x + 1][cell.y].number === 0 && !this.map[cell.x + 1][cell.y].active) { // E
    this.map[cell.x + 1][cell.y].active = true
    this.resolveBlank(this.map[cell.x + 1][cell.y])
  } else if(this.map[cell.x + 1] && this.map[cell.x + 1][cell.y] && !this.map[cell.x + 1][cell.y].active) {
    this.map[cell.x + 1][cell.y].active = true
  }
  if(this.map[cell.x][cell.y - 1] && this.map[cell.x][cell.y - 1].number === 0 && !this.map[cell.x][cell.y - 1].active) { // N
    this.map[cell.x][cell.y - 1].active = true
    this.resolveBlank(this.map[cell.x][cell.y - 1])
  } else if(this.map[cell.x][cell.y - 1] && this.map[cell.x][cell.y - 1] && !this.map[cell.x][cell.y - 1].active) {
    this.map[cell.x][cell.y - 1].active = true
  }
  if(this.map[cell.x][cell.y + 1] && this.map[cell.x][cell.y + 1].number === 0 && !this.map[cell.x][cell.y + 1].active) { // S
    this.map[cell.x][cell.y + 1].active = true
    this.resolveBlank(this.map[cell.x][cell.y + 1])
  } else if(this.map[cell.x][cell.y + 1] && this.map[cell.x][cell.y + 1] && !this.map[cell.x][cell.y + 1].active) {
    this.map[cell.x][cell.y + 1].active = true
  }
}
Game.prototype.putMines = function(nbMines = this.nbMines, retry = 100) {
  if(!retry) return
  if(nbMines) {
    const x = Math.floor(Math.random() * this.width)
    const y = Math.floor(Math.random() * this.height)
    if(this.map[x][y].mine)  return this.putMines(nbMines, retry - 1)
    this.map[x][y].mine = true
    return this.putMines(nbMines - 1, 100)
  }
}

module.exports = Game