<template>
  <div class="games-root">
    <button @click="createGame">Create</button>
  </div>
</template>

<script>
import Game from '../models/game'
export default {
  name: 'games',
  data() {
    return {
    }
  },
  methods: {
    async createGame() {
      const id = await Game.create()
      this.$router.push({name: 'game', params: {id}})
    }
  }
}
</script>

<style scoped lang="scss">
.games-root {
}
</style>
