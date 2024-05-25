import mongoose, { Schema } from "mongoose";


const detailSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        avatar: {
            type: String,
        },
        coverImage: {
            type: String,
        },
        DOB : {
            type: Date,
        },
        phone: {
            type: String
        }
    },

    { timestamps : true }
);


export const DETAILS = mongoose.model("DETAILS", detailSchema);