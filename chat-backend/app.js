const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require(`path`);
const http = require('http');
const socketIo = require('socket.io');

// controllers
const errorController = require('./controllers/errorController');

// utils
const AppError = require('./utils/appError');

// routers
const userRouter = require('./routes/userRoutes');
const messageRouter = require('./routes/messageRoutes');
const chatRouter = require('./routes/chatRoutes');

// importing enviroment variables
dotenv.config({ path: './config.env ' });

const app = express();

// settings cross origin request share
app.use(
  cors({
    origin: process.env.ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

// setting all headers aviaable
app.options('*', cors());

app.use('/images', express.static(path.join(__dirname, 'public', 'img')));

// setting morgan for development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(
  express.json({
    limit: '10Kb',
  })
);

// routers paths
app.use('/api/v1/users', userRouter);
app.use('/api/v1/chats', chatRouter);
app.use('/api/v1/messages', messageRouter);

// handling unmatched routes!
app.use('*', (req, res, next) => {
  next(new AppError(`There is no path for ${req.originalUrl}`, 404));
});

// handling errors
app.use(errorController);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
  },
  path: '/socket',
});

module.exports = { server, io };
