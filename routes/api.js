var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

router.get('/', function(req,res,next){
	Post.find(function(err, posts){
		if (err) {return (err); }

		res.json(posts);
	});
});

router.post('/', function(req,res,next){
	var post = new Post(req.body);

	post.save(function(err, post){
		if (err) {return (err); }

		res.json(post);
	});
});

router.param('post', function(req,res,next,id){
	var query = Post.findById(id);

	query.exec(function(err,post){
		if (err) {return (err); }
		if (!post) {return next(new Error("can't find post"));}

		req.post = post;
		return next();
	});
});

router.param('comment', function(req,res,next,id){
	var query = Comment.findById(id);

	query.exec(function(err,comment){
		if (err) {return (err); }
		if (!comment) {return next(new Error("can't find comment"));}

		req.comment = comment;
		return next();
	});
});

router.get('/:post', function(req,res, next){
	req.post.populate('comments', function(err, post){

		res.json(post);
	});
});

router.put('/:post/upvote', function(req,res,next){
	req.post.upvote(function(err,post){
		if (err) {return next(err); }

		res.json(post);
	});
});

router.post('/:post/comments', function(req,res,next){
	var comment = new Comment(req.body);
	comment.post = req.post;

	comment.save(function(err, comment){
				if (err) {return (err); }
		if (err) {return (err); }

		req.post.comments.push(comment);
		req.post.save(function(err, post){
			if (err) {return (err); }

			res.json(comment);
		});
	});
});

router.get('/comments/:comment', function(req,res){
	res.json(req.comment);
});

router.put('/comments/:comment/upvote', function(req,res,next){
	req.comment.upvote(function (err, comment){
			if (err) {return next(err); }

			res.json(comment);
	});
});
module.exports = router;