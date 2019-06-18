<script>
  import Vue from 'vue'
  import Router from 'vue-router'
  import Game from '@/components/Game'
  import Games from '@/components/Games'
  
  Vue.use(Router)
  
  export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
      {
        path: '/',
        redirect: {name: 'games'}
      },
      {
        path: '/games',
        name: 'games',
        component: Games
      },
      {
        path: '/game/:id',
        name: 'game',
        component: Game
      },
    ]
  })

</script>
