const express = require('express')
const app = express()

const { port } = require('./config')

app.use(express.static('public'))

app.listen(port, () => {
  console.log(`app started at port ${port}`)
})
