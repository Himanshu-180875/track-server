const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const jwt= require('jsonwebtoken')
const User = mongoose.model('User');

router.post('/signup', async (req,res)=>{
    // console.log(req.body)

    
        const {email, password} = req.body;

        
        
        User.findOne({email}, async function(err, user){
            if(err){
                return res.status(422).send(err.message)
            }
            if(user){
                return res.status(409).send({error:'A person with this email already exists'})
            }
            else{
                const user = new User({email, password})
                await user.save()
                const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY)
                res.send({token})
            }

        }) 
            
        
        
   
        
    
})

router.post('/signin', async(req,res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(422).send({error: 'Must Provide email and password '})
    }
    const user =await User.findOne({email})
    if(!user){
        return res.status(404).send({error:'email or password Incorrect'})

    }
    try{
    await user.comparePassword(password)
    const token=jwt.sign({userId:user._id},process.env.SECRET_KEY)
    res.send({token})
    }catch(err){
        res.status(422).send({error:'Invalid password or email'})
    }
})

module.exports =router;