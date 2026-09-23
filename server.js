const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Mga middleware para makatanggap ng JSON, CORS, at i-serve ang static files (tulad ng index.html)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Storage para sa pinakabagong natanggap na GCash SMS
let latestPayment = null;

// Route para i-load ang index.html kapag binuksan ang pangunahing URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint kung saan nagpapadala ng HTTP POST request ang MacroDroid
app.post('/sms-webhook', (req, res) => {
    const { sender, message } = req.body;

    console.log('\n--- NAKATANGGAP NG BAGOING SMS ---');
    console.log(`Sender: ${sender}`);
    console.log(`Message: ${message}`);

    // Regex para makuha ang Halaga (Amount) at Ref No. mula sa text ng GCash
    const amountMatch = message ? message.match(/(?:PHP|Php|P)\s*([\d,]+\.\d{2})/) : null;
    const refMatch = message ? message.match(/(?:Ref\.\s*No\.|Ref\s*No\.|Ref:?)\s*(\d+)/i) : null;

    const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '')) : 0;
    const refNo = refMatch ? refMatch[1] : 'N/A';

    latestPayment = {
        sender: sender || 'GCash System',
        message: message,
        amount: amount,
        refNo: refNo,
        timestamp: new Date().toLocaleTimeString()
    };

    console.log(`✅ Processed GCash Payment: ₱${amount} | Ref: ${refNo}`);

    res.status(200).json({ status: 'success', message: 'SMS received successfully' });
});

// Endpoint na tinatawag ng HTML para i-check kung may bagong bayad
app.get('/latest-sms', (req, res) => {
    if (latestPayment) {
        const paymentData = { ...latestPayment };
        latestPayment = null; // I-reset pagkatapos makuha para hindi mag-duplicate ang alert
        return res.json(paymentData);
    }
    res.json(null);
});

// Simulan ang Server (Gumagamit ng process.env.PORT para sa Render)
app.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(`🚀 GCash SMS Bridge Server is running!`);
    console.log(`Listening on Port: ${PORT}`);
    console.log(`===========================================`);
});
