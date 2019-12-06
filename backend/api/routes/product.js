
const express = require('express');
const router = express.Router();
const Product = require('../models/product')
const mongoose =require('mongoose');


// get all product

router.get('/',(req,res,nex)=>{
    Product.find()
    .select('_id name price')
    .exec()
    .then(result =>{
        const response={
            products:result,
            counts:result.length
        }
        if(result){
            res.status(200).json(response);
        }else{
            res.status(200).json({
                message:"list is empty"
            })
        }
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })

})

// create new product
router.post('/',(req,res,nex)=>{
    const product =new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price,
        userId:req.body.userId

    });

    product.save()
    .then(result =>{
            res.status(201).json({
            message:"product addedd successfully",
            success:true,    
            createdProduct:{
                name:result.name,
                _id:result._id,
                price:result.price,
                userId:result.userId    
            }
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
   
})

// get product by id
router.get('/:productId',(req,res,nex)=>{
    const id = req.params.productId;
    Product.findById(id)
    .select('_id name price')
    .exec()
    .then(result =>{
        const response = {
            success:true,
            product:result
        }
        if(result){
            res.status(200).json(response)
            console.log(result)
        }else{
            res.status(404).json({
                message:"invalid id"
            })
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err 
        }) 
    })
})

// update product by id
router.patch('/:productId',(req,res,nex)=>{
    const id = req.params.productId;
    Product.updateOne({_id:id},{name:req.body.name,price:req.body.price})
    .exec()
    .then(result=>{
        res.status(200).json({result})
    })
    .catch(err)
    res.status(500).json({
        error:err
    })
})

// delete product by id
router.delete('/:productId',(req,res,nex)=>{
    const id = req.params.productId;
    Product.remove({_id:id})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:"product deleted"
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})
module.exports = router;