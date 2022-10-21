import fs from 'fs';
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
    //let order = fs.readFileSync('sample-order.json');
    //order = JSON.parse(order.toString());
    let city = fs.readFileSync('city.json');
    city = JSON.parse(city.toString());
    
    if(isEmpty(order)) return res.status(200).send('Cannot get order data');
    if(!order.tags) return res.status(200).send('Declined');
    const tags = order.tags.toLowerCase().split(', ');
    let apiToken = null;
    if(tags.includes('zdravko')) apiToken = 'SFMyNTY.g2gDYgAAAVxuBgBqUnRUgwFiAAFRgA.4y6kc1PZMhv1oTb0mt4Wxm0QN4ZCO9IWaszBaiT_74Y';
    if(tags.includes('muppet')) apiToken = 'SFMyNTY.g2gDYgAABkRuBgC7eelpgwFiAAFRgA.95slglj5zg_kxToaK6EiCfxA_dodx7LRcUoHFuI_P1A';
    if(!apiToken) return res.status(200).send('Shipment not found');

    let postData = {}, shipping_payment_method;
    const shippingAmount = parseInt(order.total_shipping_price_set.shop_money.amount);
    
    if(tags.includes('zdravko')) shipping_payment_method = shippingAmount > 0 ? 'П-Г' : 'И-Г';
    if(tags.includes('muppet'))  shipping_payment_method = shippingAmount > 0 ? 'П-Ф' : 'И-Ф';
    if(tags.includes('muppet'))  shipping_payment_method = order.financial_status == 'paid' ? 'И-Ф' : shipping_payment_method;

    let city_name = order.shipping_address.city;

    if(Object.values(city).indexOf(city_name) === -1) {
        city_name = city[city_name.toLowerCase()];
        if(typeof city_name === 'undefined') return res.status(200).send(`Shipment isn't available for your city`);
    }

    postData.receiver = {
        "name": order.shipping_address.name,
        "city": city_name,
        "phone_number": order.shipping_address.phone,
        "address": `${order.shipping_address.address1}${order.shipping_address.address2 ? ' '+order.shipping_address.address2 : ''}`
    };

    let subtotal_price = (typeof order.current_subtotal_price === 'undefined') ? order.subtotal_price : order.current_subtotal_price;
    let package_value = order.financial_status === 'paid' ? "0" : subtotal_price;

    postData.package_value = package_value;
    postData.number_packages = 1;
    postData.shipping_payment_method = shipping_payment_method;
    postData.shipment_cost = "130";
    postData.order_number = order.name;

    //if(order.note) postData.note = order.note || 'Note';

    const opt = {
        hostname: 'inpostaradeski.mk',
        path: '/api/v1/shipments',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': apiToken
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
        res.status(200).send(error);
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