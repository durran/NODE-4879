import { MongoClient } from 'mongodb';

function transform(doc) {
  return { x: doc.n * 2 };
}

const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('node4879');
const collection = db.collection('test');

await collection.drop();
await collection.insertMany([{ n: 1 }, { n: 2}, { n: 3 }]);

const cursor = collection.find({}, { batchSize: 1 }).map(doc => transform(doc));

while (await cursor.hasNext()) {
  console.log(await cursor.next());
}

// Expectation is printing { x: 2, x: 4, x: 6 }
// Actual is { x: NaN, x: 4, x: 6 }
// Seems to transform in the first call to hasNext() - transform gets called 4 times in this example.