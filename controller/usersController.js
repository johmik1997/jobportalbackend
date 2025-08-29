const User=require('../Models/User')
const Job=require('../Models/Job')
const asyncHandler=require('express-async-handler')
const bcrypt=require('bcrypt')


// get all users
//@route GET /users
// @acess private

const getAllUsers=asyncHandler(async(req,res)=>{
    const users=await User.find().select('-password').lean()
    if(!users?.length){
        return res.status(400).json({
            message:'no users found'
        })
    }
    else{
        res.status(200).json({
            users
        })
    }
}
)

// create new user
//@route POST /users
// @acess private

const createNewUsers=asyncHandler(async(req,res)=>{
    const {username,password,roles}=req.body

    if(!username || !password || !Array.isArray(roles) || !roles.length){
     return   res.status(400).json({
            message:"All fields are requred"
        })
}
const duplicate = await User.findOne({username}).lean().exec()
    if(duplicate){
        return res.status(400).json({
            message:"Duplicate username"
        })
    }
const hashedPassword= await bcrypt.hash(password,10)
const userObject= {username,"password":hashedPassword,roles}
const result = await User.create(userObject)
if (result) {
    res.status(200).json({
        message:`New user ${username} created`
    })
    
}
else{
    res.status(400).json({message:'Invalid user data recived'})
}
})

// update a user
//@route PATCH /users
// @acess private

const updateUser= asyncHandler(async(req,res)=>{
    
     const {id,username,password,roles,activeStatus}=req.body
if(!id || !username || !password || !Array.isArray(roles) || !roles.length|| typeof activeStatus !==Boolean){
     return   res.status(400).json({
            message:"All fields are requred"
        })
}

const user= await User.findById(id).exec()
if(!user){
    return res.status(400).json({
            message:"user not found"
        })
}

const duplicate= await User.findById({username}).lean().exec()

if(duplicate&&duplicate._id!==id.toString()){
     return res.status(400).json({
            message:"Duplicate username"
        })
}

user.username=username,
user.activeStatus=activeStatus
user.roles=roles

if(password){
    user.password=await bcrypt.hash(password,10)
}
const updatedUser= await user.save()

res.json({
    message:`${updateUser.username} updated successfully`
})
})

// delete a user
//@route DELETE /users
// @acess private

const deleteUser=asyncHandler(async(req,res)=>{
    const {id} = req.body

    if(!id){
        return res.status(400).json({
            message:"the userId is required"
        })
    }

  const jobs = await Job.find({ user: id }).lean().exec();
if (jobs.length > 0) {
    return res.status(400).json({
        message: `User has ${jobs.length} assigned jobs`
    });
}


    const user =await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({
            message:"user not found"
        })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with Id ${result._id} deleted sucessfully`

    res.json(reply)
})



module.exports={
    getAllUsers,
    createNewUsers,
    updateUser,
    deleteUser
}
