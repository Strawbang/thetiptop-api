const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const models = require('../../config/models/modelAssociation');
const ticketsService = require('../tickets/ticketsService');
const signIn = require('../auth/authService')
const User = models.users;
const Role = models.roles;
const Client = models.clients;
const Ticket = models.tickets;

passport.serializeUser(function(user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    User.findById(id).then((user) => {
      done(null, user)
    })
});

async function createUser (profile, email) {
  const newUser = await User.create({
    google_id: profile.id,
    firstname: profile.name.givenName,
    lastname: profile.name.familyName,
    password: Math.random().toString(10),
    email: email,
    birthdate: 0000-00-00,
    active: 1,
  }).then( async (newUser) => {
    await newUser.setRoles([3])
    return newUser
  })
  const user = await User.findOne({where: {id: newUser.id}, include:Role})
  
  return user
}

//Google connexion
//-- Faire seulement la connexion si utilisateur non existant rediriger vers la page /Participate
passport.use('googleAuth', new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.BASE_API+"/api/auth/google/redirect",
    passReqToCallback: true 
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      let ticketNumber = ""
      ticketNumber  = req.query.state;
      await User.findOne({where : {google_id: profile.id}, include:Role})
        .then(async (currentUser)=>{
          if(currentUser) { //User exist and have allready play
            if(ticketNumber) {
              currentUser.ticket = ticketNumber
            }
            return done(null, currentUser); //Return UserInfo
          } 
          else { //User dont exist
            if (ticketNumber === "0") { //And no ticket played
              let current = Array()
              current.errors = "User not registered"
              return done(null, current);
            } else { //Ticket played
              let email = profile.emails[0].value
              currentUser = await createUser(profile, email) //Getting back user information once created
              currentUser.ticket = ticketNumber //Sending the ticket number to user information
              return done(null, currentUser)
            }
          }
        }
      );
    } catch (err) {
      console.error(err)
    }
   }
));
