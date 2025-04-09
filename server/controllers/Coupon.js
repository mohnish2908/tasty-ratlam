const Coupon = require("../models/Coupon");

exports.createCoupon = async (req, res) => {
    try{
        const { code, discountPercentage, condition, description } = req.body;
        // const {newCoupon}=req.body; 
        console.log("req.body",req.body);
        // const code=newCoupon.code.toLowerCase();
        // const discountPercentage=newCoupon.discountPercentage;
        // const condition=newCoupon.condition;    
        // const description=newCoupon.description;
        const existingCoupon = await Coupon.findOne({ code: code.toLowerCase() });
        // console.log(1)
        if (existingCoupon) {
            return res.status(400).json({ error: "Coupon code already exists." });
        }
        // console.log(2)
        // code=code.toLowerCase();
        // console.log(3)
        if(!code||!discountPercentage||!condition||!description){
            return res.status(400).json({ error: "Please provide all the required fields." });
        }
        // console.log(4)  
        const coupon = await Coupon.create({ code:code.toLowerCase(), discountPercentage, condition, description });
        // console.log(5)
        // console.log(coupon);
        return res.status(201).json({ success: true, data: coupon,message:"Coupon created successfully" });
    }
    catch{
        return res.status(500).json({ error: "Unable to create Coupon." });
    }
}

exports.deactivateCoupon = async (req, res) => {
    try{
        const { id } = req.body;
        console.log("id",id);
        if(!id){
            return res.status(400).json({ error: "Please provide the coupon code." });
        }
        // console.log(0)
        const coupon = await Coupon.findById(id);
        // console.log(1)
        if(!coupon){
            return res.status(404).json({ error: "Coupon not found." });
        }
        coupon.status === "inactive"?coupon.status="active":coupon.status="inactive";
        await coupon.save();
        return res.status(200).json({ success: true, message: "Coupon deactivated successfully." });
    }
    catch{
        return res.status(500).json({ error: "Unable to deactivate Coupon." });
    }
}

exports.getCoupon = async (req, res) => {
    try{
        let { code } = req.body;
        code=code.toLowerCase();
        console.log("code",code);   
        if(!code){
            return res.status(400).json({ error: "Please provide the coupon code." });
        }
        const coupon = await Coupon.findOne({ code });
        // console.log(coupon);
        if(!coupon){
            return res.status(404).json({ error: "Coupon not found." });
        }
        return res.status(200).json({ success: true, data: coupon });
    }
    catch{
        return res.status(500).json({ error: "Unable to get Coupon." });
    }    
}   

exports.getAllCoupons = async (req, res) => {
    try{
        const coupons = await Coupon.find();
        return res.status(200).json({ success: true, data: coupons });
    }
    catch{
        return res.status(500).json({ error: "Unable to get Coupons." });
    }
}