import express from 'express';
import cors from 'cors';
import bodyparser from 'body-parser';
import userAuthRoute from './routes/auth';
import membersRoute from './routes/admin/members';
var dotenv = require('dotenv').config();
var app = express();
var port = process.env.LOCAL_PORT || process.env.port


var corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyparser.urlencoded({extended: false}));

app.use('/auth', userAuthRoute)
app.use('/api', membersRoute)
app.use(cors(corsOptions));

app.listen(port, process.env.IP, () => {
	console.log(`Crypto-merchantile currently listening to port ${port}`);
})

