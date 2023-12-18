const express = require("express");
const router = express.Router();

const authMiddleware = require("../authMiddleware");


// View routes

router.get('/', (req, res) => {
    res.status(200).render("index.html");
});


router.get('/login', (req, res) => {
    res.status(200).render("login.html");
});

router.get('/registrarse', (req, res) => {
    res.status(200).render("registrarse.html");
});


router.get('/reserva', 
    [
        authMiddleware.estudianteAccess
    ], 
    (req, res) => {
        res.status(200).render("reserva.html");
    }
);


router.get('/asistencia',
    [
        authMiddleware.funcionarioAccess
    ], 
    (req, res) => {
        res.status(200).render("asistencia.html");
    }
)


router.get('/horariosFuncionarios',
    [
        authMiddleware.superFuncionarioAccess
    ],
    (req, res) => {
        res.status(200).render("horariosFuncionarios.html")
    }
);

router.get('/funcionarios',
    [
        authMiddleware.superFuncionarioAccess
    ],
    (req, res) => {
        res.status(200).render("funcionarios.html")
    }
)

router.get('/estudiantes',
    [
        authMiddleware.superFuncionarioAccess
    ],
    (req, res) => {
        res.status(200).render("estudiantes.html")
    }
)

router.get('/casilleros',
    [
        authMiddleware.superFuncionarioAccess
    ],
    (req, res) => {
        res.status(200).render("casilleros.html")
    }
)


module.exports = router;