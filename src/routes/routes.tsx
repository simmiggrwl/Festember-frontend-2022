import {
	Homepage,
	Register,
	Login,
	Sponsors,
	Wildfire,
	Accommodation,
	Hospitality,
	Instructions,
	HowToReach,
	FAQ,
	Contact,
	Events,
	EventsPage,
	Informals,
	Workshops
} from "../pages";
import React from "react";
import { Timeline } from "../components";

const routes: RouteType[] = [
	{
		title: "Home",
		path: "/",
		description: "Home Page of Festember 2022",
		element: <Homepage />,
	},
	{
		title: "Register",
		path: "/register",
		description: "Register for Festember 2022",
		element: <Register />,
	},
	{
		title: "Login",
		path: "/login",
		description: "Login to Festember 2022",
		element: <Login />,
	},
	{
		title: "Sponsors",
		path: "/sponsors",
		description: "Sponsors of Festember 2022",
		element: <Sponsors />,
	},
	{
		title: "Wildfire",
		path: "/wildfire",
		description: "Wildfire Page of Festember 2022",
		element: <Wildfire />,
	},
	{
		title: "Hospitality",
		path: "/hospitality",
		description: "Hospitality Page of Festember 2022",
		element: <Hospitality />,
	},
	{
		title: "Instruction",
		path: "/hospitality/instructions",
		description: "Instructions for Festember 2022",
		element: <Instructions />,
	},
	{
		title: "How To Reach",
		path: "/hospitality/how_to_reach",
		description: "How To Reach for Festember 2022",
		element: <HowToReach />,
	},
	{
		title: "Accommodation",
		path: "/hospitality/accommodation",
		description: "Accommodation for Festember 2022",
		element: <Accommodation />,
	},
	{
		title: "Contact",
		path: "/hospitality/contacts",
		description: "Contact for Festember 2022",
		element: <Contact />,
	},
	{
		title: "FAQ",
		path: "/hospitality/faq",
		description: "FAQ for Festember 2022",
		element: <FAQ />,
	},
	{
		title: "Events",
		path: "/events",
		description: "Event Clusters of Festember 2022",
		element: <Events />,
	},
	{
		title: "Events Page",
		path: "/events/:cluster",
		description: "Events Page of Festember 2022",
		element: <EventsPage />,
	},
	{
		title: "Informals Page",
		path: "/informals",
		description: "Informals Page of Festember 2022",
		element: <Informals />,
	},
	{
		title: "Workshops Page",
		path: "/workshops",
		description: "Workshops Page of Festember 2022",
		element: <Workshops />,
	},
];

export default routes;
