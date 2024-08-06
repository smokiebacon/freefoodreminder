// models/Subscription.js
import mongoose from "mongoose"

const SubscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Subscription = mongoose.model("Subscription", SubscriptionSchema)

export default Subscription
