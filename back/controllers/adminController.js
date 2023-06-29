'use strict'
var Admin = require('../models/admin')
const bcrypt = require('bcrypt');
var jwt = require('../helpers/jwt')
const axios = require('axios');
const fs = require('fs');
const registro_admin = async function(req, res) {
    var data = req.body;
    console.log(data);
    var admin_arr = [];
    admin_arr = await Admin.find({ email: data.email });
    if (admin_arr.length == 0) {
        if (data.password) {
            try {
                const hash = await bcrypt.hash(data.password, 10);
                data.password = hash;
                var reg = await Admin.create(data);
                
                // Envío de correo electrónico transaccional
                const sender = {
                    name: data.nombres + ' ' + data.apellidos, // Utiliza los nombres y apellidos registrados como nombre del remitente
                    email: data.email // Utiliza el correo electrónico registrado como remitente
                };

                const recipient = {
                    name: data.nombres + ' ' + data.apellidos, // Utiliza los nombres y apellidos registrados como nombre del destinatario
                    email: data.email // Utiliza el correo electrónico registrado como destinatario
                };

                const subject = 'Hello world';

                const filePath = './controllers/correccion.html'; // Ruta al archivo HTML que deseas incluir

                try {
                    const htmlFileContent = await fs.promises.readFile(filePath, 'utf-8');
                    const htmlContent = htmlFileContent;

                    const emailData = {
                        sender,
                        to: [recipient],
                        subject,
                        htmlContent
                    };

                    const headers = {
                        'accept': 'application/json',
                        'api-key': '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', // Reemplaza con tu propia clave de API de Brevo
                        'content-type': 'application/json'
                    };

                    try {
                        await axios.post('https://api.brevo.com/v3/smtp/email', emailData, { headers });
                        console.log('Correo electrónico enviado');
                    } catch (error) {
                        console.error('Error al enviar el correo electrónico:', error);
                    }

                    res.status(200).send({ data: reg });
                } catch (error) {
                    console.error('Error al leer el archivo HTML:', error);
                    res.status(500).send({ message: 'Error al leer el archivo HTML', data: undefined });
                }
            } catch (error) {
                console.error('Error al hashear la contraseña:', error);
                res.status(500).send({ message: 'Error al crear el admin', data: undefined });
            }
        } else {
            res.status(200).send({ message: 'No hay una contraseña', data: undefined });
        }
    } else {
        res.status(200).send({ message: 'El correo ya existe en la base de datos', data: undefined });
    }
}

const login_admin = async function(req, res) {
    var data = req.body;
    var admin_arr = [];

    admin_arr = await Admin.find({ email: data.email });

    if (admin_arr.length == 0) {
      res.status(200).send({ message: 'Nombre de usuario y / o contraseña no válidos', data: undefined });
    } else {
        let user = admin_arr[0];
        bcrypt.compare(data.password, user.password, async function(err,check){
            if(check){
                res.status(200).send({
                    data:user,
                    token: jwt.createToken(user)
                });
            
            }else{
                res.status(200).send({message : 'la contraseña no coinciden', data:undefined});
            }
        });
    }
};

const resetPassword = async function(req, res) {
    var data = req.body;
    var admin_arr = [];

    admin_arr = await Admin.find({ email: data.email });
    admin_arr = await Admin.find({ email: data.email });
    console.log(data);
    if (admin_arr.length == 0) {
        res.status(200).send({ message: 'El correo no está registrado', data: undefined });
    } else {
        let user = admin_arr[0];
        const newPassword = data.password; // Obtén la nueva contraseña ingresada por el usuario

        try {
            const hash = await bcrypt.hash(newPassword, 10);
            user.password = hash;
            await user.save();

            // Envío de correo electrónico para restablecer la contraseña
            const sender = {
                name: user.nombres + ' ' + user.apellidos, // Utiliza los nombres y apellidos registrados como nombre del remitente
                email: user.email // Utiliza el correo electrónico registrado como remitente
            };

            const recipient = {
                name: user.nombres + ' ' + user.apellidos, // Utiliza los nombres y apellidos registrados como nombre del destinatario
                email: user.email // Utiliza el correo electrónico registrado como destinatario
            };

            const subject = 'Restablecimiento de contraseña';

            const resetPasswordMessage = 'Tu contraseña ha sido restablecida exitosamente.';

            const emailData = {
                sender,
                to: [recipient],
                subject,
                htmlContent: resetPasswordMessage
            };

            const headers = {
                'accept': 'application/json',
                'api-key': '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', // Reemplaza con tu propia clave de API de Brevo
                'content-type': 'application/json'
            };

            try {
                await axios.post('https://api.brevo.com/v3/smtp/email', emailData, { headers });
                console.log('Correo electrónico de restablecimiento de contraseña enviado');
                res.status(200).send({ message: 'Se ha restablecido la contraseña y se ha enviado un correo electrónico de confirmación', data: undefined });
            } catch (error) {
                console.error('Error al enviar el correo electrónico de restablecimiento de contraseña:', error);
                res.status(500).send({ message: 'Error al enviar el correo electrónico de restablecimiento de contraseña', data: undefined });
            }
        } catch (error) {
            console.error('Error al hashear la nueva contraseña:', error);
            res.status(500).send({ message: 'Error al restablecer la contraseña', data: undefined });
        }
    }
};


module.exports = {
    registro_admin,
    login_admin,
    resetPassword
}