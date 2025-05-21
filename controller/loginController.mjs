import argon2d from 'argon2';
import DB, {WP_User} from "../db.js";
import {db} from "../index.js";

//Τη χρησιμοποιούμε για να ανακατευθύνουμε στη σελίδα /login όλα τα αιτήματα από μη συνδεδεμένους χρήστες
export let checkAuthenticated = async function (req, res, next) {
   //Αν η μεταβλητή συνεδρίας έχει τεθεί, τότε ο χρήστης είναι συνεδεμένος
   if (req.session.loggedUserId) {
      try {
         const user = new WP_User(db, req.session.loggedUserId);
         await user.init();
      } catch (e) {
         console.log(e)
         res.redirect('/admin');
         return;
      }
      //Καλεί τον επόμενο χειριστή (handler) του αιτήματος
      if (req.originalUrl === '/admin/' || req.originalUrl === '/admin') res.redirect('/admin/sales');
      next();
   } else {
      //Ο χρήστης δεν έχει ταυτοποιηθεί, αν απλά ζητάει το /login ή το register δίνουμε τον
      //έλεγχο στο επόμενο middleware που έχει οριστεί στον router
      if (req.originalUrl === '/admin') {
         next();
      } else {
         //Στείλε το χρήστη στη "/login"
         res.redirect('/admin');
      }
   }
};
