import express from 'express';
import https from 'https';

import cors from 'cors';

//dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

const isEmpty = (obj) => Object.keys(obj).length === 0;

app.post('/order/get', async (req, res) => {
    const order = req.body;

    if(isEmpty(order)) {
        res.status(401).send('Cannot get order data');
        return;
    }
    
    let postData = {},shipping_payment_method = 'И-Г';

    postData.receiver = {
        "name": `${order.shipping_address.name} Test`,
        "city": 'Штип',
        "phone_number": order.shipping_address.phone,
        "address": `${order.shipping_address.address1}${order.shipping_address.address2 ? ' '+order.shipping_address.address2 : ''}`
    };
    postData.package_value = order.subtotal_price;
    postData.number_packages = 1;
    postData.shipping_payment_method = shipping_payment_method;
    postData.shipment_cost = order.total_shipping_price_set.shop_money.amount;
    postData.order_number = order.name;

    if(order.note) postData.note = order.note || 'Note';

    const opt = {
        hostname: 'inpostaradeski.mk',
        path: '/api/v1/shipments',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'SFMyNTY.g2gDYgAAAVxuBgBqUnRUgwFiAAFRgA.4y6kc1PZMhv1oTb0mt4Wxm0QN4ZCO9IWaszBaiT_74Y'
        }
    }
    const httpReq = https.request(opt, httpRes => {
        httpRes.on('data', d => {
            const result = JSON.parse(d.toString());
            console.log('success ',result);
            res.status(200).send(result);
        });
    })
    httpReq.on('error', error => {
        console.log('error ',error);
        res.status(500).send(error);
    });
    httpReq.write(JSON.stringify(postData));
    httpReq.end();
});

app.listen(PORT, (err) => {
    if(err) {
        console.log('Error in server setup')
        return;
    }
    console.log('App listening on port', PORT);
});