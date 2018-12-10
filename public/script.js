const socket = io.connect("http://localhost:4000");

let main = document.querySelector('#hitter'),
	bannedObj = document.querySelector('#banned'),
	update = data => {
		main.textContent = data;
	},
	isBanned = false;

socket.on('receive_update', update);
socket.on('receive_end', () => {
	update("END!");
});
socket.on('receive_ban', data => {
	let a = Boolean(data);

	isBanned = a;
	bannedObj.textContent = (a) ? `Banned: ${ data }s` : "";
});

main.addEventListener('click', () => {
	if(isBanned) return;
	socket.emit('click', true);
});