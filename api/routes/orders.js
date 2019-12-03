const express = require('express');
const router = express.Router();
const mongoose =require('mongoose');
const Order = require('../models/order');
const Product =require('../models/product');

// list all order
router.get('/',(req,res,nex)=>{
    Order.find()
    .select('_id quantity productId')
    .exec()
    .then(result=>{
        const order = result.map(item=>{
            return {
                _id:item._id,
                quantity:item.quantity,
                productId:item.productId
            }
        })
        res.status(200).json({
            success:true,
            totalOrder:result.length,
            orders:order
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })

    })
    
})

// create order
router.post('/',(req,res,nex)=>{
    Product.findById(req.body.productId)
    .then(result =>{
        if(!result){
           return  res.status(404).json({
                message:"Product not found !"
            })
        }
        const order = new Order({
            _id:mongoose.Types.ObjectId(),
            quantity:req.body.quantity,
            productId:req.body.productId
        })
        return  order.save()
    })
    .then(result=>{
        const orderDetail ={
            success:true,
            message:"order created successfully",
            orderDetails:{
                _id:result._id,
                quantity:result.quantity,
                productId:result.productId
            }
        }
        res.status(201).json(orderDetail)
    })
    .catch(err=>{
        res.status(500).json({
            error:{
                message:"product not found"
            }
        })
    })
  
})

// get order by id
router.get('/:orderId',(req,res,nex)=>{
    Order.findById(req.params.orderId)
    .exec()
    .then(result=>{
        if(!result){
            return res.status(404).json({
               message:"order not found",
               order:result
            })
        }
        res.status(200).json({
            order:result
        })
    })
    .catch(err => {
        res.status(500).json({
            error:err
        })
    })
})

//deleted order
router.delete('/:productId',(req,res,nex)=>{
    Order.remove({_id:req.params.orderId})
    .exec()
    .then(result => {
        res.status(200).json({
            message:"order deleted"
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})
module.exports = router;