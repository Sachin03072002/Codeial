const express = require('express');
//setting cookies
const cookieParser=require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db=require('./config/mongoose');
//used for session cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport_layout_stratergy');
const passportJWT=require('./config/passport-jwt-stratergy');
const passportGoogle=require('./config/passport-google-oauth2-stratergy');
const { Store } = require('express-session');
const MongoStore=require('connect-mongo')(session);
const sassMiddleware=require('node-sass-middleware');
const { debug } = require('console');
const flash=require('connect-flash');
const customMWare=require('./config/middleware');
const env= require('./config/environment');
const logger=require('morgan');
// set up the chart server to be used with socket.io
const chatServer= require('http').Server(app);
const io=require('socket.io')(chatServer, {
    CORS: {
        origin: '*'
    }
});

const chatSocket= require('./config/chat_socket').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');
const path=require('path');
const environment = require('./config/environment');

if(env.name == 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname, './assets', '/scss'),
        dest: path.join(__dirname, './assets', 'css'),
        debug:true,
        outputStyle:'expanded',
        prefix:'/css'
    }));
}


app.use(express.urlencoded());
app.use(cookieParser());
//make the upload path available to the browser

app.use(express.static('./assets'));
app.use('/uploads',express.static(__dirname+'/uploads'));

app.use(expressLayouts);

app.use(logger(environment.morgan.mode, env.morgan.options));

//extract style and scripts from sub pages into the layouts
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');
//mongo store is used to store the seesion cookie in the db
app.use(session({
    name: 'codeial',
    //todo cheange the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized:false,//when the user is not looged in
    resave:false, //when the user is looged in it is not need to alter its information
    cookie:{
        //miliseconds
        maxAge:(1000*60*100)
    },
    store: new MongoStore(
        {
            mongooseConnection:db,
            autoRemove:'disabled'
        }
        ,function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));

// import { createServer } from "http";
// import { Server } from "socket.io";

// const httpServer = chatServer();
// const io = new chatSocket(chatServer, {
//     cors: {
//       origin: "https://example.com"
//     }
//   });


app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMWare.setFlash);
// use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
