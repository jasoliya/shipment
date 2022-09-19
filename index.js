import express from 'express';
import dotenv from 'dotenv';
import { Shopify, LATEST_API_VERSION } from '@shopify/shopify-api';
import { apiEndPoints } from './middleware/api.js';
import { storeFrontEndPoints } from './middleware/storefront-api.js';

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

storeFrontEndPoints(app);
apiEndPoints(app);

app.listen(PORT, (err) => {
    if(err) {
        console.log('Error in server setup')
        return;
    }
    console.log('App listening on port', PORT);
});