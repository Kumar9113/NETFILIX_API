const router=require("express").Router()
const User =require("../models/User")
const bcrypt =require("bcrypt");
const jwt =require("jsonwebtoken")



const generateToken = (id,isAdmin) => {
  return jwt.sign({id,isAdmin},"eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ", {
    expiresIn: "30d",
  });
};
router.post("/register", async (req, res) => {
    const {username,email,password,isAdmin}=req.body;
    const user=await User.findOne({email});
    
    
    if(user)
    {
        return res.json("user already exist");
    }
   let newUser;
   try
   {
    newUser=await User.create( {
        username,
        email,
        password,
        isAdmin
    })
    
    

   }
   catch(err)
   {
    return res.status(500).send(err.message);
   } 
   return await res.status(201).json(newUser)
})



router.post("/login", async (req, res) => {
    
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email});

      if(!user)
      {
        res.status(401).json("Wrong password or username!");
      }
      
      else if(user&& await user.matchPassword(password))
      {
         const accessToken =await generateToken(user._id,user.isAdmin);
           
        // const token=await User.token(user.id);
      
        res.status(200).json({user,accessToken});

      }
      else
       {
           return res.send("Incorrcet possword")
       }
    
     
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  
  
module.exports=router;