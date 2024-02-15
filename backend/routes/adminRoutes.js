const express = require('express')
const router =  express.Router()
const adminController = require('../controllers/adminController')

router.get('/getUsers',adminController.getUsers)
router.post('/adminAddUser',adminController.adminAddUser)
router.put('/adminEditUser',adminController.adminEditUser)
router.delete('/deleteUser/:userId',adminController.deleteUser)
router.get('/search',adminController.search)

module.exports = router