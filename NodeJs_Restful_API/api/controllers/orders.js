const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = (req, res, next) => {
    /*res.status(200).json({
        message: 'Ready to Get your Orders!'
    });*/
    Order.find()
    .select("_id product quantity")
    .populate('product','name')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    product: doc.product,
                    quantiy: doc.quantity,
                    _id: doc._id,
                    request: {
                        type: "GET",
                        url: 'http://localhost:3000/orders/'+doc._id
                    }
                }
            })
        };
        //if(docs.length > 0){
            res.status(200).json(response);
        //} else {
        //    res.status(404).json({
        //        message:"No entries found"
        //    });
        //}
    }) 
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.orders_get_order = (req, res, next) => {
    Order.findById(req.params.oid)
    .select("_id quantity product")
    .populate('product')
    .exec()
    .then(order => {
        if(!order){
            return res.status(404).json({
                message: 'Order not found'
            })
        }
        res.status(200).json({
            order: order,
            request:{
                type: 'GET',
                url: 'http://localhost:3000/orders' 
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.orders_create_order = (req, res, next) => {
    /*const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: 'Order was created',
        order: order
    });*/

    Product.findById(req.body.productId)
    .then(product => {   
        if(!product){
            return res.status(404).json({
                message: "product not found"
            })
        } 
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order.save()
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Order Stored",
            createdOrder: {
                product: result.product,
                quantity: result.quantity,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/'+result._id
                }
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.orders_delete_orders = (req, res, next) => {
    Order.remove({_id: req.params.oid})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Order: ' + req.params.oid + ' is Deleted!',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders',
                body: { productId: 'ID', quantity: 'Number'}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}