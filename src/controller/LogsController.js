const db = require('../config/db')


exports.getLogs = (req, res) => {
    res.status(200).render('auth/logs', {
        title: 'Logs',
        layout: 'layouts/auth-layout',
        tokenDesc: req.session.tokenDesc,
        ownerName: req.session.ownerName
    })
}