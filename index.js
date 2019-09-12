const express = require('express')
require('./src/db/mongoose')
const user = require('./src/routers/user')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/', user)


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})