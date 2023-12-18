const mongoose = require('mongoose'), Schema = mongoose.Schema;

const alumnoSchema = new Schema({
    rut: {
		type: String,
		required: true,
        unique: true
	},
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
	carreraId: {
		type: Schema.Types.ObjectId,
		ref: "Carrera",
		required: true
	},
	inasistencias: {
        type: Number
    },
    cuentaActiva: {
        type: Boolean
    },
    motivoAmonestacion: {
        type: String
    },
    inicioAmonestacion: {
        type: Date
    },
    finAmonestacion: {
        type: Date
    },
    certificadoAlumno: {
        type: String,
        required: true
    }
},{
	timestamps: true,
	versionKey: false
})


module.exports = mongoose.model('Alumno', alumnoSchema)