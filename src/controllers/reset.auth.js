/*import User from "../model/user.model.js";
//import Reset from "../model/reset.model";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer"
import jwt from 'jsonwebtoken';

export default class ForgotPasswordController {
    static async forgotPassword(req, res) {
        const { email } = req.body;

        try {
            // Check if the user exists in the database
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Generate a reset token
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Save reset token in the database
           user.token = token
            await user.save();

            // Send password reset email to the user
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'roheemahdebisi@gmail.com',
                    pass: 'Ka280595',
                },
            });
            const mailOptions = {
                from: 'roheemahdebisi@gmail.com',
                to: email,
                subject: 'Reset Password',
                text: `Please click on the following link to reset your password: ${process.env.DEV_MONGODB_CONNECTION_URL}/reset-password/${resetToken}`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Failed to send reset email' });
                }
                console.log('Reset email sent:', info.response);
                return res.status(200).json({ message: 'Reset email sent' });
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
};*/