const express = require('express');
const path = require('path');
const WebSocket = require('ws');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var state = {};

// app.get('/api/info', (req, res) => {
//   res.send({ application: 'puzzle-app', version: '1.0' });
// });

app.use(express.static('pages'));
app.use(express.static('css'));
app.use(express.static('media'));

const server = app.listen(3000);  
// Set up a headless websocket server that prints any
// events that come in.
console.log('start ws');
const socketServer = new WebSocket.Server({port: 3030});
console.log('conf ws');
socketServer.on('connection', (socketClient) => {
  console.log('connected');
  console.log('client Set length: ', socketServer.clients.size);
  socketClient.on('close', (socketClient) => {
    console.log('closed');
    console.log('Number of clients: ', socketServer.clients.size);
  });
  socketClient.on('message', (message) => {
    console.log(message);
    
    socketServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify([message + ": received"]));
      }
    });
  });
});

//https://bitbucket.org/blog/deploy-an-express-js-app-to-aws-lambda-using-the-serverless-framework
//https://tsh.io/blog/implementing-websocket-with-aws-lambda-and-api-gateway/
//https://medium.com/@sumantmishra/how-to-deploy-node-js-app-on-aws-with-github-db99758294f1
//https://medium.com/factory-mind/websocket-node-js-express-step-by-step-using-typescript-725114ad5fe4
//https://levelup.gitconnected.com/getting-started-with-node-js-and-websockets-f22dd0452105