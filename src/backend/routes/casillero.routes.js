const express = require("express");
const router = express.Router();

const authMiddleware = require("../authMiddleware");
const casilleroController = require("../controllers/casillero.controller");


// Casillero routes

router.get('/getAll',
    [
        authMiddleware.superFuncionarioAccess
    ],
    casilleroController.getCasilleros
)


router.patch('/:id',
    [
        authMiddleware.superFuncionarioAccess
    ],
    casilleroController.updateCasillero
)


module.exports = router;