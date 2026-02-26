const express = require('express');
const axios = require('axios');
const router = express.Router();

const CASHFREE_API_BASE = "https://sandbox.cashfree.com/pg";
const CASHFREE_API_VERSION = "2023-08-01";

router.post("/create-qr", async (req, res) => {
    try {
        const amount = Number(req.body.amount);

        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({ message: "Enter a valid amount greater than 0" });
        }

        const linkId = `rcb_ticket_${Date.now()}`;
        const payload = {
            link_id: linkId,
            link_amount: Number(amount.toFixed(2)),
            link_currency: "INR",
            link_purpose: "RCB Match Ticket",
            customer_details: {
                customer_name: "RCB Fan",
                customer_email: "fan@rcb.com",
                customer_phone: "9999999999"
            }
        };

        const cfResponse = await axios.post(`${CASHFREE_API_BASE}/links`, payload, {
            headers: {
                "Content-Type": "application/json",
                "x-api-version": CASHFREE_API_VERSION,
                "x-client-id": process.env.CF_APP_ID,
                "x-client-secret": process.env.CF_SECRET_KEY
            }
        });

        res.json({
            success: true,
            linkId: cfResponse.data.link_id,
            paymentLink: cfResponse.data.link_url,
            qrCode: cfResponse.data.link_qrcode
        });
    } catch (error) {
        console.error("Cashfree Error:", error.response?.data || error.message);
        res.status(500).json({
            message: "Failed to create payment QR",
            details: error.response?.data
        });
    }
});

module.exports = router;
