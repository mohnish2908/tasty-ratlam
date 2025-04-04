exports.orderPlacedEmail = (orderId, firstName, lastName, contactNumber, email, address, city, state, pincode, products) => {
    

    return `
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
            .container { max-width: 600px; margin: 0 auto; text-align: center; }
            .logo { max-width: 200px; margin-bottom: 20px; }
            .message { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
            .body { text-align: left; margin-bottom: 20px; }
            .highlight { font-weight: bold; }
            .support { font-size: 14px; color: #999; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <img src="https://i.ibb.co/YQn4j0K/Tasty-Ratlam-Logo.png" alt="Tasty Ratlam Logo" class="logo">
            <div class="message">New Order Placed</div>
            <div class="body">
                <p>Order ID: <b>${orderId}</b></p>
                <p><b>Customer:</b> ${firstName} ${lastName}</p>
                <p><b>Contact:</b> ${contactNumber}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Address:</b> ${address}, ${city}, ${state}, ${pincode}</p>
                
               
            </div>
            <div class="support">Please process the order promptly.</div>
        </div>
    </body>
    </html>`;
};