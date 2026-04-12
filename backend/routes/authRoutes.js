const express = require('express')
const {register, login} = require('../controllers/authController')
const { googleAuth, googleCallback} = require('./auth')
const router = express.Router()

router.post("/register", register)
router.post("/login", login)

// Google OAuth
router.get('/google',googleAuth )
router.get('/google/callback', googleCallback)
module.exports= router
