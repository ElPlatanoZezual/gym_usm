const mongoose = require('mongoose'), Schema = mongoose.Schema;

const carreraSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    }
},{
	timestamps: true,
	versionKey: false
})


module.exports = mongoose.model('Carrera', carreraSchema)