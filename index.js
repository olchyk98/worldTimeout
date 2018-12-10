const express = require('express');
const socketIo = require('socket.io');

const app = express();
const server = app.listen(4000, () => console.log("Server is listening on port 4000!"));

const defaultTime = 5,
	  banTime = 2;
const info = {
	time: defaultTime,
	connected: 0,
	isEnd: false,
	banned: [] // id, socket, time
}

let refreshBan = () => {
	info.banned.forEach((io, ia) => {
		io.socket.emit('receive_ban', io.time);
	});
}
let intiModal = null;
let inti = () => {	
	clearInterval(intiModal);
	intiModal = setInterval(function() {
		io.sockets.emit('receive_update', --info.time);
		if(info.time <= 0) {
			clearInterval(this);
			io.sockets.emit('receive_end', true);
		}
		info.banned.forEach((io, ia) => {
			let a = --io.time;
			if(!a) {
				info.banned.splice(ia, 1);
				io.socket.emit('receive_ban', 0);
			}
		});
		refreshBan();
	}, 1000);
}

inti();

const io = socketIo(server);
io.sockets.on('connection', socket => {
	console.log(`New user connected! id: ${ socket.id }`);
	info.connected++;

	if(info.time !== 0) socket.emit('receive_update', info.time);
	else socket.emit('receive_end', true);
	socket.on('click', data => {
		if(info.banned.find(io => io.id === socket.id)) return;

		info.banned.push({
			id: socket.id,
			socket,
			time: banTime
		});
		refreshBan();

		info.time = defaultTime;
		io.sockets.emit('receive_update', info.time);
		inti();
	});
});

app.use(express.static('./public'));
