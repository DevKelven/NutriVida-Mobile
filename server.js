//configrações iniciais
const express = require('express'); // estou criando o servidor web
const mysql = require('mysql2'); //permite enviar sql para o BD
const cors = require('cors');// cors evita bloqueios nas requisições
const app = express();

app.use(cors());
app.use(express.json());// fala para o express entender quando enviamos dados Json

// agora vamos fazer a comunicação com o mysql
const db = mysql.createConnection({
    host: 'localhost',// nesse caso o banco está meu computador
    user: 'root', 
    password: '', // Senha padrão do xampp costuma ser vazia
    database: 'nutri_vida'// nome do meu banco
});

// Rota para buscar dados
app.get('/dados', (req, res) => { // aqui estou criando minha rota/endpoint chamado /dados
    db.query('SELECT * FROM usuarios', (err, result) => {  //estou falando para o sql me dar tudo da tabela lembretes
        if (err) return res.status(500).send(err); //se der ruim no BD retorna status 500
        res.json(result); // se der bom no BD, ele pega as linahs do banco e retorna em formato json.
    });
});

// aqui ligamos o servidor para deixar a PI rodando
// app.listen(3000, () => console.log("API rodando na porta 3000"));
const PORTA = 135;

// O '0.0.0.0' é fundamental: ele diz ao Node para ouvir o IP da rede, não só o localhost
app.listen(PORTA, '0.0.0.0', () => {
    console.log(`✅ Servidor rodando no IP da rede!`);
    console.log(`Endereço: http://192.168.14.202:${PORTA}/dados`);
});