const path = require('path')
const express = require('express')
const request = require('request')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.use('/graphql', (req, res) => {
  const url = 'http://gql:3000/graphql'
  req.pipe(request(url)).pipe(res)
})

app.listen(3000, () => console.log('Web server is running on port 3000'))
