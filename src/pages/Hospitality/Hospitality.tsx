import styles from "./styles.module.css";
import { Center, Flex, Link } from "@chakra-ui/react";
import { config } from "../../../config";
import { Link as RouterLink } from "react-router-dom";
const routes = [
	{ name: "instructions", path: "/hospitality/instructions" },
	{ name: "how to reach", path: "/hospitality/how_to_reach" },
	{ name: "accommodation", path: "/hospitality/accommodation" },
	{ name: "contacts", path: "/hospitality/contacts" },
	{ name: "faq", path: "/hospitality/faq" },
];

const Hospitality = () => {
	return (
		<div className={styles.container}>
			<div className={styles.header}>Hospitality</div>
			<div className={styles.content}>
				<Flex
					flexDirection="column"
					align="center"
					mt={5}
					style={{ fontFamily: "Poppins" }}
				>
					{routes.map((route) => {
						return (
							<Link
								as={RouterLink}
								to={`${route.path}`}
								key={route.name}
							>
								<Center
									position="relative"
									fontSize="2xl"
									width="12em"
									className={styles.button}
								>
									{route.name}
								</Center>
							</Link>
						);
					})}
				</Flex>
			</div>
		</div>
	);
};

export default Hospitality;
