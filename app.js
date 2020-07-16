const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const handlebars = require('express-handlebars');
const app = express();
const urlencodeParser=bodyParser.urlencoded({extended:false});
const sql = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    port:3306
});
sql.query("use smarkio");
app.engine("handlebars", handlebars({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

const fs = require('fs');
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const textToSpeech = new TextToSpeechV1({
  authenticator: new IamAuthenticator({
    apikey: 'iRqBDQX0LaN0OmwIBCKjBKJ662NMbiL8VynjCMrRD7bi',
  }),
  url: 'https://api.us-east.text-to-speech.watson.cloud.ibm.com/instances/c59a0461-a7d2-47d9-b338-ea35794521bc',
});


app.get('/:id?', function(req, res){
    // res.render('index', {now: new Date().toLocaleString()});
    if(!req.params.id){
        sql.query("select * from comentarios ", function(err, results, fields){
            res.render('index',{data:results});
        })
    }
})

app.use('/js', express.static('js'));
app.use('/css', express.static('css'));
app.use('/audios', express.static('audios'));
app.post('/salvar',urlencodeParser,function(req,res){
    sql.query('insert into comentarios values(?,?)', ["",req.body.texto], function(err, results){
        const texto_Arquivo = "audios/audio_" +  results.insertId + ".wav"
        const synthesizeParams = {
            text: req.body.texto,
            accept: 'audio/wav',
            voice: 'pt-BR_IsabelaV3Voice',
          };
        
          textToSpeech.synthesize(synthesizeParams)
          .then(response => {
            return textToSpeech.repairWavHeaderStream(response.result);
          })
          .then(buffer => {
            fs.writeFileSync(texto_Arquivo, buffer);
          })
          .then(response => {
              sql.query("select * from comentarios", function(err, results, fields){
                  res.render('index',{data:results , result: "adicionado"});
                 })
          })
          .catch(err => {
            console.log('error:', err);
          });
    });
    
    
})

app.listen(3000, function(req, res){
    console.log('Servidor esta rodando')
})

