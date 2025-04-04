import { toast } from "react-hot-toast";
import { clientEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/rzpLogo.png"
import { setPaymentLoading } from "../../slices/cartSlice";
// import { resetCart } from "../../slices/cartSlice";

const {PAYMENT_API,PAYMENT_VERIFY_API,SEND_PAYMENT_SUCCESS_EMAIL_API}=clientEndpoints

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }
        script.onerror= () =>{
            resolve(false);
        }
        document.body.appendChild(script);
    })
}

export async function buyProduct(formData,navigate,dispatch){
    const toastId=toast.loading('loading...')
    try{
        const res=await loadScript("https://checkout.razorpay.com/v1/checkout.js")

        if(!res){
            toast.error("razorpay sdk failed to load")
            return;
        }

        const orderResponse=await apiConnector("POST",PAYMENT_API,formData);

        if(!orderResponse.data.success) {
            throw new Error(orderResponse.data.message);
        }

        console.log("PRINTING orderResponse", orderResponse);
        console.log("order id", orderResponse.data.orderId);
        const orderID=orderResponse.data.orderId;
        const option={
            key:process.env.RAZORPAY_KEY,
            currency:orderResponse.data.data.currency,
            amount:`${orderResponse.data.data.amount}`,
            order_id:orderResponse.data.data.id,
            name:"Tasty Ratlam",
            description:"Thank you for Purchasing the product",
            image:rzpLogo,
            prefill:{
                name:`${formData.firstName}` || "John Doe",
                email:formData.email|| "tempmail@gmail.com"
            },
            handler: function  async (response) {
                //send successful wala mail
                console.log("PRINTING RESPONSE", response);
                
                sendPaymentSuccessEmail(response, orderResponse.data.data.amount, formData);
                
                //verifyPayment
                verifyPayment({ ...response, orderID }, navigate, dispatch);
            }
        }
        const paymentObject=new window.Razorpay(option);
        paymentObject.open();
        paymentObject.on("payment.failed", function(response) {
            toast.error("oops, payment failed");
            console.log(response.error);
        })
    }
    catch(error){
        console.log("PAYMENT API ERROR.....", error);
        toast.error("Could not make Payment");
    }
    toast.dismiss(toastId);
}

async function verifyPayment(bodyData,navigate,dispatch){
    console.log("VERIFY PAYMENT", bodyData);
    const toastId = toast.loading("Verifying Payment....");
    dispatch(setPaymentLoading(true));
    try{
        const response=await apiConnector("POST",PAYMENT_VERIFY_API,bodyData);

        if(!response.data.success){
            throw new Error(response.data.message)
        }
        toast.success("payment sucessfull, thank you for purchasing")
        navigate('/')
    }
    catch(error){
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}

async function sendPaymentSuccessEmail(response, amount,formData) {
    try {
        const emailResponse = await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            amount: amount,
            formData,
        });

        if (!emailResponse.data.success) {
            throw new Error(emailResponse.data.message);
        }

        console.log("Email sent successfully", emailResponse);
    } catch (error) {
        console.log("Error sending payment success email", error);
        toast.error("Could not send payment success email");
    }
}

