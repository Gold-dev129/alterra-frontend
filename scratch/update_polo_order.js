async function run() {
    try {
        const orderId = '6a234f6aa4a5c8692fa85082';
        console.log("Attempting to update the Polo order email to prevent Raphael from seeing it...");

        // Try updating the order details (changing email to a trash/placeholder email)
        const response = await fetch(`https://alterra-node.onrender.com/api/orders/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                guestEmail: 'trash-polo-test@alterrastudio.com',
                shippingDetails: {
                    email: 'trash-polo-test@alterrastudio.com',
                    firstName: 'Raphael',
                    lastName: 'Aghachi',
                    phone: '00000000000',
                    deliveryMethod: 'delivery',
                    address: 'Removed - Incorrect Order',
                    city: 'Lagos',
                    zipCode: '',
                    country: 'Nigeria'
                }
            })
        });

        console.log("Update status:", response.status);
        const result = await response.json();
        console.log("Response data:", result);
    } catch (e) {
        console.error("Error during update:", e);
    }
}

run();
