const express = require("express");
const router = express.Router();

const authMiddleware = require("../authMiddleware");
const bloqueController = require("../controllers/bloque.controller");


// Bloques routes

router.post('/getBloqueData',
    [
        authMiddleware.estudianteAccess
    ],
    bloqueController.getBloqueData
)


router.get('/getBloquesWeekData',
    [
        authMiddleware.superFuncionarioAccess
    ],
    bloqueController.getBloquesWeekData
)


router.post('/createBloque',
    [
        authMiddleware.superFuncionarioAccess
    ],
    bloqueController.makeBloque
)


router.get('/getBloque',
    [
        authMiddleware.superFuncionarioAccess
    ],
    bloqueController.getBloque
)


router.patch('/updateBloque/:id',
    [
        authMiddleware.superFuncionarioAccess
    ],
    bloqueController.updateBloque
)

router.get('/getBloquesFromFuncionario',
    [
        authMiddleware.funcionarioAccess
    ],
    bloqueController.getBloquesFuncionario
)


module.exports = router;