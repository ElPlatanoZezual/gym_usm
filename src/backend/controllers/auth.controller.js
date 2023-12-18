const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const MongoObjectId  = require('mongoose').Types.ObjectId;

const Funcionario = require("../models/Funcionario");
const Alumno = require("../models/Alumno");

const nodemailer = require("../integrations/nodemailer");

// Controladores

async function login(req, res) {
    try {
        const { rut, password } = req.body;

        // Intentar loggeo Funcionario

        const funcionario = await Funcionario.findOne({ rut: rut });

        if (funcionario) {
            const passwordsEqual = await matchHash(password, funcionario.password);

            if (passwordsEqual) {
                // Loggeo exitoso de Funcionario

                if (funcionario.labor === "super") {
                    const token = jwt.sign({ id: funcionario._id }, process.env.JWT_API_SECRET);

                    res.cookie("access", token, {
                        httpOnly: true,
                        secure: true
                    });

                    return res.status(200).json({
                        success: true
                    });
                } else {
                    const token = jwt.sign({ id: funcionario._id }, process.env.JWT_API_SECRET);
                    
                    res.cookie("access", token, {
                        httpOnly: true,
                        secure: true
                    });

                    return res.status(200).json({
                        success: true
                    });
                }
            }
        }


        // Intentar loggeo Alumno

        const alumno = await Alumno.findOne({ rut: rut });

        if (alumno) {
            const passwordsEqual = await matchHash(password, alumno.password);

            if (passwordsEqual) {
                // Loggeo exitoso de Estudiante
                
                const token = jwt.sign({ id: alumno._id }, process.env.JWT_API_SECRET);

                res.cookie("access", token, {
                    httpOnly: true,
                    secure: true
                });

                return res.status(200).json({
                    success: true
                });
            }
        }


        // No calza con nada

        return res.status(401).json({
            success: false,
            message: "No autorizado."
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Ha ocurrido un error. Inténtelo nuevamente."
        })
    }
}


async function signup(req, res) {

    try {
        
        const {
            rut,
            nombre,
            apellido,
            correo,
            password,
            pdf,
            carreraId
        } = req.body;


        const hashedPassword = await hash(password);

        const alumno = await Alumno.create({
            rut,
            nombre,
            apellido,
            correo,
            password: hashedPassword,
            certificadoAlumno: pdf,
            carreraId,
            cuentaActiva: true,
            inasistencias: 0
        });


        const token = jwt.sign({ id: alumno._id }, process.env.JWT_API_SECRET);

        res.cookie("access", token, {
            httpOnly: true,
            secure: true
        });


        nodemailer.sendRegistrationSuccess({
            fields: {
                nombre
            },
            email: correo
        });


        return res.status(200).json({
            success: true
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Ha ocurrido un error. Inténtelo nuevamente."
        })
    }
}


async function logout(req, res) {

    try {
        
        res.clearCookie("access");

        return res.redirect(`${process.env.SITE_URL}/`);

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Ha ocurrido un error. Inténtelo nuevamente."
        })
    }

}


async function getUserData(req, res) {

    try {
        let token;

		if (req.cookies && req.cookies["access"]) {
			token = req.cookies["access"];
		}

		if (token) {
			const decoded = jwt.verify(token, process.env.JWT_API_SECRET);

			if (!MongoObjectId.isValid(decoded.id)) {
				return res.status(401).json({ 
					success: false,
                    data: {}
				})
			}

            const funcionario = await Funcionario.findOne({ _id: decoded.id });
			if (funcionario) {
				return res.status(200).json({
                    success: true,
                    data: {
                        nombre: funcionario.nombre,
                        role:   funcionario.labor
                    }
                });
			}

			const alumno = await Alumno.findOne({ _id: decoded.id });
			if (alumno) {
				return res.status(200).json({
                    success: true,
                    data: {
                        nombre: alumno.nombre,
                        role:   "alumno"
                    }
                });
			}


		}

		return res.status(404).json({
            success: false,
            data: {}
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Ha ocurrido un error. Inténtelo nuevamente.",
            data: {}
        })
    }

}


// Funciones auxiliares

// Hash User password
async function hash(data) {

	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(data, salt);

	return hash;

}

// Match password and hashedPassword
async function matchHash(data, hashedData) {

	const match = await bcrypt.compare(data, hashedData);

    return match;

}

module.exports = {
    login,
    signup,
    logout,
    getUserData,

    hash
}