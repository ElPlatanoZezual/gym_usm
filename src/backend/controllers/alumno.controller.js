const authController = require("../controllers/auth.controller");

const Alumno = require("../models/Alumno");
const Carrera = require("../models/Carrera");

const nodemailer = require("../integrations/nodemailer");


async function getAll(req, res) {

    try {
        
        const alumnos = await Alumno.find();
        const carreras = await Carrera.find();

        let data = [];

        for (let a of alumnos) {
            let c = carreras.find(ca => ca._id.equals(a.carreraId));

            let d = {
                id: a._id.toString(),
                rut: a.rut,
                nombre: a.nombre,
                apellido: a.apellido,
                correo: a.correo,
                carrera: {
                    oid: a.carreraId,
                    name: c?.nombre
                },
                inasistencias: a.inasistencias,
                fecha: a.createdAt
            }

            data.push(d);
        }


        return res.status(200).json({
            success: true,
            data: data
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Ha ocurrido un error. Inténtelo nuevamente."
        })
    }

}


async function createAlumno(req, res) {

    try {
        
        const {
            nombre,
            apellido,
            rut,
            correo,
            password,
            carreraId,
            certificadoAlumno
        } = req.body;


        const hashedPassword = await authController.hash(password);

        await Alumno.create({
            rut,
            nombre,
            apellido,
            correo,
            password: hashedPassword,
            certificadoAlumno,
            carreraId,
            cuentaActiva: true,
            inasistencias: 0
        });


        nodemailer.sendRegistrationNotification({
            fields: {
                nombre,
                rut,
                password
            },
            email: correo
        });


        return res.status(200).json({
            success: true
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Ha ocurrido un error. Inténtelo nuevamente."
        })
    }

}


async function updateAlumno(req, res) {

    try {
        
        const { alumnoId } = req.params;

        const alumno = await Alumno.findOne({ _id: alumnoId });

        if (!alumno) {
            return res.status(404).json({
                success: false
            })
        }

        await Alumno.updateOne(
            { _id: alumnoId },
            { $set: req.body }
        );

        return res.status(200).json({
            success: true
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Ha ocurrido un error. Inténtelo nuevamente."
        })
    }

}


async function deleteAlumno(req, res) {

    try {
        
        const { alumnoId } = req.params;

        const alumno = await Alumno.findOne({ _id: alumnoId });

        if (!alumno) {
            return res.status(404).json({
                success: false
            })
        }

        await alumno.deleteOne();

        return res.status(200).json({
            success: true
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Ha ocurrido un error. Inténtelo nuevamente."
        })
    }

}


module.exports = {
    getAll,
    createAlumno,
    updateAlumno,
    deleteAlumno
}