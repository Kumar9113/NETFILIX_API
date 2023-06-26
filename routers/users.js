const router = require("express").Router();
const User = require("../models/User");

const verify = require("../verifyToken");
const bcrypt=require("bcrypt")


//UPDATE
router.put("/:id", verify, async (req, res) => {
    try{
        if (req.user.id === req.params.id || req.user.isAdmin){ 
            if (req.body.password) {
                  const salt = await bcrypt.genSalt(10);
                  
                  req.body.password = await bcrypt.hash(req.body.password, salt);
            }
        
            try {
              const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                  $set: req.body,
                },
                { new: true }
              );
              res.status(200).json(updatedUser);
            } catch (err) {
              res.status(500).send(err.message);
            }
          } else {
            res.status(403).json("You can update only your account!");
          }

    }catch(err)
    {
       res.send(err.message);
    }
 
});
//GET
router.delete("/:id", verify, async (req, res) => {
    if (req.user.id === req.params.id ||  req.user.isAdmin) {
      try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("You can delete only your account!");
    }
  });
//GET

router.get("/find/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { password, ...info } = user._doc;
      res.status(200).json(info);
    } catch (err) {
      res.status(500).json(err);
    }
  });
//GET ALL
router.get("/", verify, async (req, res) => {
    const query = req.query.new;
    if (req.user.isAdmin) {
      try {
        const users = query
          ? await User.find().sort({ _id: -1 }).limit(5)
          : await User.find();
        res.status(200).json(users);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("You are not allowed to see all users!");
    }
  });
//GET USER STATS
router.get("/stats", async (req, res) => {
    const today = new Date();
    const latYear = today.setFullYear(today.setFullYear() - 1);
  
    try {
      const data = await User.aggregate([
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

module.exports = router;