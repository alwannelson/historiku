const express = require('express')
const route = express.Router()
const MainController = require('../controller/MainController')
const AuthController = require('../controller/AuthController')
const controller = {
    MainController,
    AuthController
}

route.get('/', controller.MainController.getHome)
route.get('/is_me', controller.AuthController.getIsMe)
route.post('/is_me', controller.AuthController.postIsMe)
route.get('/me', controller.AuthController.checkToken, controller.AuthController.getMe)
route.get('/exit', controller.AuthController.getExit)
route.get('/woi', controller.AuthController.getWoi)

module.exports = route