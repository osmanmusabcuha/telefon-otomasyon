const fetch = require('node-fetch');

const getModelsByBrand = async (req, res) => {
    const { brandId } = req.params;

    try {
        const response = await fetch(
            `https://parseapi.back4app.com/classes/Dataset_Cell_Phones_Model_Brand?limit=100&where=${encodeURIComponent(JSON.stringify({
                "Cell_Phone_Brand": {
                    "__type": "Pointer",
                    "className": "Cell_Phone_Models_By_Brand",
                    "objectId": brandId
                }
            }))}`,
            {
                headers: {
                    'X-Parse-Application-Id': 'MEqvn3N742oOXsF33z6BFeezRkW8zXXh4nIwOQUT',
                    'X-Parse-Master-Key': 'uZ1r1iHnOQr5K4WggIibVczBZSPpWfYbSRpD6INw',
                }
            }
        );

        const data = await response.json();
        const models = data.results.map(item => ({
            model_name: item.Cell_Phone_Model,
            slug: item.objectId
        }));

        res.json({ success: true, data: { phones: models } });
    } catch (error) {
        console.error('❌ Model verisi hatası:', error.message);
        res.status(500).json({ message: 'Model API hatası', error: error.message });
    }
};
const getBrands = async (req, res) => {
    try {
        const where = encodeURIComponent(JSON.stringify({
            "Cell_Phone_Brand": { "$exists": true }
        }));

        const response = await fetch(
            `https://parseapi.back4app.com/classes/Cell_Phone_Models_By_Brand?limit=100&order=Cell_Phone_Brand&where=${where}`,
            {
                headers: {
                    'X-Parse-Application-Id': 'MEqvn3N742oOXsF33z6BFeezRkW8zXXh4nIwOQUT',
                    'X-Parse-Master-Key': 'uZ1r1iHnOQr5K4WggIibVczBZSPpWfYbSRpD6INw',
                },
            }
        );

        const data = await response.json();

        const brands = data.results?.map(item => ({
            brand_name: item.Cell_Phone_Brand,
            brand_id: item.objectId,
        })) || [];

        res.json({ success: true, data: brands });
    } catch (error) {
        console.error('❌ Marka API hatası:', error.message);
        res.status(500).json({ message: 'Marka API hatası', error: error.message });
    }
};


module.exports = {
    getBrands,
    getModelsByBrand
};
