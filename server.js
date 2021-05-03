var express = require('express');
require('dotenv').config();
var multer = require('multer');
var fs = require('fs');
const nodemailer = require('nodemailer');
var path = require('path');
var mongoose = require('mongoose');
const ejs = require('ejs');
const info = require('./model/model');
var app = express();
const port = process.env.PORT || 3000;
//setting view engine
app.set('view engine', 'ejs');
app.use('/', require('./router'));

//static files
app.use('/cssfiles', express.static(__dirname + '/cssfiles'));
app.use('/mailer', express.static(__dirname + '/mailer'));
app.use('/upload', express.static(__dirname + '/upload'));

//storing file on server
var storage = multer.diskStorage({
	destination: './upload',
	filename: function (req, file, cb) {
		cb(
			null,
			file.fieldname + '-' + Date.now() + path.extname(file.originalname)
		);
	},
});
var upload = multer({ storage: storage });

//mongodb conection
mongoose
	.connect(
		'mongodb+srv://aman28:Aman28@cluster0.ohyhb.mongodb.net/libraryData?retryWrites=true&w=majority',
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => {
		console.log('database connected...');
	})
	.catch((err) => {
		console.log(err);
	});
//mongodb conection end

//fetching all data
app.get('/fetchdata', (req, res) => {
	info.find((err, result) => {
		if (err) console.log(err);
		else {
			res.json(result);
		}
	});
});
// adding a book
app.post('/add', upload.single('bookphoto'), (req, res) => {
	var obj = {
		bookname: req.body.bookname,
		desc: req.body.desc,
		email: req.body.email,
		amount: req.body.amount,
		name: req.body.name,
		filename: req.file.filename,
	};

	const data = new info(obj);
	data.save((err, data) => {
		if (err) console.log(err);
		else res.json(data);
	});
});
//deleting a book
app.delete('/deletebook/:id', (req, res) => {
	info.findByIdAndDelete(req.params.id, (err, result) => {
		if (err) console.log(err);
		else {
			console.log(result);
			fs.unlink(__dirname + '/upload/' + result.filename, function (err) {
				if (err) console.log(err);
				else console.log('Book deleted successfully');
			});
		}
	});
});
//seprate pages
app.get('/seprate/:id', (req, res) => {
	info.findById(req.params.id, (err, data) => {
		if (err) console.log(err);
		else {
			res.render('seprate', { data: data });
		}
	});
});
//email the owner

app.post('/email/:id', upload.none(), (req, res) => {
	info.findById(req.params.id, (err, data) => {
		if (err) console.log(err);
		else {
			let mailTransporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'thakurtest28@gmail.com',
					pass: 'Thakurtest28@',
				},
			});

			let mailDetails = {
				from: 'thakurtest28@gmail.com',
				to: `${data.email}`,
				subject: `Someone wants to borrow a book !!`,
				html: `<h3> Hi ${data.name} </h3>${
					req.body.name
				} wants to borrow a book named : <b>${data.bookname.toUpperCase()}</b> from you. <br/>Borrower gmail address is 
                ${
									req.body.email
								} <br/> Kindly send him a mail regarding this book. `,
			};

			mailTransporter.sendMail(mailDetails, function (err, data) {
				if (err) {
					console.log(err);
				} else {
					console.log('Email sent successfully');
					res.json('successful');
				}
			});
		}
	});
});

app.listen(port, () => {
	console.log('connected to server...' + port);
});
