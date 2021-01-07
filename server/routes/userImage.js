const router = require('express').Router()
const fs = require('fs')
const path = require('path')
const UserImage = require('../model/UserImage.js')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const verify = require('./verifyToken.js')
const User = require('../model/User.js')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'file-to-upload')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
  }
});

const upload = multer({ storage: storage });

router.get('/', verify, async(req, res) => {
  const verified = jwt.verify(req.header('auth-token'), process.env.TOKEN_SECRET)
  req.user = verified
  console.log(verified)
  const user = await User.findOne({ _id: verified._id })
  console.log(user)
  const userPic = await UserImage.find({ userID: verified._id })
  try {
    res.status(200).send(userPic)
  } catch (error) {
    res.status(400).send(error)
  }
})

// upload image
router.post('/', upload.single('image-to-upload'), async(req, res) => {
  const verified = jwt.verify(req.header('auth-token'), process.env.TOKEN_SECRET)
  req.user = verified
  console.log(verified)
  const user = await User.findOne({_id: verified._id})
  console.log(user)
  console.log(req.files)
  // const userImg = new UserImage({
  //   userID: user._id,
  //   img: {
  //       data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
  //       contentType: 'image/png'
  //   }
  // })
  // try {
  //   const hasUser = await UserImage.findOne({userID: user._id})
  //   if(hasUser) UserImage.replaceOne(
  //     {userID: user._id},
  //     {
  //       userID: user._id,
  //       img: {
  //         data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
  //         contentType: 'image/png'
  //       }
  //     },
  //     null,
  //     (err) => {
  //       if(err) {
  //         res.status(400).send(err)
  //       } else {
  //         res.status(200).send(`image changed`)
  //       }
  //     })
  //   else {
  //     const savedImage = await userImg.save()
  //     res.send(savedImage)
  //   }
  // } catch (error) {
  //   res.status(404).send(error)
  // }
  
})


// router.post('/', verify, async(req, res) => {
//   const verified = jwt.verify(req.header('auth-token'), process.env.TOKEN_SECRET)
//   req.user = verified
//   console.log(verified)
//   const user = await User.findOne({_id: verified._id})
//   console.log(user)
//   console.log(req)
//   const userImg = new UserImage({
//     userID: user._id,
//     img: req.body.img
//   })
//   try {
//     const hasUser = await UserImage.findOne({userID: user._id})
//     if(hasUser) UserImage.replaceOne(
//       {userID: user._id},
//       {
//         userID: user._id,
//         img: req.body.img
//       },
//       null,
//       (err) => {
//         if(err) {
//           res.status(400).send(err)
//         } else {
//           res.status(200).send(`image changed`)
//         }
//       })
//     else {
//       const savedImage = await userImg.save()
//       res.send(savedImage)
//     }
//   } catch (error) {
//     res.status(404).send(error)
//   }
  
// })

module.exports = router
