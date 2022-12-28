const passport=require('passport');
const googleStratergy=require('passport-google-oauth').OAuth2Strategy;
const crypto= require('crypto');
const User=require('../models/user');
const env= require('./environment');



//tell passport to use a stratergy for google login
passport.use(new googleStratergy({
        clientID: env.google_client_id,
        clientSecret: env.google_client_secret,
        callbackURL: env.google_callback_uRL
    },
    function(accessToken, refreshToken, profile, done){
        //findOne
        User.findOne({email: profile.emails[0].value}).exec(function(err,user){
            if(err){
                console.log('error in google stratergy passport',err);
                return;
            }
            console.log(accessToken, refreshToken);
            console.log(profile);
            if(user){
                //if found , set this user as req.user
                return done(null,user);

            }else{
                //if not found, create the user and setb it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')

                },function(err, user){
                    if(err){
                        console.log('error in creating user google stratergy passport',err);
                        return;
                    }
                    return done(null,user);
                })
            }
        })
    }
))

module.exports=passport;