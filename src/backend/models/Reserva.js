const mongoose = require('mongoose'), Schema = mongoose.Schema;

const reservaSchema = new Schema({
    rutEstudiante: {
        type: String,
        ref: "Alumno",
        required: true
    },
    bloqueId: {
        type: Schema.Types.ObjectId,
		ref: "Bloque",
		required: true
    },
    casilleroId: {
        type: Number,
		ref: "Casillero",
		required: true
    },
    asistencia: {
        type: Boolean
    }
},{
	timestamps: true,
	versionKey: false
})


module.exports = mongoose.model('Reserva', reservaSchema)