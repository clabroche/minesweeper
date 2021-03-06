<template>
  <div class="game-root" ref="gameContainer">
    <div class="header">
      <button class="home" @click="$router.push({name: 'games'})"><i class="fas fa-home"/> </button>
      <div class="flagRemains"><i class="fas fa-flag"/> {{game.nbFlags}}</div>
      <div class="gameStatus"><i class="fas" :class="{'fa-check': game.success,'fa-times': !game.success }"/> </div>
      <div class="time"><i class="fas fa-clock"/> {{game.time}}</div>
      <div class="restart" v-if="game.gameOver" @click="reset"><i class="fas fa-undo"/> </div>
      <div class="zoom">
        <button class="subtract" @click="decreaseSize()"> <i class="fas fa-minus"></i> </button>
        Zoom
        <button class="add" @click="increaseSize()"> <i class="fas fa-plus"></i> </button>
      </div>
    </div>
    <div class="game-container">
      <div v-for="(row, x) of map" class="row" :key="'row-' + x">
        <div v-for="cell of row " class="cell" :class="{'cell-active': cell.active, 'cell-flag': cell.flag, 'cell-hover': !cell.active}"
          :style="{width: size + 'px', height: size + 'px' }"
          v-longclick="_ => putFlag(cell)"
          @click="activate(cell)"
          @click.right="putFlag(cell, $event)" :key="cell.x + '-' + cell.y">
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
import { longClickDirective } from 'vue-long-click'
export default {
  name: 'game',
  components: {
  },
  props: {
  },
  directives: {
    'dragscroll': dragscroll,
    longclick:  longClickDirective({interval: 10000000000000000})
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
    this.ws = new WebSocket(process.env.VUE_APP_SOCKET + '/game');
    this.loadGame()
    this.ws.onopen =  () => {
      this.ws.send('currentGame' + this.$route.params.id)
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
      setTimeout(() => {
        document.querySelectorAll('.cell').forEach(cell => {
          cell.oncontextmenu = function(event) {
            console.log('cell')
              event.preventDefault();
              event.stopPropagation(); // not necessary in my case, could leave in case stopImmediateProp isn't available? 
              event.stopImmediatePropagation();
              return false;
          };
        })
      }, 10);
      
      this.ws.send('currentGame' + this.$route.params.id)

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
      if ($event) $event.preventDefault()
      if(this.drag || this.flagActivate) return
      this.flagActivate= true 
      setTimeout(() => {
        this.flagActivate = false
      }, 400);
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
    button {
      width: 30px;
      height: 30px;
    }
    .zoom {
      display: flex;
      align-items: center;
      font-weight: bold;
      button {
        margin: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .game-container {
    display: flex;
    overflow: auto;
    height: calc(100vh - 50px);
  }
}
.cell {
  align-items: center;
  background-color: rgba(255,255,255, 0.3);
  border-radius: 4px;
  border: 2px solid #353b4f;
  display: flex;
  font-weight: 410;
  height: 40px;
  justify-content: center;
  transform: translateZ(0);
  transition-property: background-color;
  transition: 300ms;
  user-select: none;
  width: 40px;
}
.cell-active {
  background-color: rgba(255,255,255, 0.2);
}
.cell-flag {
  background-color: transparent;
  color: #5ff386;
}
.cell-hover:hover {
  background-color: #5b5e6b
}
</style>
