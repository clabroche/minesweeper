const rp = require('request-promise')
export default  {
  get(id) {
    return rp.get(process.env.VUE_APP_HOST + '/api/v1/games/' + id, {json:true})
  },
  create() {
    return rp.post(process.env.VUE_APP_HOST + '/api/v1/games/', {json:true})
  },
  activate(id, cell) {
    return rp.post(process.env.VUE_APP_HOST + '/api/v1/games/' + id + '/activate/' , {json:true, body: cell})
  },
  putFlag(id, cell) {
    return rp.post(process.env.VUE_APP_HOST + '/api/v1/games/' + id + '/putFlag/' , {json:true, body: cell})
  }
}