const express = require("express");
const router = express.Router();

const authMiddleware = require("../authMiddleware");
const alumnoController = require("../controllers/alumno.controller");


// Alumno routes

router.get('/getAll',
    [
        authMiddleware.superFuncionarioAccess
    ],
    alumnoController.getAll
)


router.post('/',
    [
        authMiddleware.superFuncionarioAccess
    ],
    alumnoController.createAlumno
)


router.patch('/:alumnoId',
    [
        authMiddleware.superFuncionarioAccess
    ],
    alumnoController.updateAlumno
)


router.delete('/:alumnoId',
    [
        authMiddleware.superFuncionarioAccess
    ],
    alumnoController.deleteAlumno
)


module.exports = router;