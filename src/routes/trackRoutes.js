const express= require('express')
const mongoose= require('mongoose')
const authRoute = require('../middlewares/requireAuth');
const Track = mongoose.model('Track')

const router = express.Router();
router.use(authRoute)

router.get('/tracks', async(req, res)=>{
    
    const tracks = await Track.find({userId:req.user._id})
    res.send(tracks)

})

router.post('/tracks', async(req,res)=>{
    const {name, locations} = req.body;
    if(!name || !locations){
        return res.status(422).send({error:"fill location and name"})
    }
    try{
        const track = new Track({name, locations, userId: req.user._id})
    await track.save()
    res.send(track)
    }
    catch(err){
        return res.status(422).send({error:err.message })
    }
})

router.delete('/tracks/:id',async(req,res)=>{
    const {id} = req.params;
    await Track.findByIdAndDelete(id).then((track) => {
        if (!track) {
            return res.status(404).send({error:"not exists"});
        }
        res.status(200).send(track);
    }).catch((error) => {
        res.status(500).send(error);
    })
})

module.exports = router;