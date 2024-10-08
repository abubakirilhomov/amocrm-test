const prepareService = require('../services/clickPrepService')

exports.preparePayment = async (req, res) => {
    try {
        const { click_trans_id, service_id, merchant_trans_id, amount, action, sign_time, sign_string } = req.body;
        
        const result = await prepareService.preparePayment({    
            click_trans_id, service_id, merchant_trans_id, amount, action, sign_time, amount, sign_string
        });

        if (result.error) {
            return res.status(404).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: -3, error_note: 'Server error' });
    }
};