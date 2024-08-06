import { MongoClient, ServerApiVersion } from "mongodb"
const uri =
  "mongodb+srv://smokiebacon:ZGrddh7igvvjIUU1@linkful.ztcq2ri.mongodb.net/?retryWrites=true&w=majority&appName=Linkful"

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    deprecationErrors: true,
  },
})

export async function connectDB() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect()
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 })
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    )
  } catch (err) {
    console.error("error", err.message)
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close()
  }
}
