import Head from "next/head";
import { MongoClient } from "mongodb";

import { useState, useEffect } from "react";
import MeetupList from "../components/meetups/MeetupList";

// const DUMMY_MEETUPS = [
// 	{
// 		id: "m1",
// 		title: "A First Meetup",
// 		image: "https://cdn.getyourguide.com/niwziy2l9cvz/1O68uOT1vS6WeGqiKAw8Cy/8da3fa095f9856e891287895ad82ac22/1.jpg",
// 		address: "Some address 5, 12345 Some City",
// 	},
// 	{
// 		id: "m2",
// 		title: "A Second Meetup",
// 		image: "https://cdn.getyourguide.com/niwziy2l9cvz/1O68uOT1vS6WeGqiKAw8Cy/8da3fa095f9856e891287895ad82ac22/1.jpg",
// 		address: "Some address 10, 14701 Some City",
// 	},
// ];

export default function HomePage(props) {
	const [loadedMeetups, setLoadedMeetups] = useState([]);
	useEffect(() => {
		setLoadedMeetups(props.meetups);
	}, [props.meetups]);
	return (
		<>
			<Head>
				<title>React Meetups</title>
				<meta name="description" content="Browse a huge list of highly active React meetups!" />
			</Head>
			<MeetupList meetups={loadedMeetups} />
		</>
	);
}

/**
 * The getStaticProps and getServerSideProps functions are reserved to run during the build process of your app.
 * They are two forms of pre-rendering.
 * The code is not going to be shown in the client.
 *
 * You always need to return an object.
 */

// export async function getServerSideProps(context) {
// 	const { req, res } = context;
// 	return {
// 		props: {
// 			meetup: DUMMY_MEETUPS,
// 		},
// 	};
// }

export async function getStaticProps() {
	// Static Generation
	//* props
	// If you export an async function called getStaticProps from a page,
	// Next.js will pre-render this page at build time and pass the fetched data to the page's props.
	//* revalidation
	// As the generation happens during build, the page is cached only once during the build process and can only be updated by rebuilding.
	// the revalidation property value is the amount of time in seconds for which a revalidation to occur.
	// So now if the data were to update, the page will have the latest version of the data.

	const client = await MongoClient.connect(
		"mongodb+srv://admin:notebook123@cluster0.6wiuf.mongodb.net/meetupsDB?retryWrites=true&w=majority"
	);
	const db = client.db();

	const meetupsCollection = db.collection("meetups");

	const meetups = await meetupsCollection.find().toArray();

	client.close();

	return {
		props: {
			meetups: meetups.map((meetup) => ({
				title: meetup.title,
				address: meetup.address,
				image: meetup.image,
				id: meetup._id.toString(),
			})),
		},
		revalidate: 10,
	};
}
