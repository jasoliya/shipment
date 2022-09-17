import express from 'express';
import dotenv from 'dotenv';
import { Shopify, LATEST_API_VERSION } from '@shopify/shopify-api';
import { apiEndPoints } from './middleware/api.js';

dotenv.config();
const app = express();

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

app.listen(PORT, (err) => {
    if(err) {
        console.log('Error in server setup')
        return;
    }
    console.log('App listening on port', PORT);
});