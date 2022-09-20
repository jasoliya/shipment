import express from 'express';
import https from 'https';

import cors from 'cors';

//dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

const isEmpty = (obj) => Object.keys(obj).length === 0;

app.get('/', async (req, res) => {
    console.log('ready to work');
    res.status(200).send('Welcome to shipment api');
});

app.post('/order/get', async (req, res) => {
    const order = req.body;

    console.log(order);

    if(isEmpty(order)) {
        res.status(401).send('Cannot get order data');
        return;
    }
    
    const postData = JSON.stringify({
        "references": [
            "348-16981",
        ]
    });

    const options = {
        hostname: 'inpostaradeski.mk',
        path: '/api/v1/list_shipments',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'SFMyNTY.g2gDYgAAAVxuBgBqUnRUgwFiAAFRgA.4y6kc1PZMhv1oTb0mt4Wxm0QN4ZCO9IWaszBaiT_74Y'
        }
    }
    const request = https.request(options, res => {
        res.on('data', d => {
            const result = JSON.parse(d.toString());
            
        });
    })
    request.on('error', error => {
        console.log(`Error: ${error}`);
    });
    request.write(postData);
    request.end();

    res.status(200).send({success: true});
});

app.listen(PORT, (err) => {
    if(err) {
        console.log('Error in server setup')
        return;
    }
    console.log('App listening on port', PORT);
});