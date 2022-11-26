const express=require('express');
const router= express.Router();
const passport=require('passport');

const postsController=require('../controllers/postcontroller');

//allow only the signed in user to post

router.post('/create',passport.checkAuthentication,postsController.create);
module.exports=router;