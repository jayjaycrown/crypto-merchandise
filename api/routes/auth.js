import express from 'express';
import sgMail from '@sendgrid/mail';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
var router = express.Router();
sgMail.setApiKey('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');
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


//route for user sign up
router.post('/signup', (req, res) => {
	const gottenEmail = req.body.email
	const tokenToSave = crypto.randomBytes(20).toString('hex');
	const link = `https://${req.headers.host}/auth/verify_email/${tokenToSave}`
	knex('users').where({
	  email: gottenEmail
	}).select('email')
	.then((result) => {
		if (result.length <= 0) {
			bcrypt.hash(req.body.password, 15, (err, hash) => {
				if (err) {
					res.json('Unable to hash password')
				} else {
					knex('users').insert({
						full_name: req.body.fullName,
						email: req.body.email,
						phone_number: req.body.phoneNumber,
						password: hash,
						verified: 'No',
						status: 'member',
						token: tokenToSave,
						created_dt: Date.now()
					})
					.then(() => {
						res.json('User Registration successful')
						const msg = {
							to: gottenEmail,
							from: 'larryphil131@gmail.com',
							subject: 'Acccount registration verification',
							text: `Hi user, you registered an account with crypto merchantile with email: ${gottenEmail}.Please click on the following link ${link} to verifiy your email before you can be allowed to login.Link expires after one(1) hour. If you did not Register an account with us, please ignore this email`,
						};
						sgMail
							.send(msg)
							.then(() => console.log('Mail sent'))
							.catch((err) => console.log(err.response.body))
					})
					.catch((err) => res.json(err))
				}
			})
		} else {
			res.json('User already exists')
		}
	})
	.catch((err) => console.log(err))
})

//route for user to verify link sent to mail 
router.get('/verify_email/:token', (req, res) => {
	const mailLink = req.params.token
	knex('users').where({
	  token: mailLink
	})
	.then(() => {
		knex('users')
		.where({ token: mailLink })
		.update({ 
			verified: "Yes",
			token: ''
		})
		.then(() => res.json('Link verified, user can now login'))
		.catch(() => res.json('Not Implemented'))
	})
	.catch(() => {
		res.json('Unable to verify link');
	})
})



//route for users to login their account
router.post('/login', (req, res) => {
	knex('users').where({
		email: req.body.email,
		status: 'member'
	})
	.then((result) => {
		if (result <= 0) {
			res.json("User details doesn't exist")
		} else {
			const __userId = result[0].id
			const __status = result[0].status
			const __password = result[0].password
			const user = {
				id: __userId,
				status: __status
			}
			bcrypt.compare(req.body.password, __password, (err, result) => {
				if (result ===  false) {
					res.json('Invalid login credentials')
				} else {
					jwt.sign({user}, 'secretKey', {expiresIn: '1h'}, (err, token) => {
						res.status(200).json({
							token,
							status: __status,
							userId: __userId
						})
					})
				}
			})
		}
	})
	.catch((err) => console.log('error'))
})


//route for admin to login their account
router.post('/login_admin', (req, res) => {
	knex('users').where({
		email: req.body.email,
		status: 'admin'
	})
	.then((result) => {
		if (result <= 0) {
			res.json("User details doesn't exist")
		} else {
			const __userId = result[0].id
			const __status = result[0].status
			const __password = result[0].password
			const user = {
				id: __userId,
				status: __status
			}
			bcrypt.compare(req.body.password, __password, (err, result) => {
				if (result ===  false) {
					res.json('Invalid login credentials')
				} else {
					jwt.sign({user}, 'secretKey', {expiresIn: '1h'}, (err, token) => {
						res.status(200).json({
							token,
							status: __status,
							userId: __userId
						})
					})
				}
			})
		}
	})
	.catch((err) => console.log('error'))
})



router.get('/dashboard', isValidUser, (req, res) => {

})



//middleware function 
function isValidUser(req, res, next) {
	const bearerHeader = req.headers['authorization'];
	if (typeof bearerHeader !== 'undefined') {
		req.token = bearerHeader;
		jwt.verify(req.token, 'secretKey', (err, authData) => {
			if (err) {
				res.status(403).json({message: 'Unauthorized'})
			} else {
				res.status(200).json({
					message: 'Authorized request',
					authData
				})
				next();
			}
		})
		next();
	} else {
		res.status(403).json({
			message: 'Unauthorized request'
		})
	}
}

export default router;