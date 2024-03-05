console.log("hi") 
//git clone <link>//to create a local host and to program and push them into repository we this command in git bash
//code . ->in terminal to open the folder in the vs code
//git add index.js (or)
//git add . ->to add files except .gitignore files
//git commit -m "basic setup"  ->to switch and view the code
//git push origin main

// to use ctrl+c to stop the loop execution of nodemon->Terminate batch job (Y/N)? y

/**for account switching (or) for login method
 * git config --global user.name ''
 * git config --global user.email ''
 */



/**
 * EXPENSE TRACKER
 * Adding a new expense/income :/add-expense ->post
 * displaying existing expenses:/get-expense ->get
 * editing existing enteries:/edit-expenses ->patch/put
 * deleting expenses :/delete-expenses ->delete
 * 
 * 
 * budget reporting
 * creating new user
 * validating user
 * 
 * defining schema
 * income/expense,category,amount,date(db attributes)
 * 
 */

const express = require('express')
const { default: mongoose } = require('mongoose')
const {Expense} =require('./schema.js')
const bodyparser=require('body-parser')
const cors=require('cors')


const app=express()
app.use(bodyparser.json())
app.use(cors())

async function connectToDb(){//should execute once after executing connecttodb all other are executed
    try{
        await mongoose.connect("mongodb+srv://Jayavardhinim14:jayvardh2004@cluster0.yxnqgbb.mongodb.net/Expense_tracker?retryWrites=true&w=majority&appName=Cluster0")
        //db name between / and ?  ->Expense_tracker
        console.log("DB connection established")
        //const x=process.env.PORT//to access the port that is available for a system ->when does not exist results in undefined 
        const port= process.env.PORT || 5000
        app.listen(port,function(){
        console.log(`listening to the port ${port}...`)
        })
    }catch(error){
        console.log(error)
        console.log("couldn't establish connection")
    }
}
//error handling->debugging,to have a normal flow
connectToDb()


// app.post('/add-expense',function(request,response){
//     console.log(request.body)
//     response.json({
//         "status":"created"
//     })
// })



//create/insert
// all are asynchronous so takes time to execute
// can use .then or by async and await 
app.post('/add-expense',async function(request,response){
   try{
    await Expense.create({//once after completion of this function other function are executed
        "amount" : request.body.amount,
        "category": request.body.category,
        "date":request.body.date
    })
    response.status(201).json({//201 for new entry
        "status":"success",
        "message":"new entry created"
    })
   }
   catch(error){
    console.log(error)
    response.status(201).json({
        "status":"failure",
        "message":"can't create new entry",
        "error":error//mostly internal server error occurs ->500
    })
   }
})


//Read
//Expense.find() is asynchronous function has certain delay 
app.get('/get-expense',async function(request,response){
    try{const expenses_data=await Expense.find()
        console.log(expenses_data)//results in undefined when async or await not used
        response.status(200).json(expenses_data)
    }catch(error){
        console.log(error)
        response.status(500).json({
            "status":"failure",
            "message":"could not fetch entries",
            "error":error
        })
    }
})

//delete
//localhost:8000/delete-expense/<params>
app.delete('/delete-expense/:id',async function(request,response){
    //console.log(request.params)//console.log(request.params.id)->to display the id which is removed
    try{
    const expense_delete= await Expense.findById(request.params.id)//to check whether the id is present in the db or collection
    console.log(expense_delete)//if not exist null
    if(expense_delete){
        await Expense.findByIdAndDelete(request.params.id)
        response.status(200).json({
            "status":"success",
            "message":"deleted entry"
        })
    }else{
        response.status(404).json({
            "status":"failure",
            "message":"could not find entry"
        })
    }
    }
    catch{
        console.log(error)
        response.status(500).json({
            "status":"failure",
            "message":"could not delete entry",
            "error":error
        })
    }

})

//update
app.patch('/edit-expense/:id',async function(request,response){
    //details ->request body,to be edited ->parameter
    try{
    const edit_id=await Expense.findById(request.params.id)
    if(edit_id){
        await edit_id.updateOne({//async function
            "amount": request.body.amount,
            "category": request.body.category,
            "date" :request.body.date
        })
        response.status(200).json({
            "status":"success",
            "message":"Updated entry"
        })
    }else{
        response.status(404).json({
            "status":"failure",
            "message":"could not find entry"
        })
    }
    }
    catch(error){
        console.log(error)
        response.status(500).json({
            "status":"failure",
            "message":"could not update entry",
            "error":error
        })
    }
})

//cors package to avoid cors error occurs in ui