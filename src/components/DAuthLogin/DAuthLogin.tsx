import { useCallback, useContext, useState } from "react";
import { config } from "../../../config";
import { isMobile } from "react-device-detect";
import { userContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

enum AuthStatusEnum {
    PRE,
    START,
    WAITING,
    ACCEPTED,
    REJECTED,
    AUTH,
    ERROR
}

const DAuthLogin = () => {
	const [authStatus, setAuthStatus] = useState(AuthStatusEnum.PRE);
	const { setuserID, setIsLoggedIn } = useContext(userContext);

	const navigate = useNavigate();

	const generateDauthAuthorizeUrl = () => {
		const dauthAuthorizeURL = new URL(
			"https://auth.delta.nitt.edu/authorize"
		);

		const dauthQueryParameters = {
			client_id: config.dauth.clientId,
			redirect_uri: config.dauth.redirectURI,
			response_type: "code",
			state: "code",
			grant_type: "authorization_code",
			scope: "email+openid+profile+user",
			nonce: "",
		};

		// eslint-disable-next-line @typescript-eslint/ban-types
		const appendQueryParametersToURL = (url: URL, queryParams: Object) => {
			Object.keys(queryParams).forEach((query) => {
				// @ts-ignore
				url.searchParams.append(query, queryParams[query]);
			});
		};

		appendQueryParametersToURL(dauthAuthorizeURL, dauthQueryParameters);

		return dauthAuthorizeURL;
	};

	const sendAuthCodeToServer = useCallback(async (code: string) => {
		try {
			setAuthStatus(AuthStatusEnum.WAITING);
            //backend url
			fetch(config.backendOrigin + "/auth/dauth/web", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					code: code,
				}),
			})
				.then(async (res) => {
					if (res.status != 200) {
						setAuthStatus(AuthStatusEnum.ERROR);
					} else {
						return await res.json();
					}
				})
				.then((data) => {
					if (data.status_code === 200) {
						setIsLoggedIn(true);
						setuserID(data.message.user_id);
						navigate("/");
					}
				})
		} catch (err) {
			console.log(err);
			setAuthStatus(AuthStatusEnum.ERROR);
		}
	}, []);

	const BASE_URL = window.location.origin;

	const receiveMessage = useCallback(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		async (event: MessageEvent<any>) => {
			if (event.origin !== BASE_URL) {
				return;
			}
			const { data } = event;
			if (data.source === "dauth-login-callback") {
				if (!data.code) {
					setAuthStatus(AuthStatusEnum.REJECTED);
				} else {
					setAuthStatus(AuthStatusEnum.ACCEPTED);
					sendAuthCodeToServer(data.code);
				}
			}
		},
		[BASE_URL, sendAuthCodeToServer]
	);

	const [windowObjectReference, setWindowObjectReference] =
		useState<Window | null>(null);
	const [previousUrl, setPreviousUrl] = useState<string | null>(null);

	const openSignInWindow = useCallback(
		(url: string, name: string) => {
			window.removeEventListener("message", receiveMessage);

			const strWindowFeatures = isMobile
				? "_blank"
				: "toolbar=no, menubar=no, width=600, height=700, top=100, left=100";

			if (windowObjectReference === null || windowObjectReference.closed) {
				setWindowObjectReference(window.open(url, name, strWindowFeatures));
			} else if (previousUrl !== url) {
				setWindowObjectReference(window.open(url, name, strWindowFeatures));
				windowObjectReference?.focus();
			} else {
				windowObjectReference.focus();
			}
    			setAuthStatus(AuthStatusEnum.WAITING);

			window.addEventListener("message", receiveMessage, false);

			setPreviousUrl(url);
		},
		[previousUrl, receiveMessage, windowObjectReference]
	);

	const generateDauthStringAndOpenUrl = useCallback(() => {
		const dauthURL = generateDauthAuthorizeUrl();
		openSignInWindow(dauthURL.toString(), "dauthURL");
		setAuthStatus(AuthStatusEnum.START);
	}, [openSignInWindow]);


  return (
		<button
			className={styles.dauthButton}
			onClick={generateDauthStringAndOpenUrl}
		>
			Login With DAuth
		</button>
  );
}

export default DAuthLogin;