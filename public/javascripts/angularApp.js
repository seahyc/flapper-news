angular.module('flapperNews', ['ui.router'])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
      	postPromise: ['posts', function(posts){
      		return posts.getAll();
      	}]
      }
    })

    .state('posts',{
    	url: '/posts/{id}',
    	templateUrl: '/posts.html',
    	controller: 'PostsCtrl',
    	resolve: {
    		poost: ['$stateParams', 'posts', function($stateParams, posts){
    			return posts.get($stateParams.id);
    		}]
    	}
    });

  $urlRouterProvider.otherwise('home');
}])

.factory('posts', ['$http', function($http){
  var o = {
    posts: [] };

    o.upvote = function(post){
    	return $http.put('/posts/' + post._id + '/upvote')
    	.success(function(data){
    		post.upvotes ++;
    	});
    };

    o.upvoteComment = function(comment){
    	return $http.put('/posts/comments/' + comment._id + '/upvote').success(function(data){
    		comment.upvotes ++;
    	});
    };
    o.get = function(id){
    	return $http.get('/posts/' + id).then(function(res){
    		return res.data;
    	});
    };

    o.create = function(post){
    	return $http.post('/posts', post).success(function(data){
    		o.posts.push(data);
    	});
    };

    o.addComment = function(id, comment){
    	return $http.post('/posts/' + id + '/comments', comment);
    };

   o.getAll = function(){
   	return $http.get('/posts').success(function(data){
   		angular.copy(data, o.posts);
   	});
   };
  return o;
}])

.controller('PostsCtrl', [
	'$scope', 'poost', 'posts', function($scope, poost, posts){
		$scope.post = poost;

		$scope.addC = function(){
			if($scope.body === ''){ alert('Error');return;}
			posts.addComment($scope.post._id, {
				body:$scope.body,
				author:'yc',
			}).success(function(comment){
				$scope.post.comments.push(comment);
			});

			$scope.body= '';
		};

		$scope.incrementUpvotes = function(comment) {
	    	posts.upvoteComment(comment);
		  };
	}])

.controller('MainCtrl', [
'$scope',
'posts',
function($scope, posts){
  $scope.test = 'Hello world!';

  $scope.posts = posts.posts;

  $scope.addPost = function(){
    if($scope.title === '') { alert('No');return; }
    posts.create({
    	title: $scope.title,
    	link: $scope.link,
    });
    $scope.title = '';
    $scope.link = '';
  };

  $scope.incrementUpvotes = function(post) {
    posts.upvote(post);
  };

}]);