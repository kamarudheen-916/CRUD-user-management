const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/multer')

router.post('/signup', upload.single('profile'),userController.signUp);
router.post('/login',userController.login) 
router.put('/resetPassword',userController.resetPassword)
router.put('/updateImage',upload.single('image'),userController.updateImage)


module.exports = router;
