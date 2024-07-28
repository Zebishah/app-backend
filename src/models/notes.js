let mongoose=require('mongoose')
let {Schema}=mongoose;
let notes_Schema=Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    title:{
    type:String,
    required:true
    },
    Description:{
        type:String,
        required:true,
       
        },
        tags:{
            type:String,
            default:"General"
            },
            date:{
                type:String,
                default:Date.now
                }
})
module.exports=mongoose.model('notes',notes_Schema);