const express = require('express');
const authController = require('./../Controllers/authController')

const router = express.Router();
router.route('/login').post(authController.loginUser);
router.route('/logout').get(authController.AuthMiddleware, authController.logoutUser);
//RESET PASSWORD
router.route('/forgetPasword').post(authController.forgetPasword);
router.route('/resetPasword/:token').patch(authController.resetPasword);

module.exports = router;