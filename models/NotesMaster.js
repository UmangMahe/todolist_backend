const { default: mongoose, Schema } = require("mongoose");

const NotesMasterSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },

    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Notes"
    }]
},{
    versionKey: false,
    timestamps: true
})

module.exports = mongoose.model('NotesMaster', NotesMasterSchema, 'notes_master')

