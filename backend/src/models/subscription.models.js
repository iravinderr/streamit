import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
    {
        subscriber: {
            type: Schema.Types.ObjectId,
            ref: "USER"
        },
        channel: {
            type: Schema.Types.ObjectId,
            ref: "USER"
        }
    },

    {timestamps: true}
);


export const SUBSCRIPTION = mongoose.model("SUBSCRIPTION", subscriptionSchema);