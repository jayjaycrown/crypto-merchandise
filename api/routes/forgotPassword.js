import express from 'express';
import sgMail from '@sendgrid/mail';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
var router = express.Router();
var dotenv = require('dotenv').config();
sgMail.setApiKey(process.env.API_Key);
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
----------------------------  Forgot password functionality -----------------------------------
/////////////////////////////////////////////////////////////////////////////////////////////*/

//route for sending forgot password link
router.post('/forgot-password', (req, res) => {
	const gottenEmail = req.body.email
	const tokenToSave = crypto.randomBytes(20).toString('hex');
	const link = `https://${req.headers.host}/auth/password_reset/${tokenToSave}`
	knex('users').where({
	  email: gottenEmail
	}).select('full_name')
	.then((result) => {
		if (result.length <= 0) {
			res.json('No user associated with this mail')
		} else {
			var name = result[0].full_name
			const msg = {
				to: gottenEmail,
				from: 'larryphil131@gmail.com',
				subject: 'Password Reset Link',
				text: `Hi ${name}, you requested for a password reset, Click on the following link ${link} to Reset your password.If you did not request for a password reset, please ignore this email`,
			};
			sgMail
				.send(msg)
				.then(() => res.json('Password reset Link successfully sent'))
				.catch((err) => res.json('Unable to send reset link'))
		}
	})
	.catch((err) => console.log(err))
})

//route for getting token
router.get('/password_reset/:token', (req, res) => {
	const mailLink = req.params.token
	knex('users').where({
	  token: mailLink
	})
	.then(() => {
		res.json('redirecting user to change password')
	})
	.catch(() => {
		res.json('Unable to verify link');
	})
})

//route to change password
router.post('/password_reset/:token', (req, res) => {
	const mailLink = req.params.token
	knex('users').where({
	  token: mailLink
	})
	.then(() => {
		bcrypt.hash(req.body.password, 15, (err, hash) => {
			if (err) {
				res.json('unable to hash password')
			} else {
				knex('users')
				.where({ token: mailLink })
				.update({
					password: hash,
					token: ''
				})
				.then(() => res.json('password successfully changed'))
				.catch(() => res.json('Unable to reset password'))
			}
		})
	})
	.catch(() => {
		res.json('Unable to verify link');
	})
})

export default router;