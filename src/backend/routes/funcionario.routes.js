const express = require("express");
const router = express.Router();

const authMiddleware = require("../authMiddleware");
const funcionarioController = require("../controllers/funcionario.controller");


// Funcionario routes

router.get('/getAll',
    [
        authMiddleware.superFuncionarioAccess
    ],
    funcionarioController.getAll
)


router.post('/',
    [
        authMiddleware.superFuncionarioAccess
    ],
    funcionarioController.createFuncionario
)


router.patch('/:funcionarioId',
    [
        authMiddleware.superFuncionarioAccess
    ],
    funcionarioController.updateFuncionario
)


router.delete('/:funcionarioId',
    [
        authMiddleware.superFuncionarioAccess
    ],
    funcionarioController.deleteFuncionario
)


module.exports = router;