'use strict';

angular.module('articles').controller('ArticleController', ['$scope', '$state', '$window', '$stateParams', 'Authentication', 'Articles', 'Tags', '$sce',
    function($scope, $state, $window, $stateParams, Authentication, Articles, Tags, $sce) {
        $scope.authentication = Authentication;

        $scope.departments = ['General', 'Academic Programs', 'Admissions', 'Counseling', 'Executive Office', 'External Affairs', 'Finance and Administration', 'Leadership Development Opportunities', 'Smart Connections', 'Undergraduate Affairs'];

        //when user clicks the check mark on sidebar
        $scope.$on('clickedSave', function() {
            if ($state.current.name === 'articles.create') {
                create();
            } else {
                update();
            }
        });

        //when user clicks the x on sidebar
        $scope.$on('clickedRemove', function() {
            remove();
        });

        //helps browser know what to show as user jumps to/from editing mode
        $scope.$on('$stateChangeSuccess', function() {
            $scope.editing = ['articles.create', 'articles.edit'].indexOf($state.current.name) > -1;
        });

        //requests tags and article data from database
        $scope.findOne = function() {
            $scope.tags = Tags.query();
            $scope.newtag = {
                name: '',
                type: ''
            };
            $scope.editorOptions = {
                language: 'en',
                uiColor: '#FFFFFF'
            };
            if ($stateParams.articleId) {
                $scope.article = Articles.get({
                    articleId: $stateParams.articleId
                });
                $scope.safecontent = $sce.trustAsHtml($scope.article.content);
            } else {
                $scope.article = {
                    title: 'title',
                    content: 'content',
                    tag: ''
                };
            }
        };

        //creates a new article if it has been properly tagged
        function create() {
            if ($scope.articleTags.$valid) {
                var article = new Articles($scope.article);
                article.$save(function(response) {
                    $scope.article = response;
                    $state.go('articles.view', {
                        articleId: article._id
                    });
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            } else {
                alert('Please tag this article.');
            }
        }

        //deletes the current article
        function remove() {
            var confirmation = $window.prompt('Type DELETE to wipe this article out of existence.');
            if (confirmation === 'DELETE') {
                var article = $scope.article;
                article.$remove(function() {
                    $state.go('articles.list');
                });
            }
        }

        //saves changes to the current article
        function update() {
            var article = $scope.article;
            article.$update(function() {
                $state.go('articles.view', {
                    articleId: article._id
                }, {
                    reload: false,
                    notify: true
                });
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        }

        //allows all users to create new tags on the spot
        $scope.createTag = function(type) {
            $scope.newtag.type = type;
            var tag = new Tags($scope.newtag);
            tag.$save(function(response) {
                $scope.tags.push(response);
                $scope.article[$scope.newtag.type] = response.name;
                $scope.newtag = null;
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

    }
]);