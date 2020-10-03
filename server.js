
let jwt=require("jsonwebtoken");
const bodyParser=require("body-parser");
const express=require("express");
let middleware=require("./middleware.js");
let config=require("./config.js");

const PORT=200;
class HandlerGenerator{
    login(req,res){
        let username =req.body.username;
        let password=req.body.password;

        const saveduser="user";
        const savedpass="admin";
        if(username && password){
            if(username===saveduser && password===savedpass){
                let token=jwt.sign({username:username},
                    config.secret,
                    {
                        expiresIn:'24h'
                    }
                    );
                    res.json({
                        success:true,
                        message:"Authentication successful",
                        token:token
                    })

            }
            else{
                res.json({
                    sucess:false,
                    message:"Incorrect password"
                })
            }
        }
        else{
            res.json({
                sucess:false,
                message:"Authentication unsuccessful"
            })
        }
    }
    testToken(req,res){
        res.json({
            status:"token verification successful"
        })
    }
}

function main(){
    let app=express();
    let handler=new HandlerGenerator();
    const PORT=200;
    app.use(bodyParser.urlencoded({
        extended:true
    }))
    app.use(bodyParser.json());
    app.post("/login",handler.login);
    app.get('/',middleware.checkToken,handler.testToken);
    app.listen(PORT,()=>console.log(`server is listening on port:${PORT}`));
}
main();