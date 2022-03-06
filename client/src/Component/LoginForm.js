import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import API from "./../API";
import './../App.css'

function MyLoginForm(props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loginDone, setLoginDone] = useState(false);
	const [errorMessageUsername, setErrorMessageUsername] = useState("");
	const [errorMessagePassword, setErrorMessagePassword] = useState("");


	function handleSubmit(ev) {
		ev.preventDefault();

		let valid = true;
		if (email === "") {
			setErrorMessageUsername("Should have some characters");
			valid = false;
		} else {
			setErrorMessageUsername("");
		}
		if (password === "") {
			setErrorMessagePassword("Should have some characters");
			valid = false;
		} else {
			setErrorMessagePassword("");
		}

		if (valid) {
			resetForm();

			API.logIn({ username: email, password: password }).then((response) => {
				props.setUser(() => response);
				props.setLoggedIn(true);
				props.setDirty(true);
				props.setLoginPage(false);
				props.setFirstLogin(true);
				setLoginDone(true);
			}
			).catch(e => props.handleErrors(e));

		}
	}

	function resetForm() {
		setErrorMessageUsername(() => "");
		setErrorMessagePassword(() => "");
	}

	return (
		<>{loginDone && <Redirect to="/" strict />}

			<div id="loginContainerDiv">
				<Form className="p-3">
					<Form.Group controlId="formEmail" className="mt-1">
						<Form.Label>Email address</Form.Label>
						<Form.Control
							type="email"
							placeholder="name@example.com"
							required
							isInvalid={errorMessageUsername}
							onChange={(ev) => { setEmail(ev.target.value) }}
							value={email}
						/>
						<Form.Control.Feedback type="invalid">
							{errorMessageUsername}
						</Form.Control.Feedback>
						<Form.Text className="text-muted"></Form.Text>
					</Form.Group>

					<Form.Group controlId="formPassword" className={errorMessageUsername ? "pt-1" : "pt-3"}>
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							placeholder="Password"
							required
							isInvalid={errorMessagePassword}
							onChange={(ev) => { setPassword(ev.target.value) }}
							value={password}
						/>
						<Form.Control.Feedback type="invalid">
							{errorMessagePassword}
						</Form.Control.Feedback>
					</Form.Group>
					<Button
						variant="primary"
						type="submit"
						className={errorMessagePassword ? "mt-1" : "mt-3"}
						onClick={(ev) => handleSubmit(ev)}
					>
						Login
					</Button>
				</Form>
			</div>
		</>
	);
}

export default MyLoginForm;
