const express = require('express');
const authController = require('./../Controllers/authController')

const router = express.Router();
router.route('/')
    .get(authController.AuthMiddleware, authController.getAllUsers)
    .post(authController.createUser);

router.route('/:id')
    .get(authController.AuthMiddleware, authController.getUser)
    .patch(authController.AuthMiddleware, authController.updateUser)
    .delete(authController.AuthMiddleware,  authController.authorize('admin'), authController.deleteUser); // we added  authController.authorize('admin') middleware which check if user is admin who can delete a user

router.route('/login').post(authController.loginUser);
router.route('/logout').get(authController.AuthMiddleware, authController.logoutUser);


module.exports = router;