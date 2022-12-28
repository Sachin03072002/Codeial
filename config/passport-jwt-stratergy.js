const passport=require('passport');
const JWTStratergy = require('passport-jwt').Strategy;

const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const env= require('./environment');
let opts={
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.CODEIAL_JWT_SECRET

}


passport.use(new JWTStratergy(opts,function(jwtPayLoad,done){
    User.findById(jwtPayLoad._id, function(err,user){
        if(err){
            console.log('Error in finding user from Jwt');
            return;
        }
        if(user){
            return done(null,user);
        }else{
            return done(null,false);
        }

    });
}));


module.exports=passport;