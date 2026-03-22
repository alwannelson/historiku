const db = require('../config/db.js')

exports.getHome = async (req, res) => {
    res.status(200).render('home', {
        title: 'Home',
        layout: 'layouts/main-layout'
    })
}