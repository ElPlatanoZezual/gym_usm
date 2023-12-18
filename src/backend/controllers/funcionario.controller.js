const authController = require("../controllers/auth.controller");

const Funcionario = require("../models/Funcionario");

const nodemailer = require("../integrations/nodemailer");


async function getAll(req, res) {

    try {
        
        const funcionarios = await Funcionario.find();

        let data = [];

        for (let f of funcionarios) {
            let d = {
                id: f._id.toString(),
                rut: f.rut,
                nombre: f.nombre,
                apellido: f.apellido,
                correo: f.correo,
                labor: f.labor,
                fecha: f.createdAt
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


async function createFuncionario(req, res) {

    try {

        const {
            nombre,
            apellido,
            rut,
            correo,
            password,
            labor
        } = req.body;


        const hashedPassword = await authController.hash(password);

        await Funcionario.create({
            rut,
            nombre,
            apellido,
            correo,
            password: hashedPassword,
            cuentaActiva: true,
            labor
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


async function updateFuncionario(req, res) {

    try {
        
        const { funcionarioId } = req.params;

        const funcionario = await Funcionario.findOne({ _id: funcionarioId });

        if (!funcionario) {
            return res.status(404).json({
                success: false
            })
        }

        await Funcionario.updateOne(
            { _id: funcionarioId },
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


async function deleteFuncionario(req, res) {

    try {
        
        const { funcionarioId } = req.params;

        const funcionario = await Funcionario.findOne({ _id: funcionarioId });

        if (!funcionario) {
            return res.status(404).json({
                success: false
            })
        }

        await funcionario.deleteOne();

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
    createFuncionario,
    updateFuncionario,
    deleteFuncionario
}