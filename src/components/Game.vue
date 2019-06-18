<template>
  <div class="game-root" ref="gameContainer">
    <div class="header">
      <div class="flagRemains"><i class="fas fa-flag"/> {{game.nbFlags}}</div>
      <div class="gameStatus"><i class="fas" :class="{'fa-check': game.success,'fa-times': !game.success }"/> </div>
      <div class="time"><i class="fas fa-clock"/> {{game.time}}</div>
      <div class="restart" v-if="game.gameOver" @click="reset"><i class="fas fa-undo"/> </div>
      <div class="zoom">
        <div class="subtract" @click="decreaseSize()"> - </div>
        Zoom
        <div class="add" @click="increaseSize()"> + </div>
      </div>
    </div>
    <div class="game-container" v-dragscroll @dragscrollstart="setDrag(true)" @dragscrollend="setDrag(false)">
      <div v-for="(row, x) of map" class="row" :key="'row-' + x">
        <div v-for="cell of row " class="cell" :class="{active: cell.active, flag: cell.flag}" :style="{width: size + 'px', height: size + 'px' }" @click="activate(cell)" @click.right="putFlag(cell, $event)" :key="cell.x + '-' + cell.y">
          <div v-if="cell.active && !cell.flag && !cell.mine && cell.number !== 0">{{cell.number}}</div>
          <div v-if="cell.flag"><i class="fas fa-flag"></i></div>
          <div v-if="cell.mine && cell.active && !cell.flag"><i class="fas fa-bomb"></i></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dragscroll } from 'vue-dragscroll'
import Game from '../models/game'
export default {
  name: 'game',
  components: {
  },
  props: {
  },
  directives: {
    'dragscroll': dragscroll
  },
  data() {
    return {
      map: [],
      game: {},
      drag: false,
      size: 20,
      ws: null
    }
  },
  beforeDestroy() {
    clearInterval(this.timeInterval)
  },
  async mounted() {
    this.ws = new WebSocket(process.env.VUE_APP_SOCKET);
    this.loadGame()
    this.ws.onopen =  () => {
        this.ws.send('connected')
    }
    this.ws.onmessage = ({data:ev}) => {
      const game = JSON.parse(ev)
      this.game = game
      this.map = game.map
      if(game.gameOver) clearInterval(this.timeInterval)
    }
    
  },
  methods: {
    async loadGame() {
      const game = await Game.get(this.$route.params.id)
        .catch(() => this.$router.push({name: 'games'}))
      this.game = game
      this.map = game.map
      if(!game.gameOver) {
        this.timeInterval = setInterval(() => {
          this.game.time++
        },1000)
      }
    },
    increaseSize() {
      this.changeSize(this.size + 6)
    },
    decreaseSize() {
      this.changeSize(this.size - 6)
    },
    changeSize(size) {
      this.size = size
      this.save()
    },
    setDrag(state) {
      if(!state) {
        setTimeout(() => {
          this.drag = false
        }, 100);
      } else {
        setTimeout(() => {
          this.drag = true
        }, 30);
      }
    },
    save() {
      localStorage.setItem('size', JSON.stringify(this.size))
    },
    async reset() {
      const {width, height, nbMines} = this.game
      const id = await Game.create(width, height, nbMines) 
      this.$router.push({name: 'game', params: {id}})
      this.loadGame()
    },
    restore() {
      try {
        this.size = JSON.parse(localStorage.getItem('size'))
        if(this.size === null) return false
        return true
      } catch (e) {
        return false
      }
    },
    async activate(cell) {
      if(this.drag) return
      await Game.activate(this.$route.params.id, cell)
    },
    async putFlag(cell, $event) {
      $event.preventDefault()
      await Game.putFlag(this.$route.params.id, cell)
    },
  }
}
</script>

<style scoped lang="scss">
.game-root {
  .header {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    box-shadow: 0px 2px 10px 2px black;
    .zoom {
      display: flex;
      align-items: center;
      font-size: 1.1em;
      font-weight: bold;
      div {
        width: 30px;
        height: 30px;
        border-radius: 100%;
        background-color: #4d5574;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 5px;
        margin-left: 5px;
      }
    }
  }
  .game-container {
    display: flex;
    overflow: auto;
    height: calc(100vh - 50px);
  }
  .cell {
    width: 40px;
    height: 40px;
    border: 2px solid #353b4f;
    background-color: rgba(255,255,255, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    &.active {
      background-color: rgba(255,255,255, 0.2);
    }
    &.flag {
      background-color: transparent;
      color: #5ff386;
    }
  }
}
</style>
