const { raw } = require('mysql2')
const db = require('../config/db')
require('dotenv').config()

function formatDate(dateString) {

    const date = new Date(dateString)

    const option = {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    }

    return date.toLocaleDateString('en-US', option)
}

let postedAt = ''


exports.getLogs = async (req, res) => {
    const [data] = await db.execute(
        'SELECT * FROM tbl_logs ORDER BY id_log DESC'
    )

    if (data.length > 0) {
        postedAt = formatDate(data[0].posted_at)
    }

    res.status(200).render('auth/logs', {
        title: 'Logs',
        layout: 'layouts/auth-layout',
        tokenDesc: req.session.tokenDesc,
        ownerName: req.session.ownerName,
        data,
        postedAt
    })
}

exports.getNewLog = (req, res) => {
    res.status(200).render('auth/new-log', {
        title: 'New Log',
        layout: 'layouts/auth-layout'
    })
}

exports.postNewLog = async (req, res) => {
    try {
        const { title, slug, body, tags } = req.body

        if (!title) {
            req.flash('error', 'Title are required.')
            return res.status(400).redirect('/me/logs/new')
        }

        let finalSlug = slug
        if (!finalSlug || finalSlug.trim() === '') {
            finalSlug = title
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/--+/g, '-')
                .replace(/^-+|-+$/g, '');
        }

        const slugPattern = /^[a-z0-9-]+$/
        if (/\s/.test(finalSlug) || !slugPattern.test(finalSlug)) {
            req.flash('error', 'Invalid slug format.');
            return res.status(400).redirect('/me/logs/new');
        }

        const [existing] = await db.execute(
            'SELECT id_log FROM tbl_logs WHERE slug_log = ?',
            [finalSlug]
        )

        if (existing.length > 0) {
            finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`
        }

        const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : []
        const tagsJson = JSON.stringify(tagsArray)

        const currentDate = new Date()
        const postedAt = currentDate

        const [result] = await db.execute(
            'INSERT INTO tbl_logs (title_log, slug_log, body_log, tags, posted_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
            [title, finalSlug, body, tags, postedAt, currentDate]
        )

        if (result.affectedRows > 0) {
            req.flash('success', `Log ${title} added.`)
            res.status(201).redirect('/me/logs')
        } else {
            req.flash('error', 'Failed to create log.')
            res.status(400).redirect('/me/logs/new')
        }
    } catch (error) {
        res.status(500).render('errors/500', {
            title: '500 | Server Error',
            layout: 'layouts/main-layout'
        })
    }
}

exports.getLogBySlug = async (req, res) => {
    const { slug } = req.params
    const url = req.url
    const APP_URL = process.env.APP_URL
    let urlMessage = APP_URL + url || null

    try {
        const [[result]] = await db.execute(
            'SELECT * FROM tbl_logs WHERE slug_log = ?',
            [slug]
        )
        postedAt = formatDate(result.posted_at)

        if (!result) {
            return res.status(404).render('errors/404', {
                title: '404 | Not Found',
                layout: 'layouts/main-layout',
                urlMessage
            })
        }

        res.status(200).render('auth/detail-log', {
            title: `${result.title_log}`,
            layout: 'layouts/auth-layout',
            result,
            postedAt
        })
    } catch (error) {
        console.log(error)
        return res.status(500).render('errors/500', {
            title: '500 | Server Error',
            layout: 'layouts/main-layout'
        })
    }
}

exports.deleteLogBySlug = async (req, res) => {
    try {
        const { slug } = req.params

        if (!slug) {
            res.status(400).render('errors/400', {
                title: '400 | Bad Request',
                layout: 'layouts/main-layout'
            })
        }

        const [result] = await db.execute(
            'DELETE FROM tbl_logs WHERE slug_log = ?',
            [slug]
        )

        res.status(200).redirect('/me/logs')

        // if (log.length === 0) {
        //     req.flash('error', 'Data tidak ditemukan.')
        //     return res.status(404).redirect('/me/logs')
        // }
    } catch (error) {
        return res.status(500).render('errors/500', {
            title: '500 | Server Error',
            layout: 'layout/main-layout'
        })
    }
}