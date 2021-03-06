const express = require('express');
const compression = require('compression');
const path = require('path');
const http = require('http');
const enrichWithSocket = require('socket.io'); 

const port = process.env.PORT || 3030;
const app = express();

const serverRootPath = path.join(__dirname + '/../dist');

app.use(compression());
app.use(express.static(serverRootPath, {
  // maxAge: 31557600000
}));
app.get('*', (_, response) => {
  response.sendFile(path.resolve(serverRootPath, 'index.html'));
});

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server started on port ${port}. Visit http://localhost:${port}/`);
  console.log('Press CTRL + C to stop the server');
});

const io = enrichWithSocket(server);

io.on('connection', (socket) => {
  setTimeout(() => {
    socket.emit('message', { type: 'GreetingsMessage', text: 'Hello world!' });
  }, 5000);

  socket.on('message', (data) => {
    console.log(data);
  });
});
