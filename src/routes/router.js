const express = require('express')
const route = express.Router()
const MainController = require('../controller/MainController')
const AuthController = require('../controller/AuthController')
const LogsController = require('../controller/LogsController')
const LogBooksController = require('../controller/LogBooksController')
const controller = {
    MainController,
    AuthController,
    LogsController,
    LogBooksController
}

route.get('/', controller.MainController.getHome)
route.get('/is_me', controller.AuthController.getIsMe)
route.post('/is_me', controller.AuthController.postIsMe)
route.get('/me', controller.AuthController.checkToken, controller.AuthController.getMe)
route.get('/exit', controller.AuthController.getExit)
route.get('/me/logs', controller.AuthController.checkToken, controller.LogsController.getLogs)
route.get('/me/logs/new', controller.AuthController.checkToken, controller.LogsController.getNewLog)
route.post('/me/logs/new', controller.AuthController.checkToken, controller.LogsController.postNewLog)
route.get('/me/logs/:slug', controller.AuthController.checkToken, controller.LogsController.getLogBySlug)
route.post('/me/logs/:slug', controller.AuthController.checkToken, controller.LogsController.deleteLogBySlug)
route.get('/logbooks', controller.LogBooksController.getLogBooks)
route.get('/logbooks/:slug', controller.LogBooksController.getLogBookBySlug)

module.exports = route