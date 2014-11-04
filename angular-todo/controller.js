(function() {
  var app = angular.module('todoApp',['ngRoute']);

  app.factory('TodosFactory', ['$http', function($http) {
    return {
      getTodos: function() {
        return $http.get('http://localhost:3000/todos');
      }
    };
  }]);

  app.config(function($routeProvider) {
    $routeProvider.when('/', {
      controller: 'TodoController',
      templateUrl: 'partials/main.html'
    }).
      when('/edit/:todoId', {
      controller: 'TodoEditController',
      templateUrl: 'partials/edit.html'
    });
  });

  app.controller('TodoController', ['$scope', '$http', 'TodosFactory', function($scope, $http, TodosFactory) {
    TodosFactory.getTodos().success(function(data) {
      $scope.todos = data;
    });

    $scope.save = function() {
      $http.post('http://localhost:3000/todos', {todo: {text: $scope.todo.text}}).
      success(function(data){
        $scope.todos.push(data);
        $scope.todo = '';
      });
    };

    $scope.remove = function(index, todo_id) {
      $scope.todos.splice(index, 1);
      $http.delete('http://localhost:3000/todos/' + todo_id);
    }
  }]);

  app.controller('TodoEditController', ['$scope', '$filter', '$http', '$routeParams', 'TodosFactory', function($scope, $filter, $http, $routeParams, TodosFactory) {
    TodosFactory.getTodos().success(function(data) {
      var todoId = $routeParams.todoId;
      $scope.todos = data;
      $scope.todo = $filter("filter")($scope.todos, {id:todoId})[0];
    });

    $scope.save = function() {
      $http.patch('http://localhost:3000/todos/' + $scope.todo.id , {todo: {text: $scope.todo.text}})
      .success(function(){
        console.log("success");
      });
    };
  }]);
})();
