const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const { Sequelize } = require('sequelize');
const Customer = require('./customer');
const botMessage = require('./botmessage');




const PORT = process.env.PORT || 3000;

const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));


const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

const sessionStore = new SequelizeStore({
  db: sequelize,
});

const sessionMiddleware = session({
  secret: 'a new secret',
  store: new SequelizeStore({
    db: sequelize,
  }),
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
});

app.use(sessionMiddleware);
sessionStore.sync();
io.engine.use(sessionMiddleware);
const botMessage = new botMessage(io);


io.on('connection', (socket) => {
  const reqSession = socket.request.session;
  const sessionId = reqSession.id;
  socket.join(sessionId);

  if (reqSession.user) {
    // If the user is already in the session, send a welcome back message
    const customer = Customer.getUser(reqSession.user);
    botMessage.sendMessage(customer, `Welcome back ${customer.username}!`);
    botMessage.sendMessage(customer, botMessage.initialMessage);
  } else {
    // If the user is not in the session, prompt for a username
    socket.emit('error');
  }

  socket.on('username', (username) => {
    // console.log('User input on the server: ' + username);

    if (!reqSession.customers) {
      reqSession.customers = {};
    }

    const customerId = Customer.generateKey(username, sessionId);
    let customer;

    if (!reqSession.customers[customerId]) {
      customer = new Customer(username, sessionId);
      reqSession.customers[customerId] = customer;
      botMessage.sendMessage(customer, `Welcome to African Pot, ${username}!`);
    } else {
      customer = Customer.getUser(reqSession.customer);
      botMessage.sendMessage(
        reqSession.customers[customerId],
        `Welcome back ${username} to our Resturant!`
      );
    }
    reqSession.customer = customer;
    botMessage.sendMessage(user, botMessage.initialMessage);
  });

  reqSession.save();

  socket.on('customerInput', (input) => {   
    if (reqSession.customer) {
      botMessage.handleUserInput(reqSession, input);
    } else {
      socket.emit('error', 'Session not found');
    }

    reqSession.save();
  });
});

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
 console.log("a user connected");
  console.log(socket.id);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });
});

server.listen(3000, () => {
  console.log(`Server running on port ${PORT}`);
});
