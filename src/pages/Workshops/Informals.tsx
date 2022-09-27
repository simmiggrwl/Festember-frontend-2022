import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	useDisclosure,
} from "@chakra-ui/react";
import Carousel from "react-spring-3d-carousel";
import { userContext } from "../../contexts/UserContext";
import { config } from "react-spring";
import { config as appConfig } from "../../../config";
import { Card } from "../../components/CarouselCard/Card";
import "./style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./style.module.css";

export default function Informals() {
	const { isLoggedIn } = useContext(userContext);
	const { isOpen, onClose, onToggle } = useDisclosure();
	const [goToSlide, setGoToSlide] = useState(0);
	const [clusterIndex, setClusterIndex] = useState(0);
	const [informalsDetails, setInformalsDetails] = useState<
		InformalsDetailsType[]
	>([]);
	const [numberOfTickets, setNumberOfTickets] = useState<number>();
	const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>(false);
	const navigate = useNavigate();

	const handleInformalRegister = () => {
		setIsRegisterLoading(true);
		if (!isLoggedIn) {
			navigate("/login");
			toast.error("Please login to register for informals");
		} else if (
			numberOfTickets === undefined ||
			Number.isInteger(numberOfTickets) !== true ||
			numberOfTickets <= 0
		) {
			toast.error("Please enter valid number of tickets");
		} else {
			fetch(`${appConfig.backendOrigin}/registerInformal`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					informals_id: informalsDetails[clusterIndex].informals_id,
					number_of_tickets: numberOfTickets,
				}),
			})
				.then((res) => res.json())
				.then((response) => {
					if (response.status_code === 200) {
						toast.success("Registered successfully");
						onClose();
					} else {
						toast.error(response.message);
					}
				})
				.catch((e) => {
					console.log(e);
					toast.error("Something went wrong! Try again later!");
				});
		}
		setIsRegisterLoading(false);
	};

	function navigateClusters(index: number) {
		setGoToSlide(index);
		setClusterIndex(index);
	}

	useEffect(() => {
		const fetchInformalsDetails = async () => {
			fetch(`${appConfig.backendOrigin}/getInformalsDetails`, {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((response) => {
					setInformalsDetails(response.message.informals_details);
				})
				.catch((e) => {
					console.log(e);
				});
		};
		fetchInformalsDetails();
	}, []);

	const slides =
		informalsDetails &&
		informalsDetails.map((slide, index) => ({
			key: index,
			content: (
				<Card
					color={index % 2 ? "#fff" : "#000"}
					src={
						appConfig.basePath +
						"/Assets/Images/informals-images/" +
						slide.informals_image_name +
						".jpg"
					}
				/>
			),
			onClick: () => navigateClusters(index),
		}));

	return (
		<>
			<div className={styles.workshopsLayout}>
				<div></div>
				<div className={styles.workshopCarousel}>
					<div className={styles.workshops}>
						{informalsDetails &&
							informalsDetails[clusterIndex]?.informals_name}
					</div>
					{informalsDetails && (
						<Carousel
							slides={slides}
							goToSlide={goToSlide}
							showNavigation={false}
							offsetRadius={2}
							animationConfig={config.gentle}
						/>
					)}
				</div>
				{informalsDetails && (
					<div className={styles.workshopDetails}>
						<h3>
							{informalsDetails &&
								informalsDetails[clusterIndex]?.informals_name}{" "}
							Description
						</h3>
						<br />
						<p>
							{informalsDetails &&
								informalsDetails[clusterIndex]?.informals_desc}
						</p>
						<br />
						<button
							className={styles.registerButton}
							type="button"
							onClick={onToggle}
						>
							Register here
						</button>
					</div>
				)}
				<Modal isOpen={isOpen} onClose={onClose} isCentered>
					<ModalOverlay />
					<ModalContent p={6} m={6}>
						<ModalCloseButton />
						<ModalBody>
							<div className={styles.workshopRegisterForm}>
								<div className={styles.modalHead}>
									Enter Number of Tickets
								</div>
								<Input
									style={{ width: "75%" }}
									className={styles.formInput}
									placeholder="Number of Tickets"
									type="number"
									value={numberOfTickets}
									onChange={(e) =>
										setNumberOfTickets(parseInt(e.target.value))
									}
								/>
								<div className={styles.infromalsButtonGroup}>
									<Button
										mx={6}
										isLoading={isRegisterLoading}
										loadingText="Registering"
										onClick={handleInformalRegister}
									>
										REGISTER
									</Button>
									<Button onClick={onClose}>CANCEL</Button>
								</div>
							</div>
						</ModalBody>
					</ModalContent>
				</Modal>
			</div>
		</>
	);
}
