import express from 'express';
import jwt from 'jsonwebtoken';
var router = express.Router();
var knex = require('knex')({
  client: 'mysql',
  version: '5.7',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : '',
    database : 'crypto_merchantile'
  },
  useNullAsDefault: true
});

//route for admin to view all members
router.get('/members', isValidUser, (req, res) => {
	jwt.verify(req.token, 'secretKey', (err, authData) => {
		if (err) {
			res.json('Unauthorized')
		} else if (authData.user.status === 'member') {
			res.json('Unauthorized to view result')
		} else {
			knex('users').where({
			  status: 'member',
			}).select()
			.then((result) => res.json(result))
			.catch((err) => res.json(err))
		}
	})
})


function isValidUser(req, res, next) {
	const bearerHeader = req.headers['authorization'];
	if (typeof bearerHeader !== 'undefined') {
		req.token = bearerHeader;
		next();
	} else {
		res.status(403).json({
			message: 'Unauthorized request'
		})
	}
}


export default router;