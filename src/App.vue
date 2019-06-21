<template>
  <div id="app">
    <div class="app-content">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  }
}
</script>

<style lang="scss">
@import url('../node_modules/@fortawesome/fontawesome-free/css/all.min.css');
@font-face {
  font-family: rose;
  src: url(/Rose-Katrinah.ttf);
}
div, button, h1, h2, h3, h4, h5, h6 {
  font-family: 'Jost';
}
input {
  border-radius: 2px;
  border: none;
  border-bottom: 4px solid#029c88;
  padding: 2px;
  background-color: white;
  text-align: center;
}
button {
  padding: 0;
  font-weight: 410;
  background-color: #029c88;
  color: white;
  border: none;
  border-radius: 2px;
  margin: 2px;
  padding: 4px;
  transition: 300ms;
  font-size: 1em;
  cursor: pointer;
  &:hover {
    background-color: #007b6b
  }
}
body {
  margin: 0;
  min-height: 100vh;
  background-color: #353b4f;
  color: white
}
.app-content {
  height: calc(100vh);
  overflow: auto;
}
ul {
  margin: 0;
  padding: 0;
  li {
    padding: 0;
    margin: 0;
  }
}
</style>
