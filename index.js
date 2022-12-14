require('dotenv').config({
    path: '.env'
});
const logger = require('./config/Logger');
const pg = require('./config/Bdd');
const path = require('path');
const bodyParser = require('body-parser');

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var port = process.env.PORT || 3000;
var hostname = process.env.HOST || '127.0.0.1';

// Use of socket io for all events

io.on('connection', (socket) => {

    socket.on('message', () => {
        logger.info('A user has logged in');
    })


    socket.on('tchat-message', (data) => {
        io.emit('tchat-message', data);
    })

    // If i wanted to used socket only
    // socket.on('created', (data) => {
    //     console.log(data);
    //     let $query = `INSERT INTO games(game_name) VALUES ($1) RETURNING game_id`;

    //     let id = pg.query($query, [data.name]).then((value) => {
    //         // sendEvent();
    //         res.status(200).json(true);
    //     }).catch((err) => {
    //         logger.error(err);
    //     });
    // })
})

logger.info('Initialisation of the application');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'twig');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    let $query = `SELECT * from games where status <> 0 ORDER BY created_on DESC`;
    let $query2 = `SELECT COUNT(game_id) as number_games from games where (game_finished <> 1 OR game_finished IS null) AND status <> 0`;

    Promise.all([
        pg.query($query),
        pg.query($query2)
      ]).then(([value, data]) => {
        res.render('home',{
            title: 'Babyfoot Manager',
            games: value.rows,
            number: data.rows
        });
      }, (error) => {
        logger.error(error);
      });
});

app.post('/create', (req,res) => {
    let $query = `INSERT INTO games(game_name) VALUES ($1) RETURNING game_id, game_name, game_finished`;
    let id = pg.query($query, [req.body.name]).then((value) => {
        sendNumberOfUnfinished();
        io.emit('created', value.rows);
        res.status(200).json(true);
    }).catch((err) => {
        logger.error(err);
    });
})

app.post('/update', (req,res) => {
    let $query = `UPDATE games SET game_finished = $2, updated_on = NOW() WHERE game_id = $1 RETURNING game_id, game_finished`;
    let id = pg.query($query, [req.body.id, req.body.value]).then((value) => {
        sendNumberOfUnfinished();
        io.emit('updated', value.rows);
        res.status(200).json(true);
    }).catch((err) => {
        logger.error(err);
    });
})

app.delete('/delete', (req,res) => {
    let $query = `UPDATE games SET status = 0, deleted_on = NOW() WHERE game_id = $1 RETURNING game_id`;
    let id = pg.query($query, [req.body.id]).then((value) => {
        sendNumberOfUnfinished();
        io.emit('deleted', value.rows);
        res.status(200).json(true);
    }).catch((err) => {
        logger.error(err);
    });
})

function sendNumberOfUnfinished() {
    let $query = `SELECT COUNT(game_id) from games where (game_finished <> 1  OR game_finished IS null) AND status <> 0`;
    pg.query($query).then((value) => {
        console.log(value)
        io.emit('numberGames', value.rows);
    }).catch((err) => {
        logger.error(err);
    });
}

server.listen(port, hostname, () => {
    logger.info(`Server's started on: ${hostname}:${port}`);
});
