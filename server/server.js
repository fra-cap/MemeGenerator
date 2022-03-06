'use strict';



const express = require("express");
const morgan = require("morgan");
const { check, query, validationResult, Result } = require("express-validator");

const dao = require("./dao");
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./userDao'); // module for accessing the users in the DB

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
	function (username, password, done) {
		userDao.getUser(username, password).then((user) => {
			if (!user)
				return done(null, false, { error: 'Incorrect email and/or password.' });

			return done(null, user);
		})
	}
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
	done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
	userDao.getUserById(id)
		.then(user => {
			done(null, user); // this will be available in req.user
		}).catch(err => {
			done(err, null);
		});
});

//init express
const PORT = 3001;
const app = new express();
app.use(morgan("dev"));
app.use(express.json()); // parse the body in JSON format => populate req.body attributes
app.use(express.static('images'));

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated())
		return next();

	return res.status(401).json({ error: 'not authenticated' });
}

// set up the session
app.use(session({
	// by default, Passport uses a MemoryStore to keep track of the sessions
	secret: 'only Mark knows this super secret and he will share it only with Facebook',
	resave: false,
	saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

/*** APIs ***/

//get memes (if not authenticated only public ones)
app.get("/api/memes",
	async (req, res) => {
		let result;
		try {
			if (req.isAuthenticated())
				result = await dao.getAllMemes();
			else
				result = await dao.getPublicMemes();
			if (result.error)
				res.status(404).json(result);
			else
				res.json(result);
		} catch (error) {
			res.status(500).end();
		}
	}
);

app.get("/api/images/:id", [check('id').isInt()], isLoggedIn,
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({ error: errors.array() });
			}
			const result = await dao.getImage(req.params.id);
			if (result.error)
				res.status(404).json(result);
			else
				res.json(result);
		} catch (error) {
			res.status(500).end();
		}
	}
);

// get the table with id -> images name
app.get("/api/images", isLoggedIn,
	async (req, res) => {
		try {
			const result = await dao.getImages();
			if (result.error)
				res.status(404).json(result);
			else
				res.json(result);
		} catch (error) {
			res.status(500).end();
		}
	}
);

// get the table id -> css style positions
app.get("/api/positions",
	async (req, res) => {
		try {
			const result = await dao.getPositions();
			if (result.error)
				res.status(404).json(result);
			else
				res.json(result);
		} catch (error) {
			res.status(500).end();
		}
	}
);

// get meme by id
// check that a non auth user is retrieving a private meme
app.get('/api/memes/:id', [check('id').isInt()], async (req, res) => {
	let result;
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ error: errors.array() });
		}
		if (req.isAuthenticated())
			result = await dao.getMeme(req.params.id);
		else
			result = await dao.getPublicMeme(req.params.id);
		if (result.error)
			res.status(404).json(result);
		else
			res.json(result);

	} catch (err) {
		res.status(500).end();
	}
});


// POST /api/meme/   add a new meme
app.post('/api/memes/', [
	check('img').not().isEmpty(),
	check('img').isString(),
	check('title').not().isEmpty(),
	check('title').isString(),
	check('author').not().isEmpty(),
	check('author').isObject(),
	check('font').not().isEmpty(),
	check('font').isString(),
	check('color').not().isEmpty(),
	check('color').isString(),
	check('visible').not().isEmpty(),
	check('visible').isBoolean(),
	check('field').not().isEmpty(),
	check('field').isArray(),
	// pos should always have a value,
	// at least one text should be not empty
	check('field').custom(f => {
		if (f.some(f => f.pos === undefined))
			return Promise.reject('Position not exist ');
		if (f.some(f => !Number.isInteger(f.pos)))
			return Promise.reject('Position not exist ');
		if (f.some(f => f.pos <= 0))
			return Promise.reject('Position not exist ');
		if (f.every(f => f.text === ""))
			return Promise.reject('At least one textbox should be filled');
		return Promise.resolve();
	})
], isLoggedIn, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ error: errors.array() });
	}

	const meme = req.body;
	if (req.user.id != meme.author.id)
		return res.status(422).json({ error: "invalid user" });

	try {
		await dao.addMeme(meme);
		res.status(200).end();
	} catch (err) {
		res.status(503).json({ error: `${err}.` });
	}
});


// POST /api/meme/   add a new meme
app.post('/api/memes/copy/:id', [
	check('id').isInt(),
	check('img').not().isEmpty(),
	check('img').isString(),
	check('title').not().isEmpty(),
	check('title').isString(),
	check('author').not().isEmpty(),
	check('author').isObject(),
	check('font').not().isEmpty(),
	check('font').isString(),
	check('color').not().isEmpty(),
	check('color').isString(),
	check('visible').not().isEmpty(),
	check('visible').isBoolean(),
	check('field').not().isEmpty(),
	check('field').isArray(),
	// pos should always have a value,
	// at least one text should be not empty
	check('field').custom(f => {
		if (f.some(f => f.pos === undefined))
			return Promise.reject('Position not exist ');
		if (f.some(f => !Number.isInteger(f.pos)))
			return Promise.reject('Position not exist ');
		if (f.some(f => f.pos <= 0))
			return Promise.reject('Position not exist ');
		if (f.every(f => f.text === ""))
			return Promise.reject('At least one textbox should be filled');
		return Promise.resolve();
	})
], isLoggedIn, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ error: errors.array() });
	}

	const memeMod = req.body;
	if (req.user.id !== memeMod.author.id)
		return res.status(422).json({ error: "invalid user " });

	try {
		const memeOr = await dao.getMeme(req.params.id);
		if (memeMod.author.id !== memeOr.author.id) {
			if (!memeOr.visible && memeMod.visible)
				return res.status(422).json({ error: "invalid visibity" });
		}
		await dao.addMeme(memeMod);
		res.status(200).end();
	} catch (err) {
		res.status(503).json({ error: `${err}.` });
	}
});

/* Delete a meme */
// the meme should also belongs to the user
app.delete('/api/memes/:id', isLoggedIn,
	[check('id').isInt()],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ error: errors.array() });
		}
		try {
			const userId = req.user.id
			const meme = await dao.getMeme(req.params.id);
			if (meme.author.id != userId)
				return res.status(422).json({ error: "invalid user" });
			await dao.deleteMeme(req.params.id);
			return res.status(200).end();
		} catch (err) {
			res.status(503).json({ error: `Database error during the deletion of meme ${req.params.id}` });
		}
	});

/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function (req, res, next) {
	passport.authenticate('local', (err, user, info) => {
		if (err)
			return next(err);
		if (!user) {
			// display wrong login messages
			return res.status(401).json(info);
		}
		// success, perform the login
		req.login(user, (err) => {
			if (err)
				return next(err);

			// req.user contains the authenticated user, we send all the user info back
			// this is coming from userDao.getUser()
			return res.json(req.user);
		});
	})(req, res, next);
});


// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
	req.logout();
	res.status(200).end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
	if (req.isAuthenticated()) {
		res.status(200).json(req.user);
	}
	else
		res.status(401).json({ error: 'Unauthenticated user!' });
});


// activate the server
app.listen(PORT, () => {
	console.log(`Server listening at http://localhost:${PORT}`);
});