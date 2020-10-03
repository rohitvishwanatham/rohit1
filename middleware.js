let jwt=require("jsonwebtoken");
const config=require("./config.js");

let checkToken=(req,res,next)=>{
    let token=req.headers['authorization'];
    if(token.startsWith('Bearer')){
        token=token.slice(7,token.length);

    }
    if(token){
        jwt.verify(token,config.secret,(err,decoded)=>{
            if(err){
                return res.json({
                    sucess:false,
                    message:'Token not valid'
                })
            }
            else{
               req.decoded=decoded;
               next();
            }
        })
    }
    else{
        return res.json({
            sucess:false,
            message:'Token not provided'
                })
    }
}
module.exports={
    checkToken:checkToken,
};