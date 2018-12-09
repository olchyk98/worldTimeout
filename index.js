const express = require('express');
const socketIo = require('socket.io');

const app = express();
const server = app.listen(4000, () => console.log("Server is listening on port 4000!"));

const defaultTime = 60;
const info = {
	time: defaultTime,
	connected: 0,
	isEnd: false
}

const inti = setInterval(() => {
	io.sockets.emit('receive_update', --info.time);
	if(info.time <= 0) {
		clearInterval(inti);
		io.sockets.emit('receive_end', true);
	}
}, 1000);

const io = socketIo(server);

io.sockets.on('connection', socket => {
	console.log(`New user connected! id: ${ socket.id }`);
	info.connected++;

	socket.on('click', data => {
		info.time = defaultTime;
		io.sockets.emit('receive_update', info.time);
	});
});

app.use(express.static('./public'));
