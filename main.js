const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const path = require('path')
const route = require('./src/routes/router.js')
require('dotenv').config()
const session = require('express-session')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './src/Apps/views'))

app.use(expressLayouts)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000
    }
}))
app.use(cookieParser('secret-key'))
app.use(express.static(path.join(__dirname, './src/Apps/public')))
app.use((req, res, next) => {
    res.locals.ownerName = req.session.ownerName || null;
    res.locals.tokenDesc = req.session.tokenDesc || null;
    res.locals.amountLogs = req.session.amountLogs || null;
    res.locals.login = req.session.login || false;
    res.locals.user = req.session.user ? req.session.user : null;

    next();
});
app.use(flash())
app.use('/', route)
app.use('/', (req, res) => {
    const url = req.url
    const MODE = process.env.MODE
    const APP_URL = process.env.APP_URL
    let urlMessage = `${APP_URL}${url}` || null

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