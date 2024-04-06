const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { ObjectId } = require("mongodb");
// update User

router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res
      .status(403)
      .json("ID is Wrong, You can update only your account");
  }
});
// delete user

router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      //One way to delete user
      // const user = await User.deleteOne({ _id: new ObjectId(req.params.id) });
      //Another way to delete user
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  } else {
    return res
      .status(403)
      .json("ID is Wrong, You can delete only your account");
  }
});

// get a user

router.get("/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
// follow a user

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.id)) {
        await currentUser.updateOne({ $push: { following: req.params.id } });
        await user.updateOne({ $push: { followers: req.body.userId } });
        res.status(200).json("User have been followed");
      } else {
        res
          .status(200)
          .send(`You already followed User with id ${req.body.id}`);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).send("You can't follow yourself ");
  }
});
// unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).send("You successfully unfollowed user");
      } else {
        res.status(200).send("You never follow this user");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  } else {
    res.status(403).send("You can't Unfollow yourself");
  }
});

module.exports = router;