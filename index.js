require('dotenv').config({
    path: '.env'
});
const logger = require('./config/Logger');
const pg = require('./config/Bdd');
const path = require('path');
const bodyParser = require('body-parser');
// const event = require('events');
// const eventEmit = new event.EventEmitter();
const { WebSocketServer } = require('ws');

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
// var wss = new WebSocketServer({ server });

var port = process.env.PORT || 3000;
var hostname = process.env.HOST || '127.0.0.1';


// let clients = {};

// wss.on('connection', function connection(ws, req, client) {
//     ws.on('message', function message(data) {
//         // Update list
//         let $query = `SELECT * from games where status <> 0 ORDER BY created_on DESC`;
//         pg.query($query).then((value) => {
//             console.log(wss.clients)

//             wss.clients.forEach(function each(client) {
//                 if (client.readyState === WebSocket.OPEN) {
//                   client.send(data, { binary: isBinary });
//                 }
//             });
//             // wss.send('list',value)
//         }).catch((err) => {
//             this.logger.error(err);
//         });
//         console.log(`Received message ${data} from user ${client}`);
//     });
// });

io.on('connection', (socket) => {
    io.on('updated', () => {
        socket.broadcast.emit('test','ceci est un test')
    })
})

// Raising ping event

logger.info('Initialisation of the application');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'twig');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    let $query = `SELECT * from games where status <> 0 ORDER BY created_on DESC`;
    pg.query($query).then((value) => {
        res.render('home',{
            title: 'Babyfoot Manager',
            games: value.rows
        });
    }).catch((err) => {
        this.logger.error(err);
    });
});

app.post('/create', (req,res) => {
    let $query = `INSERT INTO games(game_name) VALUES ($1) RETURNING game_id`;

    let id = pg.query($query, [req.body.name]).then((value) => {
        sendEvent();
        res.status(200).json(true);
    }).catch((err) => {
        this.logger.error(err);
    });
})
// async function create(ws,socket) {
//     let $query = `INSERT INTO games(game_name) VALUES (test) RETURNING game_id`;

//     let id = await pg.query($query).then((value) => {
//         // sendEvent();
//         return socket.send(value);
//         res.status(200).json(true);
//     }).catch((err) => {
//         this.logger.error(err);
//     });
// }

app.post('/update', (req,res) => {
    let $query = `UPDATE games SET game_finished = $2, updated_on = NOW() WHERE game_id = $1`;

    let id = pg.query($query, [req.body.id, req.body.value]).then((value) => {
        // sendEvent();
        res.status(200).json(true);
    }).catch((err) => {
        this.logger.error(err);
    });
})

app.delete('/delete', (req,res) => {
    let $query = `UPDATE games SET status = 0, deleted_on = NOW() WHERE game_id = $1`;

    let id = pg.query($query, [req.body.id]).then((value) => {
        // sendEvent();
        res.status(200).json(true);
    }).catch((err) => {
        this.logger.error(err);
    });
})

function sendEvent(ws) {
    let $query = `SELECT * from games where status <> 0 ORDER BY created_on DESC`;
    pg.query($query).then((value) => {
        // wss.broadcast = (data) => {
            for(var i in ws.clients)
                console.log(ws.clients)
                if (i.readyState === ws.OPEN) i.send('test')
        // };
        // wss.send('list',value)
    }).catch((err) => {
        this.logger.error(err);
    });
}

server.listen(port, hostname, () => {
    logger.info(`Server's started on: ${hostname}:${port}`);
});