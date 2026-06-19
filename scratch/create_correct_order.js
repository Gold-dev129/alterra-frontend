async function run() {
    try {
        // First, let's try to delete the incorrect order from before if the server supports single delete
        console.log("Attempting to clean up the incorrect Polo order (ALT-352508)...");
        try {
            const deleteResponse = await fetch('https://alterra-node.onrender.com/api/orders/6a234f6aa4a5c8692fa85082', {
                method: 'DELETE'
            });
            console.log("Delete attempt response status:", deleteResponse.status);
        } catch (e) {
            console.log("Could not delete previous order (requires admin auth or route doesn't exist). That's fine, we will focus on creating the correct one.");
        }

        // Now, let's create the correct order
        const targetProductId = '6a11ad81f61ed2c75c2ce36c';
        const targetProductName = 'BROKEN SIGNALS TEE';
        const targetProductImage = 'https://res.cloudinary.com/dyn909lcp/image/upload/v1779548450/alterra/sy4wwuvc5zrinl95yzcc.jpg';

        const orderData = {
            items: [{
                product: targetProductId,
                name: targetProductName,
                price: 20000,
                quantity: 1,
                size: 'M',
                color: 'White',
                waist: '',
                image: targetProductImage,
                customNote: ''
            }],
            shippingDetails: {
                email: 'raphaelaghachi@gmail.com',
                firstName: 'Raphael',
                lastName: 'Aghachi',
                phone: '00000000000', // Placeholder
                deliveryMethod: 'delivery',
                address: 'Please contact customer for shipping address',
                city: 'Lagos',
                location: 'Lagos',
                zipCode: '',
                country: 'Nigeria'
            },
            subtotal: 20000,
            totalServiceFees: 1000,
            shipping: 0,
            total: 21000,
            paymentReference: 'PAYSTACK_MANUAL_TEE_' + Date.now()
        };

        console.log("Creating correct order for BROKEN SIGNALS TEE on backend...");
        const orderResponse = await fetch('https://alterra-node.onrender.com/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        const orderResult = await orderResponse.json();
        if (orderResponse.ok) {
            console.log("SUCCESS! Correct order created successfully. Order details:", orderResult.data.order);
        } else {
            console.error("Failed to create order:", orderResult);
        }

    } catch (err) {
        console.error("Error running script:", err);
    }
}

run();
