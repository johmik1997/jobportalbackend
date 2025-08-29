const moongose=require('mongoose')

const connectDb = async ()=>{
    try {
        await moongose.connect(process.env.DATABASE_URL)
    } catch (err) {
        console.log(err);
        
    }
}
module.exports=connectDb