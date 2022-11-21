const { userInfo } = require("os");
const User = require("../models/user");

module.exports.profile = function(req, res){
    if(req.cookies.user_id){
        User.findById(req.cookies.user_id,function(err,user){
            if(user){
                return res.render('user_profile',{
                    title:"User Profile",
                    user:user
                })
            }
            return res.redirect('/users/sign-in');
        });
    }else{
        return res.redirect('/users/sign-in');
    }
    
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
module.exports.signOut=function(req,res){
    return res.render('user_sign_in',{
        title:" Codeial | Sign-out"
    });

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
    //find the user
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log("error in finding user in sign in");
            return;
        }
        //handle user found
        if(user){
            //handle mismatching or password which donnt match
            if(user.password!=req.body.password){
                return res.redirect('back');
            }

            //handle session creation
            res.cookie('user_id',user.id);
            return res.redirect("/users/profile");


        }else{
            //handle user not found
            return res.redirect('back');
        }

    });
}


module.exports.signOut=function(req,res){
    // if(req.cookies.user_id){
    //    console.log(req.cookies.user_id);
    // }else{
    //     return res.redirect('/users/sign-in');
    // }
    console.log(req.cookies.user_id);
}