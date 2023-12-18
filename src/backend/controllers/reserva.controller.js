const Reserva = require("../models/Reserva");
const Bloque = require("../models/Bloque");
const Horario = require("../models/Horario");
const Casillero = require("../models/Casillero");

const nodemailer = require("../integrations/nodemailer");
const Alumno = require("../models/Alumno");


async function getReservas(req, res) {

    try {
        
        // Ver si alumno tiene reservada alguna hora

        // const alumno = await Alumno.findOne({ _id: req.alumno._id });
        const reserva = await Reserva.findOne({ rutEstudiante: req.alumno.rut }).sort({ createdAt: -1 });

        if (reserva) {
            const today = new Date();
            
            const fechaActual = today.toLocaleString("es").split(", ")[0];
            const fechaCreacion = new Date(reserva.createdAt).toLocaleString("es").split(", ")[0]

            if (fechaActual === fechaCreacion) {
                const bloque = await Bloque.findOne({ _id: reserva.bloqueId });
                if (!bloque) {
                    return res.status(404).json({
                        success: error,
                        message: "Hubo un error encontrando la información de la reserva."
                    });
                }

                const horario = await Horario.findOne({ _id: bloque.horarioId });
                if (!horario) {
                    return res.status(404).json({
                        success: error,
                        message: "Hubo un error encontrando la información de la reserva."
                    });
                }

                const casillero = await Casillero.findOne({ id: reserva.casilleroId });
                if (!casillero) {
                    return res.status(404).json({
                        success: error,
                        message: "Hubo un error encontrando la información de la reserva."
                    });
                }


                const horarioEscogido = `${horario.horarioInicio} - ${horario.horarioTermino}`;

                const data = [
                    ["9:35 - 10:45", "Bloqueado"],
                    ["10:55 - 12:05", "Bloqueado"],
                    ["12:15 - 13:25", "Bloqueado"],
                    ["14:30 - 15:40", "Bloqueado"],
                    ["15:50 - 17:00", "Bloqueado"],
                    ["17:10 - 18:20", "Bloqueado"],
                    ["18:30 - 19:40", "Bloqueado"]
                ];

                const arr = data.find(el => el[0] === horarioEscogido);
                arr[1] = `Reservado - Casillero N° ${casillero.id}`;

                return res.status(200).json({
                    success: true,
                    data: data
                })
            }
        }


        // Si no, retornar estados de cada bloque del día
        const now = new Date();

        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 0, 0, 0);
        const fechaActual = tomorrow.toLocaleString("es").split(", ")[0];
        const bloques = await Bloque.find({ fecha: fechaActual });

        const data = [
            ["9:35 - 10:45",  "No disponible"],
            ["10:55 - 12:05", "No disponible"],
            ["12:15 - 13:25", "No disponible"],
            ["14:30 - 15:40", "No disponible"],
            ["15:50 - 17:00", "No disponible"],
            ["17:10 - 18:20", "No disponible"],
            ["18:30 - 19:40", "No disponible"]
        ];

        for (let b of bloques) {
            const horario = await Horario.findOne({ _id: b.horarioId });

            if (b.disponible && b.cantInscritos >= b.cupoMaximo) {
                await Bloque.updateOne(
                    { _id: b._id },
                    { $set: {
                        disponible: false
                    } }
                );

                b.disponible = false;
            }

            const horarioEscogido = `${horario?.horarioInicio} - ${horario?.horarioTermino}`;
            const status = b.disponible ? "Disponible" : 
                            b.cantInscritos >= b.cupoMaximo ? "Lleno" : "No disponible";

            const arr = data.find(el => el[0] === horarioEscogido);
            arr[1] = status;
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


async function makeReserva(req, res) {

    try {

        const { horarioAsignado, casilleroId } = req.body;
        
        const horario = await Horario.findOne({ horarioInicio: horarioAsignado.split(" - ")[0], horarioTermino: horarioAsignado.split(" - ")[1] });
        
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 0, 0, 0);
        const fechaActual = tomorrow.toLocaleString("es").split(", ")[0];
        const bloque = await Bloque.findOne({ horarioId: horario._id , fecha: fechaActual });

        if (!bloque) {
            return res.status(404).json({
                success: false
            })
        }


        await Reserva.create({
            rutEstudiante: req.alumno.rut,
            bloqueId: bloque._id,
            casilleroId: casilleroId
        })


        const disponibleBloque = bloque.cantInscritos+1 >= bloque.cupoMaximo ? false : true;

        await Bloque.updateOne(
            { _id: bloque._id },
            { $set: {
                cantInscritos: bloque.cantInscritos+1,
                disponible: disponibleBloque
            } }
        )

        await Casillero.updateOne(
            { id: casilleroId },
            { $set: {
                disponible: false
            } }
        )

        
        nodemailer.sendReservationSuccess({
            fields: {
                nombre: req.alumno.nombre,
                apellido: req.alumno.apellido,
                casillero: casilleroId,
                fecha: bloque.fecha,
                correo: req.alumno.correo
            },
            email: req.alumno.correo
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


async function deleteReserva(req, res) {
    
    try {
        const {
            fecha,
            horario
        } = req.body;

        let horarioId = await Horario.findOne({ horarioInicio: horario.split(" - ")[0], horarioTermino: horario.split(" - ")[1] });
        horarioId = horarioId?._id;

        const bloque = await Bloque.findOne({ fecha, horarioId });

        const reserva = await Reserva.findOneAndDelete(
            { bloqueId: bloque._id, rutEstudiante: req.alumno.rut },
            { useFindAndModify: false, returnOriginal: false }
        );

        if (bloque.cantInscritos - 1 < bloque.cupoMaximo) {
            await Bloque.updateOne(
                { _id: bloque._id },
                { $set: {
                    cantInscritos: bloque.cantInscritos - 1,
                    disponible: true
                } }
            )
        }

        await Bloque.updateOne(
            { _id: bloque._id },
            { $set: {
                cantInscritos: bloque.cantInscritos - 1
            } }
        )

        await Casillero.updateOne(
            { id: reserva.casilleroId },
            { $set: {
                disponible: true
            } }
        )

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


async function getFromBloque(req, res) {

    try {
        const { horarioAsignado } = req.query;
        
        let horario = await Horario.findOne({ horarioInicio: horarioAsignado.split(" - ")[0], horarioTermino: horarioAsignado.split(" - ")[1] });
        const now = new Date();
        const fechaActual = now.toLocaleString("es").split(", ")[0];
        
        const bloque = await Bloque.findOne({ fecha: fechaActual, horarioId: horario?._id, rutFuncionario: req.funcionario.rut });

        const reservas = await Reserva.find({ bloqueId: bloque?._id });

        const data = [];

        for (const r of reservas) {
            const alumno = await Alumno.findOne({ rut: r.rutEstudiante });

            data.push({
                id: r._id,
                nombreEstudiante: `${alumno?.nombre} ${alumno?.apellido}`,
                rutEstudiante: r.rutEstudiante,
                correoEstudiante: alumno?.correo,
                casilleroId: r.casilleroId,
                asistencia: r.asistencia
            });
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


async function updateAsistencia(req, res) {

    try {
        const { id } = req.params;
        const { asistencia, previous } = req.body;

        const reserva = await Reserva.findOne({ _id: id });

        const bloque = await Bloque.findOne({ _id: reserva?.bloqueId, rutFuncionario: req.funcionario.rut });

        if (!bloque) {
            return res.status(401).json({
                success: false
            })
        }

        await Reserva.updateOne(
            { _id: id },
            { $set: {
                asistencia: asistencia
            } }
        )

        if ((previous === undefined || previous === true) && asistencia === false) {
            const alumno = await Alumno.findOne({ rut: reserva.rutEstudiante })

            await Alumno.updateOne(
                { rut: reserva.rutEstudiante },
                { $set: {
                    inasistencias: alumno?.inasistencias+1
                } }
            )
        }
        
        if (previous === false && asistencia === true) {
            const alumno = await Alumno.findOne({ rut: reserva.rutEstudiante })

            await Alumno.updateOne(
                { rut: reserva.rutEstudiante },
                { $set: {
                    inasistencias: alumno?.inasistencias-1
                } }
            )
        }

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
    getReservas,
    makeReserva,
    deleteReserva,
    getFromBloque,
    updateAsistencia
}