const express = require("express")
const router = express.Router()

const {auth,isAdmin} = require("../middlewares/auth")
const{
    createCoupon,
    deactivateCoupon,
    getCoupon,
    getAllCoupons,
}=require("../controllers/Coupon")

router.post("/createCoupon",auth,isAdmin,createCoupon)
router.post("/deactivateCoupon",auth,isAdmin,deactivateCoupon)
router.post("/getCoupon",getCoupon)
router.post("/getAllCoupons",getAllCoupons)

module.exports=router