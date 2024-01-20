const { default: mongoose, Schema } = require("mongoose");

const NotesSchema = new mongoose.Schema({

    notesMasterId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'NotesMaster'
    },
    title: {
        type: String,
        required: true
    },

}, {
    versionKey: false,
    timestamps: true
})

module.exports = mongoose.model('Notes', NotesSchema)