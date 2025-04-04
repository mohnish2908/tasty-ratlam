const Product = require("../models/Product")
const RatingAndReview = require("../models/RatingAndReview")  
const ComboProduct = require("../models/ComboProduct")

// Create a new rating and review
exports.createRating = async (req, res) => {
    try {
        const { productId, rating,title, review,comboProductId,name } = req.body
        console.log(req.body)
        if ( !rating || !review|| !title) {
        return res.status(400).json({ error: "productId, rating, and review are required" })
        }
        console.log(1)
        let newRating;
        console.log(2)
        if(productId){
             newRating = new RatingAndReview({
                product: productId,
                rating,
                title,
                review,
                name
            })
        }
        
        else{
             newRating = new RatingAndReview({
                comboProduct: comboProductId,
                rating,
                title,
                review,
                name
            })
        }
        if(productId){
            await Product.findByIdAndUpdate(productId, {
                $push:{
                    ratings:newRating
                }
            })
        }
        else{
            await ComboProduct.findByIdAndUpdate(comboProductId, {
                $push:{
                    ratings:newRating
                }
            })
        }
        console.log(3)
        console.log("aa",newRating)
        await newRating.save()
        console.log(4)
        res.status(201).json({ message: "Rating and review added successfully" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

exports.getAllRatingReview = async (req, res) => {
    try {
        // const {productId,comboProductId} = req.body
        const allReviews = await RatingAndReview.find({})
        .sort({ rating: "desc" }).populate("product").populate("comboProduct")
        res.status(200).json({ data: allReviews })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}