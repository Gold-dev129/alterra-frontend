async function run() {
    try {
        console.log("Fetching products to find 'BROKEN SIGNALS TEE'...");
        const prodResponse = await fetch('https://alterra-node.onrender.com/api/products');
        const prodData = await prodResponse.json();
        
        if (!prodResponse.ok) {
            console.error("Failed to fetch products:", prodData);
            return;
        }

        const products = prodData.data.products;
        const targetProduct = products.find(p => p.name.toUpperCase().includes("BROKEN SIGNALS"));
        
        if (!targetProduct) {
            console.error("Could not find product containing 'BROKEN SIGNALS'. Found products:", products.map(p => p.name));
            return;
        }

        console.log("Found Product:", targetProduct.name, "ID:", targetProduct._id);

        const orderData = {
            items: [{
                product: targetProduct._id,
                name: targetProduct.name,
                price: 20000,
                quantity: 1,
                size: 'M',
                color: 'White',
                waist: '',
                image: targetProduct.images?.[0] || targetProduct.image || '/placeholder.png',
                customNote: ''
            }],
            shippingDetails: {
                email: 'raphaelaghachi@gmail.com',
                firstName: 'Raphael',
                lastName: 'Aghachi',
                phone: '00000000000', // Placeholder phone since we don't have it
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
            paymentReference: 'PAYSTACK_MANUAL_' + Date.now()
        };

        console.log("Creating order on backend...");
        const orderResponse = await fetch('https://alterra-node.onrender.com/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        const orderResult = await orderResponse.json();
        if (orderResponse.ok) {
            console.log("SUCCESS! Order created successfully. Order details:", orderResult.data.order);
        } else {
            console.error("Failed to create order:", orderResult);
        }

    } catch (err) {
        console.error("Error running script:", err);
    }
}

run();
