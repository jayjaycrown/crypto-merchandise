import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyparser from 'body-parser';

import userAuthRoute from './routes/auth';
import forgotPasswordRoute from './routes/forgotPassword';
import membersRoute from './routes/admin/members';
var dotenv = require('dotenv').config();
var app = express();
var port = process.env.LOCAL_PORT || process.env.PORT

// view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.json());

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

var corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyparser.urlencoded({extended: false}));

app.use('/auth', userAuthRoute,forgotPasswordRoute)
app.use('/api', membersRoute)
app.use(cors(corsOptions));

app.listen(port, process.env.IP, () => {
	console.log(`Crypto-merchantile currently listening to port ${port}`);
})
