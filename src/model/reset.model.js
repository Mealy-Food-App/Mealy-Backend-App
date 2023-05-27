/*



// // This is a pre-middleware on save that happens betweern getting and saving the data to the database.
// userSchema.pre('save', function(next) {
//     if(!this.isModified('password')) return next();
// })



export default model('User', userSchema)


router.post('/forgotpassword', UserController.forgotPassword);
router.post('/resetpassword', UserController.resetPassword);

//forgot pssword

  static async forgotPassword(req, res) {
    const { email } = req.body;
    const appEmail = process.env.EMAIL;
    const password = process.env.PASSWORD;


    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });


      user.resetToken = token;
      user.expires = Date.now() + 60 * 60 * 1000; // 1 hour expiration time
      await user.save();

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: appEmail,
          pass: password
        },
      });
      const mailOptions = {
        from: appEmail,
        to: email,
        subject: 'Reset Password',
        text: `Please click on the following link to reset your password: ${process.env.DEV_MONGODB_CONNECTION_URL}/resetpassword/${token}`,
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


  // Reset password
  static async resetPassword(req, res) {
    const { email, password, token } = req.body;

    try {
      const resetToken = await User.findOne({ token });
      if (!resetToken) {
        return res.status(404).json({ message: 'Invalid or expired token' });
      }

      if (resetToken.expires < Date.now()) {
        await resetToken.remove();

        return res.status(400).json({ message: 'Token expired' });
      }

      const user = await User.findOne({ _id: resetToken.userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update the user's password
      user.password = hashedPassword;
      await user.save();

      // Remove the token from the database
      await resetToken.remove();

      return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};

JWT_SECRET = jstyuiehdbcsj5gthkiy6gdmhurki8nk

EMAIL : 'mealyapp@gmail.com'
PASSWORD: 'password'
*/