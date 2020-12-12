const express = require('express');
const  fs  = require('fs');
const path = require('path');
const WebSocket = require('ws');

const app = express();

const weighItems = ["Power", "Compassion","Destruction","Victory"];


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var state = {};

// app.get('/api/info', (req, res) => {
//   res.send({ application: 'puzzle-app', version: '1.0' });
// });

app.use(express.static('pages'));
app.use(express.static('css'));
app.use(express.static('media'));
app.use(express.static('data'));
app.use(express.static('app'));



const server = app.listen(3000);  
// Set up a headless websocket server that prints any
// events that come in.
console.log('start ws');
const socketServer = new WebSocket.Server({port: 3030});
console.log('conf ws');

app.get("/better", function(req,res) {
  socketServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(`{"type":"gravedigger","client":"admin","method":"better"}`);
    }
  });
  res.sendStatus(200);
});

app.get("/worse", function(req,res) {
  socketServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(`{"type":"gravedigger","client":"admin","method":"worse"}`);
    }
  });
  res.sendStatus(200);
});

socketServer.on('connection', (socketClient) => {
  console.log('connected');
  console.log('client Set length: ', socketServer.clients.size);

  socketClient.on('close', (socketClient) => {
    console.log('closed');
    console.log('Number of clients: ', socketServer.clients.size);
  });

  

  socketClient.on('message', (message) => {

    console.log("Message! " + message);

    try {
      var data = JSON.parse(message);
    
      if(data.type && data.type === "balance") {
        console.log("Hit the balance");
        console.log(JSON.stringify(data));
        fs.writeFile("data/balance.json", JSON.stringify(data), (err) => {
            if(err) {
              console.log(err);
            } else {
              socketServer.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify(data));
                }
              });
            }
        });
      
      } 


      if(data.type && data.type === "gravedigger") {
        console.log("Hit the gravedigger");
        console.log(JSON.stringify(data));
        fs.writeFile("data/matrix.json", JSON.stringify(data), (err) => {
            if(err) {
              console.log(err);
            } else {
              socketServer.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify(data));
                }
              });
            }
        });
      
      } 


    } catch (err)
    {
      console.log("Error!" + err.message);
      socketServer.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(weighItems));
        }
      });
    }
  });
});

//https://bitbucket.org/blog/deploy-an-express-js-app-to-aws-lambda-using-the-serverless-framework
//https://tsh.io/blog/implementing-websocket-with-aws-lambda-and-api-gateway/
//https://medium.com/@sumantmishra/how-to-deploy-node-js-app-on-aws-with-github-db99758294f1
//https://medium.com/factory-mind/websocket-node-js-express-step-by-step-using-typescript-725114ad5fe4
//https://levelup.gitconnected.com/getting-started-with-node-js-and-websockets-f22dd0452105
//https://shopify.github.io/draggable/docs/
//https://github.com/Shopify/draggable/blob/master/examples/src/content/Sortable/MultipleContainers/index.js
