var mongoose= require('mongoose');

var CommentSchema = new mongoose.Schema({
	body: String,
	author: String,
	upvotes: {type: Number, default: 0},
	post:{ type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
});


CommentSchema.methods.upvote = function(tb){
	this.upvotes ++;
	this.save(tb);
};

mongoose.model('Comment', CommentSchema);