import express from 'express';
import jwt from 'jsonwebtoken';
var router = express.Router();
var dotenv = require('dotenv').config();
var knex = require('knex')({
  client: 'mysql',
  version: '5.7',
  connection: {
    host : process.env.HOST,
    user : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DB
  },
  useNullAsDefault: true
});



/*/////////////////////////////////////////////////////////////////////////////////////////////
---------------------------- Manage Members features -----------------------------------------
/////////////////////////////////////////////////////////////////////////////////////////////*/

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

//route for admin to delete a particular user
router.delete('/delete-member/:id', isValidUser, (req, res) => {
	jwt.verify(req.token, 'secretKey', (err, authData) => {
		if (err) {
			res.json('Unauthorized')
		} else if (authData.user.status === 'member') {
			res.json('Unauthorized to view result')
		} else {
			knex('users')
			  .where('id', req.params.id)
			  .del()
			  .then(() => res.json('User deleted successfully'))
			  .catch(() => res.json('Unable to delete user'))
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