const db = require('../config/db')
const { all } = require('../routes/router')

exports.getNewBlog = (req, res) => {
    res.status(200).render('auth/blog/new-blog', {
        title: 'New Blog',
        layout: 'layouts/auth-layout'
    })
}

exports.getAllBlogs = async (req, res) => {
    try {
        const [blogs] = await db.execute(
            'SELECT * FROM tbl_blogs ORDER BY posted_at DESC'
        )

        if (blogs.length < 1) {
            req.flash('error', 'Nothing blog here.')
            return res.status(200).redirect('/me/blogs')
        }

        res.status(200).render('auth/blog/blogs', {
            title: 'Blogs',
            layout: 'layouts/auth-layout',
            blogs
        })
    } catch (error) {
        console.log(error)
        return res.status(500).render('errors/500', {
            title: '500 | Server Error',
            layout: 'layouts/main-layout'
        })
    }
}

exports.postNewBlog = async function (req, res) {
    try {
        const { title, slug, body, author, tags } = req.body

        let finalAuthor = author || 'someone'

        if (title.length > 250) {
            return res.status(400).render('errors/400', {
                title: '400 | Bad Request',
                layout: 'layouts/main-layout'
            })
        }

        if (slug.length > 250) {
            return res.status(400).render('errors/400', {
                title: '400 | Bad Request',
                layout: 'layouts/main-layout'
            })
        }

        if (!title || !slug || !body || !tags) {
            return res.status(400).render('errors/400', {
                title: '400 | Bad Request',
                layout: 'layouts/main-layout'
            })
        }

        const newDate = new Date()
        const [postBlog] = await db.execute(
            'INSERT INTO tbl_blogs (title_blog, slug_blog, author_blog, body_blog, tags, posted_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, slug, finalAuthor, body, tags, newDate, newDate]
        )

        res.status(201).redirect('/me/blogs')
    } catch (error) {
        console.log(error)
    }
}

exports.getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params
        
        const [result] = await db.execute(
            'SELECT * FROM tbl_blogs WHERE slug_blog = ?',
            [slug]
        )

        res.status(200).render('auth/blog/detail-blog', {
            title: `${result[0].title_blog}`,
            layout: 'layouts/auth-layout',
            result
        })
    } catch (error) {

    }
}