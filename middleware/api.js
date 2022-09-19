import { Shopify } from '@shopify/shopify-api';
import { Checkout } from '@shopify/shopify-api/dist/rest-resources/2022-07/index.js';

export function apiEndPoints(app) {
    app.post('/order/get', async (req, res) => {
        console.log('call order webhook');
        res.status(200).send({success: true});
    });
    app.post('/api/admin/checkout', async (req, res) => {
        const session = await Shopify.Utils.loadCurrentSession(req, res, false);
        if(!session) {
            res.status(401).send('Could not find session');
            return;
        }

        res.status(200).send({session});
    });
    
}