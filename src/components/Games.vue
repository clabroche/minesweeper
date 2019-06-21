<template>
  <div class="games-root" ref="preview">
    <h1>Create a game</h1>
    <div class="preset">
      <button class="easy" @click="setGame(20, 20, 20)">Easy</button>
      <button class="medium" @click="setGame(25, 25, 100)">Medium</button>
      <button class="hard" @click="setGame(30, 30, 200)">Hard</button>
      <button class="expert" @click="setGame(40, 40, 400)">Expert</button>
    </div>

    <div class="preview-container">
      <div class="width">
        <input type="number" v-model="width">
      </div>
      <div class="mines">
        <div class="mines-content">
          Number of mines
          <input type="number" v-model="mines">
        </div>
      </div>
      <div class="preview" >
        <div v-for="(row, x) of preview" class="row" :key="'row-' + x">
          <div
            v-for="(cell, y) of row"
            class="cell"
            :style="{height: 300 / +row.length + 'px', width: 300 / +preview.length + 'px', backgroundColor: cell ? '#cbcbcb' : 'rgba(255,255,255, 0.3)'}"
            :key="'cell-' + y"
          ></div>
        </div>
      </div>
      <div class="height">
        <input type="number" v-model="height">
      </div>
    </div>
    <button @click="createGame" :disabled="!computedValidity">Create</button>
  </div>
</template>

<script>
import Game from '../models/game'
export default {
  name: 'games',
  data() {
    return {
      width: 20,
      height: 20,
      mines: 100,
    }
  },
  watch: {
    width() {
      this.preventWrongInputs()
    },
    height() {
      this.preventWrongInputs()
    },
    mines() {
      this.preventWrongInputs()
    },
  },
  computed: {
    computedValidity() {
      return this.inputsValidity()
    },
    preview() {
      let nbBomb = 0
      return Array(+this.width).fill(false).map(() => {
        return Array(+this.height).fill(false).map(() => {
          if(nbBomb < this.mines) {
            nbBomb ++
            return true
          }
        })
      })
    }
  },
  methods: {
    preventWrongInputs() {
      this.mines = this.mines <= 0 ? 1 : this.mines
      this.width = this.width <= 0 ? 1 : this.width
      this.height = this.height <= 0 ? 1 : this.height
      const max = this.width * this.height - 1
      this.mines = this.mines > max ? max : this.mines
    },
    setGame(w,h,m) {
      this.width = w
      this.height = h
      this.mines = m
    },
    async createGame() {
      if(this.inputsValidity()) {
        const id = await Game.create(this.width, this.height, this.mines)
        this.$router.push({name: 'game', params: {id}})
      }
    },
    inputsValidity() {
      const {width, mines, height} = this
      return mines > 0
        && width > 0
        && height > 0
        && width * height < 8100
        && mines < width * height
    }
  }
}
</script>

<style scoped lang="scss">
h1 {
  text-align: center;
}
.mines {
  position: absolute;
  margin: auto;
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  .mines-content {
    width: 80%;
    display: flex;
    flex-direction: column; 
    align-items: center;
    background-color:rgba(0,0,0,0.4);
    filter: blur(0px);
    padding: 10px;
  }
}
.height {
  flex-direction: column;
  justify-content: center;
  display: flex;
  position: absolute;
  top: -300px;
  left: -40px;
  width: 20px; height: 290px; position: relative; background: #029c88;
  input {
    text-align: center;
    width: 40px;
    height: 20px;
    left: -11px;
    position: absolute;
  }
}
.height:after {
  content: ""; position: absolute; left: 0; top: 0; width: 0; height: 0; 
  border-right: 10px solid #353b4f;
  border-bottom: 10px solid transparent;
  border-left: 10px solid #353b4f;
}
.height:before {
  content: ""; position: absolute; left: 0px; bottom: -20px; width: 0; height: 0; border-left: 10px solid transparent;border-right: 10px solid transparent; border-bottom: 10px solid transparent; border-top: 10px solid #029c88;
} 

.width {
  justify-content: center;
  display: flex;
  position: absolute;
  top: 340px;
  width: 290px; height: 20px; position: relative; background: #029c88;
  input {
    text-align: center;
    width: 40px;
    height: 20px;
    padding: 0;
  }
}
.width:after {
  content: ""; position: absolute; left: 0; bottom: 0; width: 0; height: 0; border-right: 10px solid #029c88; border-top: 10px solid #353b4f; border-bottom: 10px solid #353b4f;
}
.width:before {
  content: ""; position: absolute; right: -10px; bottom: 0; width: 0; height: 0; border-left: 10px solid #029c88; border-top: 10px solid transparent; border-bottom: 10px solid transparent;
} 
.games-root {
  position: relative;
  width: 300px;
  margin: auto;
  .input-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    label {
      width: 120px;
      flex-shrink: 0;
      display: inline-block;
    }
    input {
      width: 160px
    }
  }
  button {
    margin-top: 40px;
    width: 100%
  }
}

.preview {
  display: flex;
}

.cell {
  border-radius: 4px;
  border: 1px solid  #353b4f;
  box-sizing: border-box;
  width: 5px;
  height: 5px;
  background-color: rgba(255,255,255, 0.3);
}
.preview-container {
  height: 350px;

}
.preset {
  display: flex;
  justify-content: space-between;
  button {
    padding: 0;
  }
}

@media (max-width: 400px)  {
  .preview-container {
    transform: scale(0.8)!important
  }
  input {
    transform: scale(1.4)
  }
  .mines-content {
    font-size: 1.6em;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

</style>
