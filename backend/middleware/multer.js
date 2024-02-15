const multer =require ('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        // cb(null, path.join(__dirname, '../../front-end/public/profileImage'));
        cb(null,process.cwd()+ '/profileImage');    
    },
    filename: (req,file,cb)=>{
        cb(null,Date.now()+'-'+file.originalname)
    }
})

const uploads = multer ({storage})
module.exports = uploads