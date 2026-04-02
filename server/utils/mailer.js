import nodemailer from 'nodemailer';

export const sendOTP = async (email, otp) => {
    // Note: User will need to configure these in .env later
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your RapidPost Verification OTP',
        text: `Your OTP for registration is: ${otp}. It will expire in 10 minutes.`,
        html: `<h3>Welcome to RapidPost!</h3><p>Your OTP is: <strong>${otp}</strong>.</p><p>It will expire in 10 minutes.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("OTP sent to", email);
    } catch (error) {
        console.error("Error sending OTP:", error);
        throw new Error("Failed to send verification email");
    }
};
