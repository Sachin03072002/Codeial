const { userInfo } = require("os");
const User= require('../models/user');
const fs=require('fs');
const path=require('path');
module.exports.profile = function(req, res){
    // console.log(req.params.id);
    User.findById(req.params.id, function(err,user){
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user

        });
    });

}


module.exports.update = async function(req,res){
    if(req.user.id == req.params.id){
        try{
            let user=await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log('****** Multer Error',err);
                }
                // console.log(req.file);
                user.name = req.body.name;
                user.email - req.body.email;
                if(req.file){
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }

                    //this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/'+ req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        }catch(err){
            req.flash('error',err);
            return res.redirect('back');
        }
    }else{
        req.flash('error','Unauthorized');
        return res.status(401).send('Unauthorized');
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
    req.flash('success','Logged in successfully');
    return res.redirect('/');
}


module.exports.destroySession=function(req,res,next){
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash('success','You have Logged out');
        return res.redirect('/');
    });


    
}