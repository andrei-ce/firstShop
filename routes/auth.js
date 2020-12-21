const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const validators = require('../middleware/validators');

router.get('/login', authController.getLogin);
router.post('/login', validators.validateLogin, authController.postLogin);
router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);
router.post('/signup', validators.validateSignUp, authController.postSignup);

router.get('/reset-password', authController.getReset);
router.post('/reset-password/', authController.postReset);
router.get('/reset-password/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
