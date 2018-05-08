const axios = require('axios')
const express = require('express')
const app = express()
const apiRoutes = express.Router()
 app.use('/api', apiRoutes)
var port = 9000







 
  app.get('/api/getDiscList',(req,res)=>{
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
    axios.get(url, {
      headers: {
        referer: 'https://y.qq.com/portal/playlist.html',
        host:'c.y.qq.com'
      },
      params: req.query  //这是请求的query 
    }).then((response) => {
    //response是api地址返回的，数据在data里。
      res.json(response.data)
    }).catch((e) => {
      console.log(e)
    })
  })
  
  app.get('/api/lyric',(req,res)=>{
    var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
    axios.get(url, {
      headers: {
        referer: 'https://y.qq.com/',
        host:'c.y.qq.com'
      },
      params: req.query  //这是请求的query 
    }).then((response) => {
     var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
    }).catch((e) => {
      console.log(e)
    })
  })
  
    app.get('/api/getSongList',(req,res)=>{
     var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
    axios.get(url, {
      headers: {
        referer: 'https://y.qq.com/',
        host:'c.y.qq.com'
      },
      params: req.query  //这是请求的query 
    }).then((response) => {
    //response是api地址返回的，数据在data里。
      res.json(response.data)
    }).catch((e) => {
      console.log(e)
    })
  })
 

app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})