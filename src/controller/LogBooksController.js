const db = require('../config/db')

exports.getLogBooks = async (req, res) => {
    try {
        const [row] = await db.execute(
            'SELECT * FROM tbl_logs ORDER BY id_log DESC'
        )

        if (row.length < 1) {
            req.flash('error', 'No logbooks available.')
            return res.status(200).redirect('/logbooks')
        }

        res.status(200).render('logbooks', {
            title: 'Logbooks',
            layout: 'layouts/main-layout',
            row
        })
    } catch (error) {
        console.error(error)
        return res.status(500).render('errors/500', {
            title: '500 | Server Error',
            layout: 'layouts/main-layout'
        })
    }
}

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
            result
        })
    } catch (error) {
    }
}