const db = require('../config/db')


exports.getLogBookBySlug = async (req, res) => {
    try {
        const { slug } = req.params
        
        const [[result]] = await db.execute(
            'SELECT * FROM tbl_logs WHERE slug_log = ?',
            [slug]
        )
        
        res.status(200).render('detail-logbooks', {
            title: result.title_log,
            layout: 'layouts/main-layout',
            result,
        })
    } catch (error) {
        return res.status(500).render('errors/500', {
            title: '500 | Server Error',
            layout: 'layouts/main-layout'
        })
    }
}

exports.getLogBooks = async (req, res) => {
    try {
        const sort = req.query.sort || 'default'

        const sortMap = {
            default: 'id_log DESC',
            latest: 'posted_at DESC',
            oldest: 'posted_at ASC',
            updated: 'updated_at DESC'
        }

        const orderBy = sortMap[sort] || sortMap.default

        const [row] = await db.execute(
            `SELECT * FROM tbl_logs ORDER BY ${orderBy} LIMIT 20`
        )

        if (row.length < 1) {
            req.flash('error', 'No logbooks available.')
            return res.status(200).redirect('/logbooks')
        }

        res.status(200).render('logbooks', {
            title: 'Logbooks',
            layout: 'layouts/main-layout',
            row,
            activeSort: sort
        })
    } catch (error) {
        console.error(error)
        return res.status(500).render('errors/500', {
            title: '500 | Server Error',
            layout: 'layouts/main-layout'
        })
    }
}