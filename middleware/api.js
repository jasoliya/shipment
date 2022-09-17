import { Shopify } from '@shopify/shopify-api';
import { Checkout } from '@shopify/shopify-api/dist/rest-resources/2022-07/index.js';

export function apiEndPoints(app) {
    app.post('/bundle/add', async (req, res) => {
        const session = await Shopify.Utils.loadCurrentSession(req, res, false);
        res.status(200).send({success: session});
    });
}