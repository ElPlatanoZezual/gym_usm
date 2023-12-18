const Reserva = require("../models/Reserva");
const Bloque = require("../models/Bloque");
const Horario = require("../models/Horario");
const Casillero = require("../models/Casillero");
const Funcionario = require("../models/Funcionario");


async function getBloqueData(req, res) {

    try {

        const { horarioAsignado } = req.body;

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

        const casillero = await Casillero.findOne({ disponible: true });

        const funcionario = await Funcionario.findOne({ rut: bloque.rutFuncionario });

        return res.status(200).json({
            success: true,
            data: {
                casillero: casillero.id,
                funcionario: `${funcionario.nombre} ${funcionario.apellido}`,
                fecha: fechaActual
            }
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Ha ocurrido un error. Inténtelo nuevamente."
        })
    }

}


async function getBloquesWeekData(req, res) {

    try {

        let data = [
            ["9:35 - 10:45", null, null, null, null, null],
            ["10:55 - 12:05", null, null, null, null, null],
            ["12:15 - 13:25", null, null, null, null, null],
            ["14:30 - 15:40", null, null, null, null, null],
            ["15:50 - 17:00", null, null, null, null, null],
            ["17:10 - 18:20", null, null, null, null, null],
            ["18:30 - 19:40", null, null, null, null, null]
        ];

        // Consulta para encontrar documentos dentro de la semana actual`
        function obtenerDiasSemana() {
            const hoy = new Date();
            const diaActual = hoy.getDay(); // Obtener el día de la semana (0-6)

            const diasSemana = [];
            const diasAnteriores = diaActual - 1; // Obtener los días anteriores (lunes a viernes)
            const diasPosteriores = 5 - diaActual; // Obtener los días posteriores (lunes a viernes)

            for (let i = diaActual - diasAnteriores; i <= diaActual + diasPosteriores; i++) {
                const dia = new Date(hoy); // Crear una nueva instancia para no modificar la fecha actual
                dia.setDate(hoy.getDate() + i - diaActual); // Calcular el día sumando/restando días

                diasSemana.push(dia.toLocaleString("es").split(",")[0]);
            }

            return diasSemana;
        }

        const diasSemana = obtenerDiasSemana();

        for (let i = 0; i < diasSemana.length; i++) {
            const bloques = await Bloque.find({ fecha: diasSemana[i] });

            for (let b of bloques) {
                const h = await Horario.findOne({ _id: b.horarioId });
                const f = await Funcionario.findOne({ rut: b.rutFuncionario });

                const hora = `${h?.horarioInicio} - ${h?.horarioTermino}`;

                if (b.disponible && b.cantInscritos >= b.cupoMaximo) {
                    await Bloque.updateOne(
                        { _id: b._id },
                        { $set: {
                            disponible: false
                        } }
                    );

                    b.disponible = false;
                }

                data.find(a => a[0] === hora)[i+1] = `Funcionario: ${f?.nombre} ${f?.apellido}` + 
                    `\nInscritos: ${b.cantInscritos}/${b.cupoMaximo}` +
                    `\nDisponible: ${b.disponible ? 'Sí' : 'No'}`;
            }
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


async function makeBloque(req, res) {

    try {
        let {
            rutFuncionario,
            fecha,
            cupoMaximo,
            horario
        } = req.body;


        var selectedDate = new Date();
        let weas = selectedDate.toLocaleString("es").split(", ")[0].split("/");
        fecha = `${fecha}/${weas[1]}/${weas[2]}`;
        
        const h = await Horario.findOne({ horarioInicio: horario.split(" - ")[0], horarioTermino: horario.split(" - ")[1] });

        await Bloque.create({
            rutFuncionario,
            fecha,
            cupoMaximo,
            cantInscritos: 0,
            disponible: true,
            horarioId: h?._id
        })

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


async function getBloque(req, res) {

    try {
        let horario = req.query.horario;
        horario = await Horario.findOne({ horarioInicio: horario.split(" - ")[0], horarioTermino: horario.split(" - ")[1] });

        let fecha = req.query.fecha;
        var selectedDate = new Date();
        let weas = selectedDate.toLocaleString("es").split(", ")[0].split("/");
        fecha = `${fecha}/${weas[1]}/${weas[2]}`

        const bloque = await Bloque.findOne({ fecha: fecha, horarioId: horario });

        return res.status(200).json({
            success: true,
            data: bloque
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Ha ocurrido un error. Inténtelo nuevamente."
        })
    }

}

async function updateBloque(req, res) {

    try {
        let { 
            cupoMaximo,
            rutFuncionario,
            disponible
        } = req.body

        disponible = disponible === "true" ? true : false;

        await Bloque.updateOne(
            { _id: req.params.id },
            { $set: {
                cupoMaximo,
                rutFuncionario,
                disponible
            } }
        )

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


async function getBloquesFuncionario(req, res) {

    try {
        const now = new Date();
        const fechaActual = now.toLocaleString("es").split(", ")[0];
        const bloques = await Bloque.find({ fecha: fechaActual, rutFuncionario: req.funcionario.rut });

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
            const reservas = await Reserva.find({ bloqueId: b._id });
            const asistencia = {
                as: 0,
                inas: 0
            };
            reservas.forEach(r => {
                if (r.asistencia) {
                    asistencia.as += 1;
                } else {
                    asistencia.inas += 1;
                }
            });

            const horario = await Horario.findOne({ _id: b.horarioId });

            const horarioEscogido = `${horario?.horarioInicio} - ${horario?.horarioTermino}`;
            const text =    `Total Inscritos: ${b.cantInscritos}<br>` + 
                            `Asistencia: ${asistencia.as}<br>` +
                            `Inasistencia: ${asistencia.inas}<br>`

            const status = b.disponible || b.cantInscritos >= b.cupoMaximo ? text : "No disponible";

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


module.exports = {
    getBloqueData,
    getBloquesWeekData,
    makeBloque,
    getBloque,
    updateBloque,
    getBloquesFuncionario
}