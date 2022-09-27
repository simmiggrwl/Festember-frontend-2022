import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "react-spring-3d-carousel";
import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	Select,
	useDisclosure,
} from "@chakra-ui/react";
import { config } from "react-spring";
import { userContext } from "../../contexts/UserContext";
import { config as appConfig } from "../../../config";
import { Card } from "../../components/CarouselCard/Card";
import "./style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./style.module.css";
import { toast } from "react-hot-toast";

export default function Workshops() {
	const { isLoggedIn } = useContext(userContext);
	const { isOpen, onClose, onToggle } = useDisclosure();
	const [goToSlide, setGoToSlide] = useState(0);
	const [clusterIndex, setClusterIndex] = useState(0);
	const [workshopDetails, setWorkshopDetails] = useState<
		WorkshopDetailsType[]
	>([]);
	const [slotDetails, setSlotDetails] = useState<SlotDetailsType[]>([]);
	const [choosenSlot, setChoosenSlot] = useState<string>("");
	const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>(false);
	const [showTicketSaleToast, setShowTicketSaleToast] =
		useState<boolean>(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchWorkshopDetails = async () => {
			fetch(`${appConfig.backendOrigin}/workshopDetailsWithSlots`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((response) => {
					setWorkshopDetails(response.message.workshop_details);
					setSlotDetails(response.message.slot_details);
				})
				.catch((e) => {
					console.log(e);
				});
		};
		fetchWorkshopDetails();
		setShowTicketSaleToast(true);
	}, []);

	useEffect(() => {
		toast("Ticket Sales on September 27th and 28th", {
			icon: "🎟️",
			duration: 8000,
			id: "ticket-sales-toast",
		});
	}, [showTicketSaleToast]);

	const handleWorkshopRegister = () => {
		setIsRegisterLoading(true);
		if (!isLoggedIn) {
			toast.dismiss("ticket-sales-toast");
			navigate("/login");
			toast.error("Please login to register for a workshop");
		} else if (choosenSlot === "") {
			toast.error("Please choose time slot to register for workshop");
		} else {
			fetch(`${appConfig.backendOrigin}/registerWorkshopSlots`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					workshop_id: workshopDetails[clusterIndex].workshop_id,
					slot_id: choosenSlot,
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

	const formatDate = (date: string) => {
		const dateObj = new Date(date);
		return `${dateObj.getDate()}-${
			dateObj.getMonth() + 1
		}-${dateObj.getFullYear()}`;
	};

	function navigateClusters(index: number) {
		setGoToSlide(index);
		setClusterIndex(index);
	}

	const slides =
		workshopDetails &&
		workshopDetails.map((slide, index) => ({
			key: index,
			content: (
				<Card
					color={index % 2 ? "#fff" : "#000"}
					src={
						appConfig.basePath +
						"/Assets/Images/WorkshopImages/" +
						slide.workshop_image_name +
						".jpeg"
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
						{workshopDetails &&
							workshopDetails[clusterIndex]?.workshop_name}
					</div>
					{workshopDetails && (
						<Carousel
							slides={slides}
							goToSlide={goToSlide}
							showNavigation={false}
							offsetRadius={2}
							animationConfig={config.gentle}
						/>
					)}
				</div>
				{workshopDetails && (
					<div className={styles.workshopDetails}>
						<h3>Workshop Description</h3>
						<p>
							{workshopDetails &&
								workshopDetails[clusterIndex]?.workshop_desc}
						</p>
						<br />
						<button
							className={styles.registerButton}
							onClick={onToggle}
							type="button"
						>
							Register here
						</button>
					</div>
				)}
				<Modal
					isOpen={isOpen}
					onClose={() => {
						setChoosenSlot("");
						onClose();
					}}
					isCentered
				>
					<ModalOverlay />
					<ModalContent p={6} m={6}>
						<ModalCloseButton />
						<ModalBody>
							<div className={styles.workshopRegisterForm}>
								<div className={styles.modalHead}>Choose Time Slot</div>
								<Select
									className={styles.formInput}
									value={choosenSlot}
									onChange={(e) => setChoosenSlot(e.target.value)}
								>
									<option value="">Select time slot</option>
									{slotDetails &&
										slotDetails.map((slot) => {
											if (
												workshopDetails &&
												slot.workshop_id ===
													workshopDetails[clusterIndex].workshop_id
											) {
												return (
													<option
														key={slot.slot_id}
														value={slot.slot_id}
													>
														{formatDate(slot.workshop_date)}{" "}
														{"  "}
														{slot.slot_start_time.slice(
															0,
															-3
														)} - {slot.slot_end_time.slice(0, -3)}
													</option>
												);
											}
										})}
								</Select>
								<Button
									mt={6}
									isLoading={isRegisterLoading}
									loadingText="Registering"
									onClick={handleWorkshopRegister}
								>
									REGISTER
								</Button>
							</div>
						</ModalBody>
					</ModalContent>
				</Modal>
			</div>
		</>
	);
}
