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
  lastSentDate: { type: Date, default: null },
})

const Subscription = mongoose.model("Subscription", SubscriptionSchema)

export default Subscription
