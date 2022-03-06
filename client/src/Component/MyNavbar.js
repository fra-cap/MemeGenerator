import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Spinner } from 'react-bootstrap/';
import { DoorClosed, EmojiSmileUpsideDownFill, DoorOpen } from 'react-bootstrap-icons';
import NavBar from "react-bootstrap/Navbar";
import { useState} from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import API from "./../API";

function MyNavbar(props) {
	return <>{props.loginPage ?
		<MyNavbarLogin setLoginPage={props.setLoginPage} /> :
		<MyNavbarDef  setLoggedIn={props.setLoggedIn} setLoginPage={props.setLoginPage} loggedIn={props.loggedIn} user={props.user} setUser={props.setUser} setDirty={props.setDirty} dirty={props.dirty} loading={props.loading} />}</>;
}


function MyNavbarDef(props) {
	const [loggedOut, setloggedOut] = useState(false);

	const handleLogout = async (event) => {
		event.preventDefault();

		API.logOut().then(() => {
			props.setLoggedIn(false);
			props.setUser({});
			setloggedOut(true);
			props.setDirty(true);
		}
		);
	}


	return (
		<> {loggedOut && <Redirect to="/" />}
			<NavBar fixed="top" variant="dark" bg="primary">

				<NavBar.Brand as={NavLink} to="/" exact onClick={() => props.setDirty(true)}>
					<EmojiSmileUpsideDownFill className="mr-1" size="35" /> Meme Generator
				</NavBar.Brand>


				{(props.loading || props.dirty) &&
					<Spinner className="justify-content-begin" animation="border" variant="light" />}
				


				{props.loggedIn ?
					<Navbar.Collapse className="justify-content-end">
						<NavLink to="/" exact onClick={handleLogout} >
							<DoorClosed className="me-2" color="white" size={32} />
						</NavLink>
						<Navbar.Text >
							Hi, {props.user.name}
							<br />
							Click to <NavLink to="/" exact onClick={handleLogout}>logout</NavLink>
						</Navbar.Text>

					</Navbar.Collapse>
					:
					<Navbar.Collapse className="justify-content-end">
						<NavLink to="/login" exact onClick={() => props.setLoginPage(true)}>
							<DoorOpen color="white" size={32} /></NavLink>
						<Navbar.Text>
							&nbsp;&nbsp;Not authenticated<br />
							&nbsp;&nbsp;Click to <NavLink to="/login" exact onClick={() => props.setLoginPage(true)}>login</NavLink>
						</Navbar.Text>
					</Navbar.Collapse>
				}

			</NavBar>
		</>
	);
}


function MyNavbarLogin(props) {
	return (
		<Navbar variant="dark" bg="primary">
			<Navbar.Brand className="mx-auto" as={NavLink} to="/" exact onClick={() => props.setLoginPage(false)}>
				<EmojiSmileUpsideDownFill className="mr-1" size="30" /> Meme Generator
			</Navbar.Brand>
		</Navbar>);

}


export default MyNavbar;
