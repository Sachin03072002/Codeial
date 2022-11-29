const { userInfo } = require("os");
const User= require('../models/user');

module.exports.profile = function(req, res){
    // console.log(req.params.id);
    User.findById(req.params.id, function(err,user){
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user

        });
    });

}


module.exports.update = function(req,res){
    if(req.user.id == req.params.id){
        User.findByIdAndUpdate(req.params.id, req.body, function(err,user){
            return res.redirect('back');
        });
    }else{
        return res.status(401).send('Unauthorised');
    }
}
// render the sign up page
module.exports.signUp=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
    return res.render('user_sign_up',{
        title:"Codeial | Sign up"
    })
}

//render the sign in page
module.exports.signIn=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
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
    return res.redirect('/');
}


module.exports.destroySession=function(req,res,next){
    req.logout(function(err){
        if(err){
            return next(err);
        }
        return res.redirect('/');
    });


    
}