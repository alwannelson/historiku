const express = require('express')
const route = express.Router()
const MainController = require('../controller/MainController')
const AuthController = require('../controller/AuthController')
const LogsController = require('../controller/LogsController')
const controller = {
    MainController,
    AuthController,
    LogsController
}

route.get('/', controller.MainController.getHome)
route.get('/is_me', controller.AuthController.getIsMe)
route.post('/is_me', controller.AuthController.postIsMe)
route.get('/me', controller.AuthController.checkToken, controller.AuthController.getMe)
route.get('/exit', controller.AuthController.getExit)
route.get('/me/logs', controller.AuthController.checkToken, controller.LogsController.getLogs)

module.exports = route