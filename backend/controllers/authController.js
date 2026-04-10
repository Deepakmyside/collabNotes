const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    try {
        const { name, email, password} = req.body

        const existingUser = await User.findOne({ email })
        if(existingUser) {
            return res.status(400).json({message: 'Email already exists'})

        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({ name, email, password: hashedPassword})

        const token = jwt.sign(
            { id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        )
        res.status(201).json({ token, user: {id: user._id, name: user.name, email: user.email}})
    } catch(error) {
        console.log(error)
        res.status(200).json({message: 'Server error', error })
    }
}


const login = async (req, res) => {
    try {
        const { email, password} = req.body
    
        const user = await User.findOne({ email})
         if(!user) {
            return res.status(400).json({message:'Invalid Credentials'})
         }

         const isMatch = await bcrypt.compare(password, user.password)
         if(!isMatch) {
            return res.status(400).josn({
                message: 'Invalid Credentials'})
         }
        // Creating token jha user ka ID  store hoga uski identity rkhne ke liye hehe
         const token =jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
         )
         res.status(200).json({token, user:{ id: user._id, email : user.email, name: user.name}})
    
    }catch (error){
        res.status(500).json({message:'Server error', error })
    }
}


module.exports = {register, login}