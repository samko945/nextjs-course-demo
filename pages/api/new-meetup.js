// url = www.domain.com/api/new-meetup
// user: admin, pw: notebook123

import { MongoClient } from "mongodb";

export default async function handler(req, res) {
	if (req.method === "POST") {
		const data = req.body;

		const client = await MongoClient.connect(
			"mongodb+srv://admin:notebook123@cluster0.6wiuf.mongodb.net/meetupsDB?retryWrites=true&w=majority"
		);
		const db = client.db();

		const meetupsCollection = db.collection("meetups");

		const result = await meetupsCollection.insertOne(data);

		console.log(result);

		client.close();
		res.status(201).json({ message: "meetup inserted" });
	}
}
