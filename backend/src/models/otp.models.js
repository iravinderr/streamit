import mongoose, { Schema } from "mongoose";
import otpGenerator from "otp-generator";
import { mailer } from "../utils/mailer.utils.js";


const otpSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5*60,
    }
});


otpSchema.pre("save", async function (next) {
    this.otp = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets
    });

    let otpExists = await mongoose.models.OTP.findOne({ otp : this.otp });

    while (otpExists) {
        this.otp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            specialChars: false,
            upperCaseAlphabets
        });

        otpExists = await mongoose.models.OTP.findOne({ otp : this.otp });
    }

    await mailer(
        this.email,
        `Verification email from StreamIt Services`,
        `This is the verification  email from StreamIt Services.
        Use ${this.otp} as your verification otp. This otp is valid for the next five minutes.`
    );

    next();
});


export const OTP = mongoose.model("OTP", otpSchema);