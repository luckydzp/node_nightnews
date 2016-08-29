/**
 * Created by daizhipeng on 2016/8/26.
 */
var mongoose = require('mongoose');
/*{
 "name" : "user",
 "id" : 100
 }*/
var IncUseridSchema = new mongoose.Schema({
    name: {type: String, default: 'user'},
    id: {type: Number, default: 100}

});

var IncUserId = mongoose.model('IncUserid', IncUseridSchema);
