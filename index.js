import express from 'express';
import dotenv from 'dotenv';
import { Shopify, LATEST_API_VERSION } from '@shopify/shopify-api';
import { apiEndPoints } from './middleware/api.js';

import cors from 'cors';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || `http://localhost:${PORT}/`;

Shopify.Context.initialize({
    API_KEY: process.env.SHOPIFY_API_KEY,
    API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
    SCOPES: process.env.SCOPES.split(','),
    HOST_NAME: HOST.replace(/https?:\/\//,''),
    HOST_SCHEME: HOST.split('://')[0],
    API_VERSION: LATEST_API_VERSION
});

apiEndPoints(app);

const isEmpty = (obj) => Object.keys(obj).length === 0;

app.post('/order/get', async (req, res) => {
    const order = req.body;
    if(isEmpty(order)) {
        res.status(401).send('Cannot get order data');
        return;
    }
    console.log(order.email);
    res.status(200).send({success: true});
});

app.listen(PORT, (err) => {
    if(err) {
        console.log('Error in server setup')
        return;
    }
    console.log('App listening on port', PORT);
});