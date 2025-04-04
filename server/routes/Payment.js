const express = require("express")
const router = express.Router()

const {
  capturePayment,
  verifyPayment,
  sendPaymentSuccessEmail,
  placeOrder,
  getShippingPrice,
  bulkOrder
} = require("../controllers/Payments")

const { auth} = require("../middlewares/auth")

router.post("/getShippingPrice", getShippingPrice)
router.post("/placeOrder", placeOrder)

router.post("/capturePayment",  capturePayment)
router.post("/verifyPayment",  verifyPayment)
router.post("/sendPaymentSuccessEmail",sendPaymentSuccessEmail)
router.post('/bulkOrder',bulkOrder)


// router.post("/verifySignature", verifySignature)

module.exports = router
