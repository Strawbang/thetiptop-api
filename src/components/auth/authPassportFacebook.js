const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const models = require('../../config/models/modelAssociation');

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
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
});

async function createUser (profile, email) {
  const newUser = await User.create({
    facebook_id: profile.id,
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

passport.use("facebookAuth", new FacebookStrategy({
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: process.env.BASE_API+"/api/auth/facebook/redirect",
    passReqToCallback : true,
    profileFields: ['emails', 'name']
  }, async (req, accessToken, refreshToken, profile, done) => {
      try {
        let ticketNumber = ""
        let objectTicket = JSON.parse(req.query.state)
        ticketNumber  = objectTicket.ticket;
        await User.findOne({where : {facebook_id: profile.id}, include:Role})
          .then(async (currentUser)=>{
            if(currentUser) { //User exist and have allready play
              return done(null, currentUser); //Return UserInfo
            } 
            else { //User dont exist
              if (ticketNumber === 0) { //And no ticket played
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