const mongoose=require('mongoose');
require('dotenv').config();
const DB_URL=process.env.DB_URL;

async function ConnectToDatabase(){
    const res=await mongoose.connect(DB_URL);
    (res)?console.log('Database connected successfully'):console.log('Error while connecting to Database '+error);
}

ConnectToDatabase();