const express = require('express')
const route = express.Router()
const MainController = require('../controllers/MainController')
const AuthController = require('../controllers/AuthController')
const LogsController = require('../controllers/LogsController')
const LogBooksController = require('../controllers/LogBooksController')
const BlogsController = require('../controllers/BlogsController')
const controllers = {
    MainController,
    AuthController,
    LogsController,
    LogBooksController,
    BlogsController
}

//R. Main
route.get   ('/', controllers.MainController.getHome)
route.get   ('/logbooks', controllers.LogBooksController.getLogBooks)
route.get   ('/logbooks/:slug', controllers.LogBooksController.getLogBookBySlug)

//R. Auth
route.get   ('/is_me', controllers.AuthController.getIsMe)
route.post  ('/is_me', controllers.AuthController.postIsMe)
route.get   ('/me', controllers.AuthController.checkToken, controllers.AuthController.getMe)
route.get   ('/exit', controllers.AuthController.getExit)

//R. Logbooks
route.get   ('/me/logs', controllers.AuthController.checkToken, controllers.LogsController.getLogs)
route.get   ('/me/logs/new', controllers.AuthController.checkToken, controllers.LogsController.getNewLog)
route.post  ('/me/logs/new', controllers.AuthController.checkToken, controllers.LogsController.postNewLog)
route.get   ('/me/logs/:slug', controllers.AuthController.checkToken, controllers.LogsController.getLogBySlug)
route.post  ('/me/logs/:slug', controllers.AuthController.checkToken, controllers.LogsController.deleteLogBySlug)
route.get   ('/me/logs/edit/:slug', controllers.AuthController.checkToken, controllers.LogsController.getEditLogBySlug)
route.post  ('/me/logs/edit/:slug', controllers.AuthController.checkToken, controllers.LogsController.postLogBySlug)

//R. Blogs
route.get   ('/me/blogs/new', controllers.AuthController.checkToken, controllers.BlogsController.getNewBlog)
route.get   ('/me/blogs', controllers.AuthController.checkToken, controllers.BlogsController.getAllBlogs)
route.post  ('/me/blogs/new', controllers.AuthController.checkToken, controllers.BlogsController.postNewBlog)
route.get   ('/me/blogs/:slug', controllers.AuthController.checkToken, controllers.BlogsController.getBlogBySlug)

module.exports = route