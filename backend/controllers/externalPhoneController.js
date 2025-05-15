// controllers/externalPhoneController.js
const fetch = require('node-fetch');

const getAllBrandModels = async (req, res) => {
    try {
        const where = encodeURIComponent(JSON.stringify({ "Model": { "$exists": true } }));
        const url = `https://parseapi.back4app.com/classes/Dataset_Cell_Phones_Model_Brand?limit=10000&order=Brand&where=${where}`;
        const response = await fetch(url, {
            headers: {
                'X-Parse-Application-Id': 'MEqvn3N742oOXsF33z6BFeezRkW8zXXh4nIwOQUT',
                'X-Parse-Master-Key': 'uZ1r1iHnOQr5K4WggIibVczBZSPpWfYbSRpD6INw'
            }
        });
        const data = await response.json();
        res.json({ success: true, data: data.results });
    } catch (err) {
        console.error("Model veri hatası:", err);
        res.status(500).json({ success: false, message: "Veri alınamadı" });
    }
};

module.exports = { getAllBrandModels };
