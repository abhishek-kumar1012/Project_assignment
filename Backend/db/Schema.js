const mongoose=require('mongoose');

const UserSchema=mongoose.Schema({
    email:String,
    password:String,
    username:String,
    Cars:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Car',
    }]
})

const CarSchema=mongoose.Schema({
    title:String,
    description:String,
    images:[String],
    tags:[String],
    price:Number
})

const User=mongoose.model('User',UserSchema);
const Car=mongoose.model('Car',CarSchema);

module.exports={User,Car};