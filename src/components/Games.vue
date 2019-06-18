<template>
  <div class="games-root">
    <div class="input-container">
      <label>Width</label>
      <input v-model="width"/>
    </div>
    <div class="input-container">
      <label>Height</label>
      <input v-model="height"/>
    </div>
    <div class="input-container">
      <label>Mines (&lt; {{width * height}})</label>
      <input v-model="mines"/>
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
  computed: {
    computedValidity() {
      return this.inputsValidity()
    }
  },
  methods: {
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
        && width * height < 2000
        && mines < width * height
    }
  }
}
</script>

<style scoped lang="scss">
.games-root {
  width: 300px;
  padding-top: 90px;
  margin: auto;
  .input-container {
    display: flex;
    justify-content: space-between;
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
</style>
