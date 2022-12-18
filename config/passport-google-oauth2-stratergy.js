const passport=require('passport');
const googleStratergy=require('passport-google-oauth').OAuth2Strategy;
const crypto= require('crypto');
const USer=require('../models/user');
const User = require('../models/user');


//tell passport to use a stratergy for google login
passport.use(new googleStratergy({
    clientID: "279437893366-987smcl2oracg95bb4l9o3orj2jvtqkj.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL:"http://localhost:8000/users/auth/google/callback",
    },
    function(accessToken, refreshToken, profile, done){
        USer.findOne({email: profile.emails[0].value}).exec(function(err,user){
            if(err){
                console.log('error in google stratergy passport',err);
                return;
            }
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

                },function(err){
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