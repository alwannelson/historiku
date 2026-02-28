const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const path = require('path')
const route = require('./src/routes/router.js')
require('dotenv').config()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './src/Apps/views'))

app.use(expressLayouts)
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(express.static(path.join(__dirname, './src/Apps/public')))

app.use('/', route)
app.use('/', (req, res) => {
    const url = req.url
    const mode = process.env.MODE
    let urlMessage = ''
    
    if (mode === 'production') {
        urlMessage = `https://historiku.my.id${url}`
    } else {
        urlMessage = `http://localhost:3000${url}`
    }

    res.status(404).render('errors/404', {
        title: '404 | Not Found',
        layout: 'layouts/main-layout',
        urlMessage
    })
})

const port = 3000

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})

//port ssh 6401