/**
 * Created by Administrator on 2017/11/2.
 */
var mongoose = require('mongoose')
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/vue',{
    useMongoClient: true,
});

mongoose.connection.on("connected", function () {
    console.log("MongoDB connected success.")
});

mongoose.connection.on("error", function () {
    console.log("MongoDB connected fail.")
});

mongoose.connection.on("disconnected", function () {
    console.log("MongoDB connected disconnected.")
});
