const express = require('express');
const userController = require('../Controllers/userController')
const authController = require('../Controllers/authController')

const router = express.Router();
router.route('/')
    .get(authController.AuthMiddleware, userController.getAllUsers)
    .post(userController.createUser);

router.route('/:id')
    .get(authController.AuthMiddleware, userController.getUser)
    .patch(authController.AuthMiddleware, userController.updateUser)
   // .delete(authController.AuthMiddleware, authController.authorize('admin'), userController.deleteUser); // we added  userController.authorize('admin') middleware which check if user is admin who can delete a user
    .delete(authController.AuthMiddleware, userController.deleteUser); // we added  userController.authorize('admin') middleware which check if user is admin who can delete a user

//CHANGE PASSWORD
router.route('/auth/changePassword').patch(authController.AuthMiddleware, userController.changePassword);

module.exports = router;