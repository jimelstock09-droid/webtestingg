// Contoh menggunakan Node.js (Express) dan Axios
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Kunci Rahasia API Anda dari Dashboard Payment Gateway (Contoh Midtrans)
const SERVER_KEY = 'SB-Mid-server-xxxxxxxxxxxxxxxxx'; 
const AUTH_STRING = Buffer.from(SERVER_KEY + ':').toString('base64');

app.post('/buat-qris', async (req, res) => {
    try {
        // Data transaksi dari keranjang belanja pembeli
        const transactionData = {
            payment_type: "gopay", // Midtrans menggunakan 'gopay' untuk merender QRIS statis/dinamis
            transaction_details: {
                order_id: "INV-" + Math.floor(Math.random() * 100000), // ID unik
                gross_amount: 150000 // Harga Rp 150.000
            },
            customer_details: {
                first_name: "Budi",
                last_name: "Gamer",
                email: "budi@example.com"
            }
        };

        // Menembak API Payment Gateway (Midtrans Sandbox/Testing)
        const response = await axios.post(
            'https://api.sandbox.midtrans.com/v2/charge',
            transactionData,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${AUTH_STRING}`
                }
            }
        );

        // Mengembalikan URL QR Code atau Payload ke Frontend Anda
        res.json({
            status: "sukses",
            qris_url: response.data.actions[0].url // URL gambar QRIS dari Midtrans
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal membuat QRIS" });
    }
});

app.listen(3000, () => {
    console.log('Server berjalan di port 3000');
});