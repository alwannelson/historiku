const db = require('../config/db')
require('dotenv').config()
let msg = ''

exports.getIsMe = (req, res) => {
    res.status(200).render('auth/token', {
        title: 'Is me?',
        layout: 'layouts/main-layout'
    })
}

exports.checkToken = (req, res, next) => {
    req.session.login ? next() : res.redirect('/is_me')
}

exports.postIsMe = async (req, res) => {
    const { token } = req.body

    try {
        const [rows] = await db.execute(
            'SELECT * FROM tbl_token WHERE token = ? AND is_active = true',
            [token]
        )

        if (!token) {
            req.flash('error', 'PIN harus diisi')
            return res.status(400).redirect('/is_me')
        }

        if (isNaN(token)) {
            req.flash('error', 'PIN harus angka')
            return res.status(400).redirect('/is_me')
        }

        if (token.length < 6) {
            req.flash('error', 'PIN harus 6 angka')
            return res.status(400).redirect('/is_me')
        }

        if (rows.length > 0) {
            req.session.login = true,
                req.session.tokenId = rows[0].id_token,
                req.session.tokenDesc = rows[0].description_token,
                req.session.ownerName = rows[0].owner_name

            await db.execute(
                'UPDATE tbl_token SET last_used = NOW() WHERE id_token = ?',
                [rows[0].id_token]
            )
            res.status(200).redirect('/me')
        } else {
            req.flash('error', 'PIN salah')
            return res.status(400).redirect('/is_me')
        }

    } catch (error) {
        msg = error
        return res.redirect('/woi')
    }
}

exports.getMe = (req, res) => {
    res.status(200).render('auth/me', {
        title: 'Me',
        layout: 'layouts/auth-layout',
        tokenDesc: req.session.tokenDesc,
        ownerName: req.session.ownerName
    })
}

exports.getExit = (req, res) => {
    req.session.destroy()
    res.status(200).redirect('/')
}

exports.getWoi = (req, res) => {
    res.status(200).render('auth/woi', {
        title: 'msg',
        layout: 'layouts/main-layout',
        msg
    })
}