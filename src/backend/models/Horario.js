const mongoose = require('mongoose'), Schema = mongoose.Schema;

const horarioSchema = new Schema({
    horarioInicio: {
        type: String,
        required: true
    },
    horarioTermino: {
        type: String,
        required: true
    }
},{
	timestamps: true,
	versionKey: false
})


module.exports = mongoose.model('Horario', horarioSchema)