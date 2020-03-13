const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
const multer = require('multer');
const fs = require('fs');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// CORS
app.use(cors());
// var whiteList = ['https://junioralvesbr.github.io/'];
// var corsOption = {
//     origin: function(origin, callback) {
//         if (whiteList.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             callback(new Error('not allowed by CORS'))
//         }
//     }
// }

// SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


// Multer recebe upload das imagens e grava na pasta upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}.png`);
    }
});
const upload = multer({storage});


// Metodos Servidor
app.get('/', (req, res) => {
    res.send('<h1>Servidor no AR</h1>');
})

app.post('/uploads', upload.fields([
    {name: 'imageDocument', maxCount: 1},
    {name: 'imageComp', maxCount: 1},
    {name: 'imageRenda', maxCount: 1}
]), (req, res, next) => {
    res.json({message: 'upload sucess'});
})

app.post('/', (req, res) => {
    const body = req.body;
    
    setTimeout(function() {
        sendEmail(body);
    }, 10000)

    res.json(body);
});

const sendEmail = (body) => {
    const pathDocument = `./uploads/imageDocument.png`;
    const attachDocument = fs.readFileSync(pathDocument).toString("base64");

    const pathComp = `./uploads/imageComp.png`;
    const attachComp = fs.readFileSync(pathComp).toString("base64");

    const pathRenda = `./uploads/imageRenda.png`;
    const attachRenda = fs.readFileSync(pathRenda).toString("base64");

    const msg = {
        to: ['alonsomaringa@gmail.com', 'alonso.mga@blokton.com.br', 'jrnalves@gmail.com'],
        from: 'alonsomaringa@gmail.com',
        subject: `Formulario de financiamento do ${body.name}`,
        text: 'Formulario financimento',
        html: `<div>
                    <div style="padding: 5px">Nome: <strong style="font-size: 16px">${body.name}</strong></div>
                    <div style="padding: 5px">CPF: <strong style="font-size: 16px">${body.cpf}</strong></div>
                    <div style="padding: 5px">Celular: <strong style="font-size: 16px">${body.cellPhone}</strong></div>
                    <div style="padding: 5px">Telefone: <strong style="font-size: 16px">${body.telePhone}</strong></div>
                    <div style="padding: 5px">Email: <strong style="font-size: 16px">${body.email}</strong></div>
                    <h2>Estado Civil</h2>
                    <div style="padding: 5px">Estado Civil: <strong style="font-size: 16px">${body.inputCivil}</strong></div>
                    <div style="padding: 5px">Nome Conjuge: <strong style="font-size: 16px">${body.nomeConjuge}</strong></div>
                    <div style="padding: 5px">Data Nascimento: <strong style="font-size: 16px">${body.dataConjuge}</strong></div>
                    <h2>Endereço Residencial</h2>
                    <div style="padding: 5px">Endeeço: <strong style="font-size: 16px">${body.inputAddress}</strong></div>
                    <div style="padding: 5px">Bairro: <strong style="font-size: 16px">${body.inputDistrict}</strong></div>
                    <div style="padding: 5px">Cidade: <strong style="font-size: 16px">${body.inputCity}</strong></div>
                    <div style="padding: 5px">Estado: <strong style="font-size: 16px">${body.inputEstate}</strong></div>
                    <div style="padding: 5px">CEP: <strong style="font-size: 16px">${body.inputCEP}</strong></div>
                    <div style="padding: 5px">Tempo de Residencia: <strong style="font-size: 16px">${body.inputYears}</strong></div>
                    <h2>Dados da Empresa</h2>
                    <div style="padding: 5px">Nome da Empresa: <strong style="font-size: 16px">${body.inputCompany}</strong></div>
                    <div style="padding: 5px">Telefone da Empresa: <strong style="font-size: 16px">${body.companyFone}</strong></div>
                    <div style="padding: 5px">Data de Admissão: <strong style="font-size: 16px">${body.inputDate}</strong></div>
                    <div style="padding: 5px">Salario: <strong style="font-size: 16px">${body.inputSalary}</strong></div>
                    <h2>Referencias Pessoais</h2>
                    <div style="padding: 5px">Nome: <strong style="font-size: 16px">${body.inputReferenceName1}</strong></div>
                    <div style="padding: 5px">Telefone: <strong style="font-size: 16px">${body.inputReferenceTell1}</strong></div>
                    <div style="padding: 5px">Nome: <strong style="font-size: 16px">${body.inputReferenceName2}</strong></div>
                    <div style="padding: 5px">Telefone: <strong style="font-size: 16px">${body.inputReferenceTell2}</strong></div>
                    <h2>Dados do Banco</h2
                    <div style="padding: 5px">Nome do Banco: <strong style="font-size: 16px">${body.inputBank}</strong></div>
                    <div style="padding: 5px">Agencia: <strong style="font-size: 16px">${body.inputAgency}</strong></div>
                    <div style="padding: 5px">Conta: <strong style="font-size: 16px">${body.inputCount}</strong></div>
                </div>`,
                attachments: [
                    {
                        content: attachDocument,
                        filename: "imageDocument.png",
                        type: "image/png",
                        disposition: "attachment",
                        contentId: "imageDocument"
                    },
                    {
                        content: attachComp,
                        filename: "imageComp.png",
                        type: "image/png",
                        disposition: "attachment",
                        contentId: "imageComp"
                    },
                    {
                        content: attachRenda,
                        filename: "imageRenda.png",
                        type: "image/png",
                        disposition: "attachment",
                        contentId: "imageRenda"
                    }
                ]
    };

    sgMail.send(msg);

    setTimeout(function() {
        deleteFiles(pathDocument);
        deleteFiles(pathComp);
        deleteFiles(pathRenda);
    }, 20000)
}

const deleteFiles = (props) => {
    fs.stat(props, function(err, stats) {
        if (err) {
            return console.error(err);
        }

        fs.unlinkSync(props, function(err) {
            if (err) console.log(err);
            console.log('file deleted sucessfully');
        })
    })
}

app.listen(process.env.PORT || '3333', () => console.log('Sevidor no Ar'));
