require('dotenv').config();
const nodemailer = require('nodemailer');

const email = process.env.EMAIL;
const pass = process.env.EMAIL_KEY;

const key = {
    user: email,
    pass: pass
}

const transportParams = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: key
}


async function send(body, subject, data) {

    try {
        const transporter = nodemailer.createTransport(transportParams);

        let body_text = body.replace(/<[^>]*>?/gm, '');
    
        var options = {
            from: `GymUSM <${email}>`,
            to: data.email,
            subject,
            text: body_text,
            html: body
        }
    
    
        const res = await transporter.sendMail(options);
        console.log("Message sent: %s", res.messageId);
    
        return true;    
    } catch (error) {
        console.log("[nodemailerIntegration] Un error ha ocurrido: ");
		console.log(error);
        return false;
    }

}


async function sendRegistrationSuccess(data) {

    if (!data) {
        return;
    }

    const subject = "Tu cuenta en Gym USM ha sido creada con éxito.";
    let body = registrationSuccessBody(data.fields);

    return await send(body, subject, data);

}


async function sendRegistrationNotification(data) {

    if (!data) {
        return;
    }

    const subject = "Se ha creado una cuenta en Gym USM con tus datos.";
    let body = registrationNotificationBody(data.fields);

    return await send(body, subject, data);

}


async function sendReservationSuccess(data) {

    if (!data) {
        return;
    }

    const subject = "Tu reserva en Gym USM ha sido realizada con éxito.";
    let body = reservationSuccessBody(data.fields);

    return await send(body, subject, data);

}


// Templates

// Styles
//


// Emails

var registrationSuccessBody = (fields) => `
<table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f2f2f2">
    <tr>
        <td align="center">
            <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; margin-top: 30px; margin-bottom: 30px;">
                <tr>
                    <td align="center" bgcolor="#ffffff" style="padding: 40px;">
                        <h1 style="color: #333333;">Confirmación Registro Cuenta Gym USM</h1>
                        <p style="color: #666666;">¡Hola ${fields.nombre}!,</p>
                        <p style="color: #666666;">Tú cuenta ha sido creada con éxito. Ahora puedes reservar hora para el gimnasio de la universidad.</p>
                        <p style="color: #666666;">Atentamente,</br>Gym USM.</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
`;

var registrationNotificationBody = (fields) => `
<table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f2f2f2">
    <tr>
        <td align="center">
            <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; margin-top: 30px; margin-bottom: 30px;">
                <tr>
                    <td align="center" bgcolor="#ffffff" style="padding: 40px;">
                        <h1 style="color: #333333;">Creación cuenta en Gym USM</h1>
                        <p style="color: #666666;">¡Hola ${fields.nombre}!,</p>
                        <p style="color: #666666;">Se ha creado una cuenta en nuestro sistema con tus datos. Podrás ingresar con las siguientes credenciales:</p>
                        <table cellpadding="5" cellspacing="0" border="1" width="100%" style="border-collapse: collapse; border-color: #666666;">
                            <tr>
                                <th style="background-color: #f2f2f2; border-color: #666666;">Rut</th>
                                <th style="background-color: #f2f2f2; border-color: #666666;">Contraseña</th>
                            </tr>
                            <tr>
                                <td style="border-color: #666666;">${fields.rut}</td>
                                <td style="border-color: #666666;">${fields.password}</td>
                            </tr>
                        </table>
                        <p style="color: #666666;">Atentamente,</br>Gym USM.</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
`;

var reservationSuccessBody = (fields) => `
<table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f2f2f2">
    <tr>
        <td align="center">
            <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; margin-top: 30px; margin-bottom: 30px;">
                <tr>
                    <td align="center" bgcolor="#ffffff" style="padding: 40px;">
                        <h1 style="color: #333333;">Confirmación Reserva Gym USM</h1>
                        <p style="color: #666666;">¡Hola ${fields.nombre}!,</p>
                        <p style="color: #666666;">Tu reserva en nuestro gimnasio ha sido realiza con éxito. A continuación, se encuentra un resumen de esta:</p>
                        <table cellpadding="5" cellspacing="0" border="1" width="100%" style="border-collapse: collapse; border-color: #666666;">
                            <tr>
                                <th style="background-color: #f2f2f2; border-color: #666666;">Fecha</th>
                                <th style="background-color: #f2f2f2; border-color: #666666;">Casillero</th>
                                <th style="background-color: #f2f2f2; border-color: #666666;">Nombre</th>
                                <th style="background-color: #f2f2f2; border-color: #666666;">Correo</th>
                            </tr>
                            <tr>
                                <td style="border-color: #666666;">${fields.fecha}</td>
                                <td style="border-color: #666666;">${fields.casillero}</td>
                                <td style="border-color: #666666;">${fields.nombre} ${fields.apellido}</td>
                                <td style="border-color: #666666;">${fields.correo}</td>
                            </tr>
                        </table>
                        <p style="color: #666666;">Atentamente,</br>Gym USM.</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
`;


// sendRegistrationSuccess({
//     fields: {
//         name: "Bruno"
//     },
//     email: "bruno_560_560@hotmail.com"
// });

// sendReservationSuccess({
//     fields: {
//         nombre: "Bruno",
//         apellido: "Liberona",
//         casillero: 1,
//         fecha: "07-12-2023",
//         correo: "bruno_560_560@hotmail.com"
//     },
//     email: "bruno_560_560@hotmail.com"
// })


module.exports = {
    sendRegistrationSuccess,
    sendRegistrationNotification,
    sendReservationSuccess
}