const express = require('express')
const route = express.Router()
const MainController = require('../controller/MainController')
const controller = {
    MainController
}

route.get('/', controller.MainController.getHome)

module.exports = route