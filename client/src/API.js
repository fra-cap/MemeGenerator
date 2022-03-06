
const URL = "http://localhost:3000"

async function getMeme(mId) {
	const response = await fetch(URL + "/api/memes/" + mId);
	const fetchedMeme = await response.json();
	if (response.ok) 
		return fetchedMeme;
	 else 
		throw fetchedMeme;
}

async function getPositions() {
	const response = await fetch(URL + "/api/positions");
	const fetchedPositions = await response.json();
	if (response.ok) 
		return fetchedPositions;
	else 
		throw fetchedPositions;
}

async function loadMemes() {
	const response = await fetch(URL + "/api/memes");
	const fetchedMemes = await response.json();
	if (response.ok)
		return fetchedMemes;
	else
		throw fetchedMemes;
}

async function getImage(imId) {
	const response = await fetch(URL + "/api/images/" + imId);
	const fetchedImage = await response.json();
	if (response.ok) 
		return fetchedImage;
	else
		throw fetchedImage;
}

async function loadImages() {
	const response = await fetch(URL + "/api/images");
	const fetchedImages = await response.json();
	if (response.ok) 
		return fetchedImages;
	else
		throw fetchedImages;
}

async function addMeme(meme) {
	const response = await fetch(URL + "/api/memes/",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(meme),
		});
	if (response.ok) {
		return null;
	} else{
		const error = await response.json();
		throw error;
	}
}

async function deleteMeme(mId) {
	const response = await fetch(URL + "/api/memes/" + mId,
		{
			method: "DELETE"
		});
	if (response.ok) {
		return null;
	} else{
		const error = await response.json();
		throw error;
	}
}

async function copyMeme(modMeme, originalId) {
	const response = await fetch(URL + "/api/memes/copy/" + originalId,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(modMeme),
		});
	if (response.ok) {
		return null;
	} else{
		const error = await response.json();
		throw error;
	}
}

async function logIn(user) {
	const response = await fetch(URL + "/api/sessions/",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(user),
		});
	const userInfo = await response.json()
	if (response.ok)
		return userInfo
	else
		throw userInfo;
}

async function logOut() {
	await fetch(URL + "/api/sessions/current/", { method: 'DELETE' });
}

async function getUserInfo() {
	const response = await fetch(URL + '/api/sessions/current');
	const userInfo = await response.json();
	if (response.ok) {
		return userInfo
	} else {
		throw userInfo;  // an object with the error coming from the server, mostly unauthenticated user
	}
}

const API = { getMeme, getPositions, loadMemes, loadImages, addMeme, deleteMeme, copyMeme, logIn, logOut, getUserInfo, getImage }
export default API;