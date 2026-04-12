const passport = require('passport')
const jwt = require('jsonwebtoken')

// 🔹 Step 1: Google login start
const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
})

// 🔹 Step 2: Google callback handler
const googleCallback = [
  passport.authenticate('google', { session: false }),
  (req, res) => {
    try {
      if (!req.user) {
        return res.redirect('http://localhost:5173/?error=auth_failed')
      }

      const token = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      res.redirect(`http://localhost:5173/oauth-success?token=${token}`)
    } catch (err) {
      console.log("OAuth Error:", err)
      res.redirect('http://localhost:5173/?error=server_error')
    }
  }
]

module.exports = {
  googleAuth,
  googleCallback
}