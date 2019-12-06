const express = require('express');
const router = express.Router();
const mongoose =require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.post('/signup',(req,res,nex)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length >=1){
            res.status(409).json({
                message:"user already exist"
            })
        }else{
            bcrypt.hash(req.body.password, 10, (err,hash)=>{
                if(err){
                    return res.status(500).json({
                        error:err
                    })
                }else{
                    const user = new User({
                        _id:mongoose.Types.ObjectId(),
                        email:req.body.email,
                        name:req.body.name,
                        password:hash
                        }) 
                        user.save()
                        .then(result=>{
                            console.log(result);
                            res.status(201).json({
                                message:"user created"
                            })
                        })
                        .catch(err=>{
                            console.log(err);
                            res.status(500).json({
                                error:err
                            })
                        })    
                     }         
             })
        }
    })
   
})
// login user
router.post('/login',(req,res,nex)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user =>{
        if(user.length<1){
            res.status(401).json({
                message:"Auth fail"
            })
        }
            bcrypt.compare(req.body.password, user[0].password, function(err, result) {
               if(err){
                    res.status(401).json({
                        message:"Auth fail"
                    })   
               }
               if(result){
                    res.status(401).json({
                        message:"Auth Successful"
                    })  
               }
                res.status(401).json({
                    message:"Auth fail"
                })  
            });
    
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })   
})


// delete user
router.delete('/:userId',(req,res,nex)=>{
    User.remove({_id:req.body.userId})
    .exec()
    .then(result =>{
       res.status(200).json({
           message:"user deleted"
       })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})


module.exports = router;

