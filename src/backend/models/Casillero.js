const mongoose = require('mongoose'), Schema = mongoose.Schema;

const casilleroSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    disponible: {
        type: Boolean,
        required: true
    },
    estadoDescripcion: {
        type: String
    }
},{
	timestamps: true,
	versionKey: false
})


module.exports = mongoose.model('Casillero', casilleroSchema)