import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
    {
        subscribers: [{
            type: Schema.Types.ObjectId,
            ref: "USER"
        }],
        subscribedChannels: [{
            type: Schema.Types.ObjectId,
            ref: "USER"
        }]
    },

    {timestamps: true}
);


export const SUBSCRIPTION = mongoose.model("SUBSCRIPTION", subscriptionSchema);