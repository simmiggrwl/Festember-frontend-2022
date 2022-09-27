import {
	FormControl,
	FormLabel,
	FormErrorMessage,
	Input,
	Heading,
} from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { userContext } from "../../contexts/UserContext";
import { config } from "../../../config";
// import { DAuthLogin } from "../../components"
import styles from "./styles.module.css";

interface LocationState {
	from?: string;
}

const Login = () => {
	const { isLoggedIn, setuserID, setIsLoggedIn } = useContext(userContext);
	const [formError, setFormError] = useState<string>("");
	const [loginForm, setLoginForm] = useState<LoginFormType>({
		user_email: "",
		user_pass: "",
	});

	const navigate = useNavigate();
	const locationState = useLocation().state as LocationState;

	useEffect(() => {
		if (isLoggedIn) navigate("/");
	}, [isLoggedIn]);

	useEffect(() => {
		if (locationState?.from === "ProtectedRoute")
			toast.error("You must be logged in to continue");
	}, []);

	const handleFormChange = (field: string, value: string) => {
		setLoginForm({ ...loginForm, [field]: value });
	};

	const handleFormSubmit = () => {
		if (
			!loginForm.user_email ||
			!loginForm.user_email.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
		)
			setFormError("user_email");
		else if (!loginForm.user_pass) setFormError("user_pass");
		else {
			setFormError("");
			fetch(`${config.backendOrigin}/auth/web`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(loginForm),
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.status_code === 200) {
						setIsLoggedIn(true);
						setuserID(data.message.user_id);
						navigate("/");
					} else setFormError("login_failure");
				})
				.catch(() => setFormError("login_failure"));
		}
	};

	return (
		<div className={styles.authFormContainer}>
			<div className={styles.authForm}>
				<Heading className={styles.formHeading}>Login</Heading>
				<p className={styles.loginSubHeader}>
					Please use your <b>Festember Credentials</b> to login
				</p>
				<FormControl isRequired isInvalid={formError === "user_email"}>
					<FormLabel>Email</FormLabel>
					<Input
						className={styles.formInput}
						type="email"
						onChange={(e) => {
							handleFormChange("user_email", e.target.value);
						}}
					/>
					<FormErrorMessage>Enter a valid email</FormErrorMessage>
				</FormControl>
				<FormControl isRequired isInvalid={formError === "user_pass"}>
					<FormLabel>Password</FormLabel>
					<Input
						className={styles.formInput}
						type="password"
						onChange={(e) => {
							handleFormChange("user_pass", e.target.value);
						}}
					/>
					<FormErrorMessage>Password is required</FormErrorMessage>
				</FormControl>
				<FormControl isInvalid={formError === "login_failure"}>
					<FormErrorMessage className={styles.errorMessage}>
						Invalid Credentials
					</FormErrorMessage>
				</FormControl>

				<div className={styles.buttonSection}>
					<div className={styles.loginButtons}>
						<button
							className={`${styles.button} ${styles.leftButton}`}
							onClick={handleFormSubmit}
						>
							LOGIN
						</button>
						{/* <DAuthLogin /> */}
						<button
							className={`${styles.button} ${styles.rightButton}`}
							onClick={() => navigate("/register")}
						>
							SIGN UP
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
