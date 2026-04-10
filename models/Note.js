const mongoose = require('mongoose')

const noteSchema = mongoose.noteSchema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        default: ''
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    collaborator: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    roomId: {
        type: String,
        unique: true
    }
}, { timestamps: true})

module.exports = mongoose.model('Note', noteSchema)