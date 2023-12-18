const Casillero = require("../models/Casillero");


async function getCasilleros(req, res) {

    try {
        const casilleros = await Casillero.find();

        const data = casilleros.map(c => {
            return {
                id: c.id,
                disponible: c.disponible,
                estadoDescripcion: c.estadoDescripcion
            }
        })

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


async function updateCasillero(req, res) {

    try {
        const { id } = req.params;

        const { disponible, estadoDescripcion } = req.body;

        await Casillero.updateOne(
            { id: id },
            { $set: {
                disponible,
                estadoDescripcion
            } }
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


module.exports = {
    getCasilleros,
    updateCasillero
}