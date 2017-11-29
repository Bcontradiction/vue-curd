/**
 * Created by Administrator on 2017/11/2.
 */
var mongoose = require('mongoose')
var shortid = require('shortid')
var Schema = mongoose.Schema
var UserSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    username: {
        type: String,
        require: String
    },
    name:{
      type:String,
    },
    password: {
        type: String
    },
    phone: {
        type: Number
    },
    email: {
        type: String
    },
    create_time: {
        type: Date,
        default: Date.now
    },
    is_active: {
        type: Boolean,
        default: false
    }
})
module.exports = mongoose.model('User', UserSchema)