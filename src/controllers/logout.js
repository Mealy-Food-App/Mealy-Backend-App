export default class logoutController {
   static async logOut (req, res) {
      req.logout(); // Terminate user session
      res.redirect('/'); // Redirect to home page or any other desired page
    }
  };
  
  // Export the controller
//   export { logoutController };