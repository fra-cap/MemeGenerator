" use strict ";

const db = require('./db');

// get all memes
exports.getAllMemes = () => {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM memes';
		db.all(sql, (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			if (rows !== undefined) {
				const memes = rows.map((m) => ({ id: m.id, img: m.img, title: m.title, author: JSON.parse(m.author), font: m.font, color: m.color, visible: m.visible, field: JSON.parse(m.field) }));
				resolve(memes);
			}
			else {
				resolve(null)
			}

		});
	});
};

exports.getPositions = () => {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM positions';
		db.all(sql, (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			if (rows !== undefined) {
				const positions = rows.map((p) => ({ id: p.id, style: JSON.parse(p.style) }));
				resolve(positions);
			}
			else {
				resolve(null)
			}

		});
	});
};

exports.getImages = () => {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM images';
		db.all(sql, (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			if (rows !== undefined) {
				const images = rows.map((m) => ({ id: m.id, img: m.img, title: m.title, fieldNumber: m.fieldNumber, field: JSON.parse(m.field) }));
				resolve(images);
			}
			else {
				resolve(null)
			}

		});
	});

};

exports.getImage = (id) => {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM images WHERE id=?';
		db.get(sql, [id], function (err, rows) {
			if (err) {
				reject(err);
				return;
			}
			if (rows !== undefined) {
				const image = { id: rows.id, img: rows.img, title: rows.title, fieldNumber: rows.fieldNumber, field: JSON.parse(rows.field) };
				resolve(image);
			}
			else {
				resolve(null)
			}

		});
	});

};

// get public memes
exports.getPublicMemes = () => {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM memes WHERE visible=1';
		db.all(sql, (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			if (rows !== undefined) {
				const memes = rows.map((m) => ({ id: m.id, img: m.img, title: m.title, author: JSON.parse(m.author), font: m.font, color: m.color, visible: m.visible, field: JSON.parse(m.field) }));
				resolve(memes);
			}
			else {
				resolve(null)
			}

		});
	});
};

// get meme by id for auth users
exports.getMeme = (id) => {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM memes WHERE id=?';
		db.get(sql, [id], function (err, rows) {
			if (err) {
				reject(err);
				return;
			}
			if (rows !== undefined) {
				const meme = { id: rows.id, img: rows.img, title: rows.title, author: JSON.parse(rows.author), font: rows.font, color: rows.color, visible: rows.visible, field: JSON.parse(rows.field) };
				resolve(meme);
			}
			else {
				resolve({ error: 'Meme not found' })
			}
		});
	});
};


// get meme by id for non-auth users
exports.getPublicMeme = (id) => {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM memes WHERE id=? and visible = 1';
		db.get(sql, [id], function (err, rows) {
			if (err) {
				reject(err);
				return;
			}
			if (rows !== undefined) {
				const meme = { id: rows.id, img: rows.img, title: rows.title, author: JSON.parse(rows.author), font: rows.font, color: rows.color, visible: rows.visible, field: JSON.parse(rows.field) };
				resolve(meme);
			}
			else {
				resolve({ error: 'Meme not found or you must authenticate to retrieve this meme.' })
			}
		});
	});
};

// delete an existing meme
exports.deleteMeme = (memeId) => {
	return new Promise((resolve, reject) => {
		const sql = 'DELETE FROM memes WHERE id = ?';
		db.run(sql, [memeId], function (err) {
			if (err) {
				reject(err);
				return;
			} else
				resolve(null);
		});
	});
}

// insert a new meme
exports.addMeme = (meme) => {
	return new Promise((resolve, reject) => {
		const sql = 'INSERT INTO memes(img, title, author, font, color, visible, field) VALUES (?, ?, ?, ?, ?, ?, ?)';
		db.run(sql, [meme.img, meme.title, JSON.stringify(meme.author), meme.font, meme.color, meme.visible, JSON.stringify(meme.field)], function (err) {
			if (err) {
				reject(err);
				return;
			}
			resolve(this.lastID);
		});
	});
};