require('dotenv').config();
const jwt=require('jsonwebtoken');
const JwtKey=process.env.JwtKey;

function authMiddleware(req,res,next){
    const token=req.headers.token;
    if(!token) return res.status(401).json({message:'Token is required'});
    try{
        const decoded=jwt.verify(token,JwtKey);
        if(!decoded){
            return res.status(400).json({message:'Invalid User'});
        }
        console.log('middleware passed');
        next();
    }
    catch(err){
        console.log('error in middleware '+err);
        return res.status(500).json({message:err});
    }
}

module.exports=authMiddleware;