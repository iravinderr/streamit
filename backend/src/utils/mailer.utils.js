import nodemailer from "nodemailer";

const mailer = async (email, title, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        return await transporter.sendMail({
            from: `StreamIt Services`,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        });
    } catch (error) {
        console.log("!!! ERROR IN MAILING !!!");
        console.log(error);
    }
}

export { mailer };