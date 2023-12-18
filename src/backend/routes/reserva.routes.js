const express = require("express");
const router = express.Router();

const authMiddleware = require("../authMiddleware");
const reservaController = require("../controllers/reserva.controller");


// Reserva routes

router.get('/getReservas',
    [
        authMiddleware.estudianteAccess
    ],
    reservaController.getReservas
)


router.post('/reservar',
    [
        authMiddleware.estudianteAccess
    ],
    reservaController.makeReserva
)


router.delete('/',
    [
        authMiddleware.estudianteAccess
    ],
    reservaController.deleteReserva
)


router.get('/fromBloque',
    [
        authMiddleware.funcionarioAccess
    ],
    reservaController.getFromBloque
)


router.patch('/:id',
    [
        authMiddleware.funcionarioAccess
    ],
    reservaController.updateAsistencia
)


// router.patch()


module.exports = router;