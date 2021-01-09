const stack = [
  {
    label: 'minesweeper-server',
    spawnCmd: 'npm',
    spawnArgs: ['run', 'server'],
    spawnOptions: {
      cwd:  __dirname,
      env: Object.assign({
        PORT: '4215',
        SOCKET_PORT: '4216'
      }, process.env)
    }
  },
  {
    label: 'minesweeper-front',
    spawnCmd: 'npm',
    spawnArgs: ['run', 'client'],
    spawnOptions: {
      cwd: __dirname,
      env: Object.assign({
        VUE_APP_HOST: 'http://localhost:4215',
        VUE_APP_SOCKET: 'ws://localhost:4216',
      }, process.env)
    }
  },
]

module.exports = stack
