import {
	FormControl,
	FormLabel,
	FormErrorMessage,
	Input,
	Heading,
	Select,
	RadioGroup,
	Radio,
} from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { config } from "../../../config";
import Recaptcha from "../../components/ReCaptcha/ReCaptcha";
import { userContext } from "../../contexts/UserContext";
import styles from "./styles.module.css";

const Register = () => {
	const { isLoggedIn } = useContext(userContext);
	const [formPage, setFormPage] = useState<number>(0);
	const [formError, setFormError] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [registerForm, setRegisterForm] = useState<RegisterFormType>({
		user_name: "",
		user_email: "",
		user_fullname: "",
		user_password: "",
		user_sex: "Male",
		user_nationality: "",
		user_address: "",
		user_pincode: "",
		user_state: "",
		user_phno: "",
		user_degree: "BTech",
		user_year: "1st Year",
		user_college: "",
		user_othercollege: "",
		user_city: "",
    recaptcha_code: "",
    is_app:0
	});
	const [colleges, setColleges] = useState<
		| {
				id: number;
				college_name: string;
		  }[]
		| []
	>([]);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchColleges = async () => {
			const response = await fetch(`${config.backendOrigin}/colleges`);
			if (response.ok) {
				const data = await response.json();
				if (!Array.isArray(data.message)) {
					setFormError("Error fetching colleges");
				} else {
					data.message.push({ id: 0, college_name: "Other" });
					setColleges(data.message);
				}
			} else {
				setFormError("Error fetching colleges");
			}
		};
		if (colleges && colleges.length === 0) fetchColleges();
	}, []);

	useEffect(() => {
		if (isLoggedIn) navigate("/");
	}, [isLoggedIn]);

	const handleFormChange = (field: string, value: string) => {
		if (field === "user_college")
			setRegisterForm({ ...registerForm, user_othercollege: "" });
		else if (field === "user_othercollege")
			setRegisterForm({ ...registerForm, user_college: "Other" });
		setRegisterForm({
			...registerForm,
			[field]: value,
		});
	};

	const validateForm = () => {
		if (formPage === 0) {
			if (!registerForm.user_name) setFormError("user_name");
			else if (
				!registerForm.user_email ||
				!registerForm.user_email.match(
					/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				)
			) {
				setFormError("user_email");
			} else if (!registerForm.user_fullname) setFormError("user_fullname");
			else if (
				!registerForm.user_phno ||
				!/^\+?(0|[1-9]\d*)$/.test(registerForm.user_phno)
			)
				setFormError("user_phno");
			else {
				setFormError("");
				setFormPage(1);
			}
		} else if (formPage === 1) {
			if (
				!registerForm.user_password ||
				registerForm.user_password.length < 7
			)
				setFormError("user_password");
			else if (registerForm.user_password !== confirmPassword)
				setFormError("confirm_password");
			else if (!registerForm.user_college && !registerForm.user_othercollege)
				setFormError("user_college");
			else {
				setFormError("");
				setFormPage(2);
			}
		} else if (formPage === 2) {
			if (!registerForm.user_degree) setFormError("user_degree");
			else if (!registerForm.user_address) setFormError("user_address");
			else if (
				!registerForm.user_pincode ||
				!/^\+?(0|[1-9]\d*)$/.test(registerForm.user_pincode)
			)
				setFormError("user_pincode");
			else {
				setFormError("");
				setFormPage(3);
			}
		} else if (formPage === 3) {
			if (!registerForm.user_state) setFormError("user_state");
			else if (!registerForm.user_nationality)
				setFormError("user_nationality");
			else if (!registerForm.user_city) setFormError("user_city");
			else {
				setFormError("");
				setFormPage(4);
			}
		}
	};

	const handleFormSubmit = () => {
		fetch(`${config.backendOrigin}/user/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(registerForm),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.status_code === 200) navigate("/login");
				else if (
					data.status_code === 400 &&
					data.message === "You have already registered"
				)
					setFormError("already_registered");
				else setFormError("register_failure");
			})
			.catch(() => setFormError("register_failure"));
	};

	return (
		<div className={styles.authFormContainer}>
			<div className={styles.authForm}>
				<Heading className={styles.formHeading}>Sign Up</Heading>

				{formPage === 0 && (
					<>
						<FormControl isRequired isInvalid={formError === "user_name"}>
							<FormLabel>Username</FormLabel>
							<Input
								className={styles.formInput}
								type="text"
								value={registerForm.user_name}
								onChange={(e) =>
									handleFormChange("user_name", e.target.value)
								}
							/>
							<FormErrorMessage>Username is required</FormErrorMessage>
						</FormControl>
						<FormControl
							isRequired
							isInvalid={formError === "user_fullname"}
						>
							<FormLabel>Full Name</FormLabel>
							<Input
								className={styles.formInput}
								type="text"
								value={registerForm.user_fullname}
								onChange={(e) =>
									handleFormChange("user_fullname", e.target.value)
								}
							/>
							<FormErrorMessage>Full Name is required</FormErrorMessage>
						</FormControl>
						<FormControl isRequired isInvalid={formError === "user_phno"}>
							<FormLabel>Phone Number</FormLabel>
							<Input
								className={styles.formInput}
								type="text"
								value={registerForm.user_phno}
								onChange={(e) =>
									handleFormChange("user_phno", e.target.value)
								}
							/>
							<FormErrorMessage>
								Phone Number is required and should be a number
							</FormErrorMessage>
						</FormControl>
						<FormControl
							isRequired
							isInvalid={formError === "user_email"}
						>
							<FormLabel>Email</FormLabel>
							<Input
								className={styles.formInput}
								type="email"
								value={registerForm.user_email}
								onChange={(e) =>
									handleFormChange("user_email", e.target.value)
								}
							/>
							<FormErrorMessage>
								Valid email is required
							</FormErrorMessage>
						</FormControl>
					</>
				)}

				{formPage === 1 && (
					<>
						<FormControl
							isRequired
							isInvalid={formError === "user_password"}
						>
							<FormLabel>Password</FormLabel>
							<Input
								className={styles.formInput}
								type="password"
								value={registerForm.user_password}
								onChange={(e) =>
									handleFormChange("user_password", e.target.value)
								}
							/>
							<FormErrorMessage>
								Password is required and atleast 7 letters
							</FormErrorMessage>
						</FormControl>
						<FormControl
							isRequired
							isInvalid={formError === "confirm_password"}
						>
							<FormLabel>Confirm Password</FormLabel>
							<Input
								className={styles.formInput}
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
							<FormErrorMessage>Passwords don't match</FormErrorMessage>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Gender</FormLabel>
							<Select
								className={styles.formInput}
								color="black"
								value={registerForm.user_sex}
								onChange={(e) =>
									handleFormChange("user_sex", e.target.value)
								}
							>
								<option>Male</option>
								<option>Female</option>
								<option>Others</option>
							</Select>
						</FormControl>
						<FormControl
							isRequired
							isInvalid={formError === "user_college"}
						>
							<FormLabel>College</FormLabel>
							<Select
								className={styles.formInput}
								color="black"
								value={registerForm.user_college}
								defaultValue="Select College"
								onChange={(e) =>
									handleFormChange("user_college", e.target.value)
								}
							>
								{colleges.map((college) => (
									<option key={college.id}>
										{college.college_name}
									</option>
								))}
							</Select>
							<FormErrorMessage>College is required</FormErrorMessage>
						</FormControl>
						{registerForm.user_college === "Other" && (
							<FormControl isRequired>
								<FormLabel>College</FormLabel>
								<Input
									className={styles.formInput}
									type="text"
									value={registerForm.user_othercollege}
									onChange={(e) =>
										handleFormChange(
											"user_othercollege",
											e.target.value
										)
									}
								/>
							</FormControl>
						)}
					</>
				)}

				{formPage === 2 && (
					<>
						<FormControl
							isRequired
							isInvalid={formError === "user_degree"}
						>
							<FormLabel>Degree</FormLabel>
							<Select
								className={styles.formInput}
								color="black"
								value={registerForm.user_degree}
								onChange={(e) =>
									handleFormChange("user_degree", e.target.value)
								}
							>
								<option>BTech</option>
								<option>MTech</option>
								<option>BArch</option>
								<option>BA</option>
								<option>BBA</option>
								<option>MBA</option>
								<option>MBBS</option>
								<option>PhD</option>
								<option>BSc</option>
								<option>MSc</option>
								<option>MCA</option>
								<option>Others</option>
							</Select>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Year</FormLabel>
							<Select
								className={styles.formInput}
								color="black"
								value={registerForm.user_year}
								onChange={(e) =>
									handleFormChange("user_year", e.target.value)
								}
							>
								<option>1st Year</option>
								<option>2nd Year</option>
								<option>3rd Year</option>
								<option>4th Year</option>
								<option>5th Year</option>
								<option>Others</option>
							</Select>
						</FormControl>
						<FormControl
							isRequired
							isInvalid={formError === "user_address"}
						>
							<FormLabel>Address</FormLabel>
							<Input
								className={styles.formInput}
								type="text"
								value={registerForm.user_address}
								onChange={(e) =>
									handleFormChange("user_address", e.target.value)
								}
							/>
							<FormErrorMessage>Address is required</FormErrorMessage>
						</FormControl>
						<FormControl
							isRequired
							isInvalid={formError === "user_pincode"}
						>
							<FormLabel>Pincode</FormLabel>
							<Input
								className={styles.formInput}
								type="text"
								value={registerForm.user_pincode}
								onChange={(e) =>
									handleFormChange("user_pincode", e.target.value)
								}
							/>
							<FormErrorMessage>
								Pincode is required and should be a number
							</FormErrorMessage>
						</FormControl>
					</>
				)}

				{formPage === 3 && (
					<>
						<FormControl
							isRequired
							isInvalid={formError === "user_nationality"}
						>
							<FormLabel>Country</FormLabel>
							<Input
								className={styles.formInput}
								type="text"
								value={registerForm.user_nationality}
								onChange={(e) =>
									handleFormChange("user_nationality", e.target.value)
								}
							/>
							<FormErrorMessage>Country is required</FormErrorMessage>
						</FormControl>
						<FormControl
							isRequired
							isInvalid={formError === "user_state"}
						>
							<FormLabel>State</FormLabel>
							<Input
								className={styles.formInput}
								type="text"
								value={registerForm.user_state}
								onChange={(e) =>
									handleFormChange("user_state", e.target.value)
								}
							/>
							<FormErrorMessage>State is required</FormErrorMessage>
						</FormControl>
						<FormControl isRequired isInvalid={formError === "user_city"}>
							<FormLabel>City</FormLabel>
							<Input
								className={styles.formInput}
								type="text"
								value={registerForm.user_city}
								onChange={(e) =>
									handleFormChange("user_city", e.target.value)
								}
							/>
							<FormErrorMessage>City is required</FormErrorMessage>
						</FormControl>
						<FormControl>
							<FormLabel>
								Would you like to receive promotions from our sponsors?
							</FormLabel>
							<RadioGroup
								className={styles.radioGroup}
								defaultValue="no"
								onChange={(e) => handleFormChange("user_sponsor", e)}
							>
								<Radio value="yes">Yes</Radio>
								<Radio value="no">No</Radio>
							</RadioGroup>
						</FormControl>
					</>
				)}

				{formPage === 4 && (
					<>
						<FormControl>
							<FormLabel>Referral Code</FormLabel>
							<Input
								className={styles.formInput}
								type="text"
								value={
									registerForm.user_referral_code
										? registerForm.user_referral_code
										: ""
								}
								onChange={(e) =>
									handleFormChange(
										"user_referral_code",
										e.target.value
									)
								}
							/>
						</FormControl>
						<FormControl>
							<FormLabel>Name to be printed on Voucher</FormLabel>
							<Input
								className={styles.formInput}
								type="text"
								value={
									registerForm.user_voucher_name
										? registerForm.user_voucher_name
										: ""
								}
								onChange={(e) =>
									handleFormChange("user_voucher_name", e.target.value)
								}
							/>
						</FormControl>
						<Recaptcha handleFormChange={handleFormChange} />
						<FormControl isInvalid={formError === "register_failure"}>
							<FormErrorMessage className={styles.errorMessage}>
								Error Occurred while registering, check your details and
								try again
							</FormErrorMessage>
						</FormControl>
						<FormControl isInvalid={formError === "already_registered"}>
							<FormErrorMessage className={styles.errorMessage}>
								User already registered
							</FormErrorMessage>
						</FormControl>
					</>
				)}

				<div className={styles.buttonSection}>
					{formPage === 0 && <p>Already been here?</p>}
					<div className={styles.registerButtons}>
						{formPage === 0 && (
							<button
								className={`${styles.button} ${styles.leftButton}`}
								onClick={() => navigate("/login")}
							>
								LOGIN
							</button>
						)}
						{formPage !== 0 && (
							<button
								className={`${styles.button} ${styles.leftButton}`}
								onClick={() => setFormPage(formPage - 1)}
							>
								&#10094; PREV
							</button>
						)}
						{formPage !== 4 && (
							<button
								className={`${styles.button} ${styles.rightButton}`}
								onClick={validateForm}
							>
								NEXT &#10095;
							</button>
						)}
						{formPage === 4 && (
							<button
								className={`${styles.button} ${styles.rightButton}`}
								onClick={handleFormSubmit}
							>
								SIGN UP
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;
