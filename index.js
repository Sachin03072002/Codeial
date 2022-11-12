//acquiring express
const express=require('express');
const router = require('./routes/index');

const app=express();
const port=8000;


//use express router
app.use('/',require('./routes/index'))

//set up the view engine
app.set('view engine','ejs');
app.set('views','./views');

app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});

