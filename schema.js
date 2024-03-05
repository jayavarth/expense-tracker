const mongoose=require('mongoose')//import
//to define schema  ->as mongodb is schema less we connect with compass and create schema for developers view
const expensetrackerschema=new mongoose.Schema({
    amount:{
        type:Number
    },
    category:{
        type:String
    },
    date:{
        type:String
    }
})

//with this db can be accessed
const Expense=mongoose.model('expensedetails',expensetrackerschema)//1->collection name 2->schema

module.exports={Expense}