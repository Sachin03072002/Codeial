const { userInfo } = require("os");
const User = require("../models/user");
const USer=require('../models/user');
module.exports.profile = function(req, res){
    return res.render('user_profile', {
        title: 'User Profile'
    })
}
// render the sign up page
module.exports.signUp=function(req,res){
    return res.render('user_sign_up',{
        title:"Codeial | Sign up"
    })
}

//render the sign in page
module.exports.signIn=function(req,res){
    return res.render('user_sign_in',{
        title: "Codeial | Sign In"
    })
}


//get the signup data
module.exports.create=function(req,res){
    if(req.body.password != req.body.confirmPassword){
        console.log("1");
        return res.redirect('back');
    }
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log('error in finding user in signing up');
            console.log("2");
            return;
        }
        if(!user){
            User.create(req.body,function(err,user){
                if(err){
                    console.log('error in creating user while signing up');
                    console.log("3");
                    return;
                }
                console.log("4");
                return res.redirect('/users/sign-in');
            });
        }
        else{
            console.log("5");
            res.redirect('back');
        }
    });
    

}
//sign in and create a session for the user
module.exports.createSession= function(req,res){
    //todo later
}