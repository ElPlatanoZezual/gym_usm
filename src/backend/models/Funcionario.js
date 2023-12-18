const mongoose = require('mongoose'), Schema = mongoose.Schema;

const funcionarioSchema = new Schema({
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
    cuentaActiva: {
        type: Boolean
    },
    labor: {
        type: String,
        required: true
    }
},{
	timestamps: true,
	versionKey: false
})


module.exports = mongoose.model('Funcionario', funcionarioSchema)