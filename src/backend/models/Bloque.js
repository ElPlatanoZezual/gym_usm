const mongoose = require('mongoose'), Schema = mongoose.Schema;

const bloqueSchema = new Schema({
    horarioId: {
        type: Schema.Types.ObjectId,
		ref: "Horario",
		required: true
    },
    rutFuncionario: {
        type: String,
		ref: "Funcionario",
		required: true
    },
    fecha: {
        type: String,
        required: true
    },
    cantInscritos: {
        type: Number,
        required: true
    },
    cupoMaximo: {
        type: Number,
        required: true
    },
    disponible: {
        type: Boolean,
        required: true
    }
},{
	timestamps: true,
	versionKey: false
})


module.exports = mongoose.model('Bloque', bloqueSchema)