const axios = require('axios').default
const host = process.env.VUE_APP_HOST
if(!host) {
  throw new Error('VUE_APP_HOST is not set')
}
const instance = axios.create({
  baseURL: host
})
export default  {
  async get(id) {
    const {data: game} = await instance.get('/api/v1/games/' + id)
    return game
  },
  async create(width, height, mines) {
    const { data: game } = await  instance.post('/api/v1/games/', {width, height, mines})
    return game
  },
  activate(id, cell) {
    return instance.post('/api/v1/games/' + id + '/activate/' , cell)
  },
  putFlag(id, cell) {
    return instance.post('/api/v1/games/' + id + '/putFlag/' , cell)
  }
}