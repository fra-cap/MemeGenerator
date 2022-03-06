import { React, useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Row, Container, Alert} from 'react-bootstrap';
import Editor from './Component/Editor';
import MyNavbar from './Component/MyNavbar';
import MemeShow from './Component/MemeShow';
import ImagesGallery from './Component/ImagesGallery';
import MemesGallery from './Component/MemesGallery';
import LoginForm from './Component/LoginForm';
import API from './API';


function App() {
	// Need to place <Router> above the components that use router hooks
	return (
		<Router>
			<MyIndex></MyIndex>
		</Router>
	);
}

function MyIndex() {
	const [loggedIn, setLoggedIn] = useState(false);
	const [user, setUser] = useState('');
	const [memes, setMemes] = useState([]);
	/* 
	 * 	in the home page positions not needed because memes not rendered 
	 * 	loginPage is used to differentiate the navbar ( login or general) 
	 */
	const [loginPage, setLoginPage] = useState(false);
	const [dirty, setDirty] = useState(true);
	/* 
	 *  loading is used in children components to show the spinner for loading
	 *	it is different from dirty because it does not update the root component
	 */
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState({ msg: "", type: "" });
	const [firstLogin, setFirstLogin] = useState(false);

	const deleteMeme = async (mId) => {
		setMemes((oldMemes) => oldMemes.filter(m => m.id !== mId));
		API.deleteMeme(mId).then(() => setDirty(true)).catch(e => { handleErrors(e); /*console.log(e) */ });
	}

	const handleErrors = (err) => {
		setMessage({ msg: err.error, type: 'danger' });
		//console.log(err.error);
	}

	// check if user is authenticated and load the needed data from the server
	useEffect(() => {
		const checkAuth = async () => {
			try {
				// here you have the user info, if already logged in
				const user = await API.getUserInfo();
				setUser(user);
				setLoggedIn(true);
			} catch (err) {
				//console.log(err.error);	// mostly unauthenticated user
			}
		}
		checkAuth();
	}, []);

	useEffect(() => {
		const loadMemes = async () => {
			if (dirty) {
				try {
					const memes = await API.loadMemes();
					setMemes(memes);
					
				} catch (err) {
					if(err.error === undefined)
						err.error = "Error loading data from server"
					handleErrors(err);
					//console.log(err.error);
				}
			}
		}
		loadMemes().then( () => {setDirty(false);setLoading(false);});
	}, [dirty, loggedIn]);

	useEffect(() => {
		if (firstLogin) {
			setMessage({ msg: "Welcome, " + user.name, type: "success" });
			setFirstLogin(false);
		}
	}, [firstLogin, user.name]);

	useEffect(() => {
		if (message.msg !== "" ) {
			setTimeout(() => setMessage({ msg: "", type: "" }), 3000);
			setDirty(true);
		}
	}, [message]);


	return <Container fluid>
		<Row>
			<MyNavbar
				loginPage={loginPage}
				setLoginPage={setLoginPage}
				setLoggedIn={setLoggedIn}
				loggedIn={loggedIn}
				user={user}
				setUser={setUser}
				setDirty={setDirty}
				dirty={dirty}
				loading={loading}
			/>
		</Row>
		
		<Container className="below-nav">
		
			<Alert show={message.msg !== ''} onClose={() => setMessage({ msg: "", type: "" })} variant={message.type}>
				<Alert.Heading className="text-center" >{message.msg}</Alert.Heading>
			</Alert>
		
		
		<Switch>
			<Route path="/login" >
				<LoginForm
					setFirstLogin={setFirstLogin}
					setUser={setUser}
					setLoggedIn={setLoggedIn}
					setLoginPage={setLoginPage}
					setDirty={setDirty}
					handleErrors={handleErrors} />
			</Route>
			{/* match.params.id return a string*/}
			<Route path="/show/:id" render={({ match }) =>
				<MemeShow
					setDirty={setDirty}
					setLoading={setLoading}
					memeId={match.params.id}
					handleErrors={handleErrors} />
			}
			>
			</Route>
			{/* if user not authenticated , reserved routes not available */}
			{loggedIn && <Route path="/copy/:id" render={({ match }) =>
				<Editor
					imageId= {undefined}
					memeId={match.params.id}
					setMemes={setMemes}
					user={user}
					setDirty={setDirty}
					setLoading={setLoading}
					handleErrors={handleErrors}/>}
			></Route>}
			{loggedIn &&<Route path="/images">
				<ImagesGallery
					setLoading={setLoading}
					handleErrors={handleErrors} />
			</Route>}
			{loggedIn && <Route path="/edit/:id" render={({ match }) =>
				<Editor
					imageId={match.params.id}
					memeId={undefined}
					setMemes={setMemes}
					user={user}
					setDirty={setDirty}
					setLoading={setLoading}
					handleErrors={handleErrors}/>}
			>
			</Route>}
			<Route path="/" exact>
				
				<MemesGallery
					memes={memes}
					deleteMeme={deleteMeme}
					loggedIn={loggedIn}
					user={user} />
				
			</Route>
			<Route>
				<Redirect to="/" />
			</Route>
		</Switch>

		
		</Container >
	</Container >
}



export default App;
