const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const MongoObjectId  = require('mongoose').Types.ObjectId;

const Alumno = require("./models/Alumno");
const Funcionario = require("./models/Funcionario");


async function estudianteAccess(req, res, next) {

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
					message: "No autorizado." 
				})
			}

			const alumno = await Alumno.findOne({ _id: decoded.id });

			if (alumno) {
				req.alumno = alumno;

				return next();
			}
		}

		return res.redirect(`${process.env.SITE_URL}/login`);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Un error ha ocurrido. Inténtalo nuevamente."
		})
	}

}


async function funcionarioAccess(req, res, next) {
	
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
					message: "No autorizado." 
				})
			}

			const funcionario = await Funcionario.findOne({ _id: decoded.id, labor: "normal" });

			if (funcionario) {
				req.funcionario = funcionario;

				return next();
			}
		}

		return res.redirect(`${process.env.SITE_URL}/login`);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Un error ha ocurrido. Inténtalo nuevamente."
		})
	}

}


async function superFuncionarioAccess(req, res, next) {
	
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
					message: "No autorizado." 
				})
			}

			const funcionario = await Funcionario.findOne({ _id: decoded.id, labor: "super" });

			if (funcionario) {
				req.funcionario = funcionario;

				return next();
			}
		}

		return res.redirect(`${process.env.SITE_URL}/login`);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Un error ha ocurrido. Inténtalo nuevamente."
		})
	}

}


module.exports = {
    estudianteAccess,
	funcionarioAccess,
	superFuncionarioAccess
}