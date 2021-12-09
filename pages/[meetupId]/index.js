import Head from "next/head";
import { MongoClient, ObjectId } from "mongodb";

import MeetupDetail from "../../components/meetups/MeetupDetail";

export default function MeetupDetails(props) {
	return (
		<>
			<Head>
				<title>{props.meetupData.title}</title>
				<meta name="description" content={props.meetupData.description} />
			</Head>
			<MeetupDetail
				// id={props.meetupData.id}
				title={props.meetupData.title}
				image={props.meetupData.image}
				address={props.meetupData.address}
				description={props.meetupData.description}
			/>
		</>
	);
}

export async function getStaticProps(context) {
	const selectedId = context.params.meetupId;

	const client = await MongoClient.connect(
		"mongodb+srv://admin:notebook123@cluster0.6wiuf.mongodb.net/meetupsDB?retryWrites=true&w=majority"
	);
	const db = client.db();
	const meetupsCollection = db.collection("meetups");

	const selectedMeetup = await meetupsCollection.findOne({ _id: ObjectId(selectedId) });

	await client.close();

	return {
		props: {
			meetupData: {
				id: selectedMeetup._id.toString(),
				title: selectedMeetup.title,
				image: selectedMeetup.image,
				address: selectedMeetup.address,
				description: selectedMeetup.description,
			},
		},
	};
}

export async function getStaticPaths() {
	const client = await MongoClient.connect(
		"mongodb+srv://admin:notebook123@cluster0.6wiuf.mongodb.net/meetupsDB?retryWrites=true&w=majority"
	);
	const db = client.db();
	const meetupsCollection = db.collection("meetups");

	const meetups = await meetupsCollection.find({}).project({ _id: 1 }).toArray();

	await client.close();

	// fallback set to true/blocking results in not sending 404 error to page instead waiting for it
	// this usually happens when a new dynamic page is added which never got cached at build
	// true = user will see page with nothing on it || blocking = page will only show once its loaded
	return {
		paths: meetups.map((meetup) => {
			return { params: { meetupId: meetup._id.toString() } };
		}),
		fallback: "blocking",
	};

	// return {
	// 	paths: [{ params: { meetupId: "m1" } }, { params: { meetupId: "m2" } }],
	// 	fallback: false,
	// };
}

// import { MongoClient } from mongodb

// 1
// connect to db and declare a collection
// client = MongoClient.connect( connectionString )
// db = client.db()
// collection = db.collection( collectionName )
//
// client.close() once data is retrieved

// 2
// use getStaticPaths to pre-render all potential paths from database
// use the find method on the collection to retreive only the ids
// .find({}, { _id: 1 }) = all items, show "1"/true only the "_id" values
//
// map the meetups received into the return of the
// getStaticPaths function under the paths property
//
// you can use cursor.toArray()
// the cursor is a MongoDB Collection of the document
// which is returned by the .find() method

// 3
// use getStaticProps to pre-render
//
//
// use the { ObjectId } function imported from mongodb
// to serialise a string into the _id / ObjectId object
// use .toString on the ._id to deserialise to string
