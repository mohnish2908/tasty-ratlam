const express = require("express")
const router = express.Router()
const{auth,isAdmin}=require("../middlewares/auth")
const{
    getOrder,
    getOrderByUserId,
    updateOrder,
    getOrderById,
    getOrderByContactNumber
}=require("../controllers/Order")

router.post('/getOrder',getOrder)
router.post('/getOrderByUserId',getOrderByUserId)
router.post('/updateOrder',auth,isAdmin,updateOrder)
router.post('/getOrderById',getOrderById)
router.post('/getOrderByContactNumber',getOrderByContactNumber)



module.exports=router