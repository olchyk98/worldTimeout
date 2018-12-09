const socket = io.connect("http://localhost:4000");

let main = document.querySelector('#hitter'),
	update = data => {
		main.innerHTML = data;
	}

socket.on('receive_update', update);
socket.on('receive_end', () => {
	update("END!");
});
// socket.emit('click', true);