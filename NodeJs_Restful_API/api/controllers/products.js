const mongoose = require('mongoose');
const Product = require('../models/product');  

exports.products_get_all = (req, res, next) => {
    Product.find()
    .select("name price _id productImage")
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: "GET",
                        url: 'http://localhost:3000/products/'+doc._id
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

    /*res.status(200).json({
        message: 'Handling GET requests to /products'
    });*/
}

exports.products_get_product = (req, res, next) => {
    const id = req.params.pid;
    Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then(doc => {
            console.log(doc);
            if(doc){
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/products"
                    }
                });
            } else {
                res.status(404).json({message: "No Valid entry found for provided ID"});
            }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error: err}); 
    });

    /*if( id === 'special'){
        res.status(200).json({
            message: 'You discovered a special ID'
        });
    } else {
        res.status(200).json({
            message: `You passsed an ID ` + id 
        });
    }*/
}

exports.products_create_product =  (req, res, next) => {
    console.log(req.file);
    const product = new Product(
        {
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created product successfully',
            createdProduct : {
                name: result.name,
                price: result.price,
                _id: result.id,
                request: {
                    type: "POST",
                    url: 'http://localhost:3000/products/'+result._id
                }
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

exports.products_patch_product = (req, res, next) => {
    const id = req.params.pid;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    //in body => [{"propName": "price","value": "50"}]
    Product.update({_id:id}, {
        $set: updateOps
    })
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Product updated',
            request:{
                type: 'GET',
                url: 'http://localhost:3000/products/'+id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
    ;

    /*res.status(200).json({
        message: 'Updated products!'
    });*/
}

exports.products_delete_product = (req, res, next) => {
    const id = req.params.pid;
    Product.remove({_id:id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product Deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products',
                body: { name: 'String', price: 'Number'}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
    /*res.status(200).json({
        message: 'Deleted product!'
    });*/
}