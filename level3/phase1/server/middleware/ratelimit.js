import { redis } from "../index.js"


const rateLimitter=async (req,res,next)=>{
 const ip=req.ip
 const key=`rate_limit:${ip}`
 const requests=await redis.incr(key) 
 if(requests==1){
    await redis.expire(key,60)
 }
 if(requests>5){
    return res.status(429).json({message:"Too Many Requests"})
 }

 next()
}

export default rateLimitter