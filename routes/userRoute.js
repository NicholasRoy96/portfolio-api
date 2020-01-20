const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

// Create user routes
router.post('/create', userController.createUser)

// Get user routes
router.get('/get/:id', userController.getUser)
router.get('/getAll', userController.getAllUsers)

// Update user routes
router.put('/update/:id', userController.updateUser)

// Delete user routes
router.delete('/delete/:id', userController.deleteUser)

module.exports = router
