'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'pfptech';

	var applicationModuleVendorDependencies = ['ngResource', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload', 'ngCkeditor', 'ngSanitize'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.html5Mode(true).hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('tags');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');

'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('articles', {
			abstract: true,
			url: '/articles',
			template: '<ui-view/>'
		}).
		state('articles.list', {
			url: '',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('articles.create', {
			url: '/create',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('articles.view', {
			url: '/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('articles.edit', {
			url: '/:articleId/edit',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		});
	}
]);

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
'use strict';
/* global _: false */

angular.module('articles').controller('ArticlesController', ['$scope', '$state', 'Authentication', 'Articles', 'Tags',
    function($scope, $state, Authentication, Articles, Tags) {

        $scope.departments = ['General', 'Academic Programs', 'Admissions', 'Counseling', 'Executive Office', 'External Affairs', 'Finance and Administration', 'Leadership Development Opportunities', 'Smart Connections', 'Undergraduate Affairs'];

        //request all articles and all tags from database
        $scope.find = function() {
            if (Authentication.user) {
                Articles.query(function(articles) {
                    $scope.articles = _.groupBy(articles, 'department');
                    $scope.tags = Tags.query();
                });
            } else {
                $state.go('home');
            }
        };
    }
]);
'use strict';

angular.module('articles').controller('WikiHomeController', ['$scope', '$state', 'Authentication', 'Articles', '$sce',
    function($scope, $state, Authentication, Articles, $sce) {
        $scope.authentication = Authentication;

        //when user clicks the check mark on sidebar
        $scope.$on('clickedSave', function() {
            $scope.save();
        });

        //helps browser know what to show as user jumps to/from editing mode
        $scope.$on('$stateChangeSuccess', function() {
            $scope.editing = $state.current.name === 'main.edit';
        });


        //request wikiHome article from database
        $scope.findHome = function() {
            Articles.get({
                articleId: 'Home'
            }, function(post) {
                $scope.article = post;
                $scope.safecontent = $sce.trustAsHtml($scope.article.content);
                $scope.editorOptions = {
                    language: 'en',
                    uiColor: '#FFFFFF'
                };
            });
        };

        //allows admin to update the content on the wikiHome page
        $scope.save = function() {
            var article = $scope.article;
            article.$update(function() {
                $state.go('main', {}, {
                    reload: false,
                    notify: true
                });
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

    }
]);
'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('api/articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        // Redirect to home view when route not found
        $urlRouterProvider.otherwise('/');

        // Home state routing
        $stateProvider.
        state('home', {
            url: '/',
            templateUrl: 'modules/core/views/home.client.view.html'
        }).
        state('main', {
            url: '/wikiHome',
            templateUrl: 'modules/articles/views/main.client.view.html'
        }).
        state('main.edit', {
            url: '/edit',
            templateUrl: 'modules/articles/views/main.client.view.html'
        });
    }
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', '$window', 'Authentication',
    function($scope, $state, $window, Authentication) {
        $scope.authentication = Authentication;

        //when logo is clicked, redirect user to wikiHome, but only after making sure that user has saved his/her work
        $scope.redirect = function(page) {
            if (['main.edit', 'articles.create', 'articles.edit'].indexOf($state.current.name) > -1) {
                var confirmation = $window.confirm('Are you sure you want to leave this page without saving?');
                if (confirmation) {
                    $state.go(page);
                }
            } else {
                $state.go(page);
            }
        };
    }
]);
'use strict';

angular.module('core').controller('HomeController', ['$scope', '$state', 'Authentication',
    function($scope, $state, Authentication) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

        if ($scope.authentication.user) $state.go('main');
    }
]);

'use strict';

angular.module('articles').controller('SidebarController', ['$scope', '$rootScope', '$window', '$state', '$stateParams', '$location', 'Authentication', 'Articles',
    function($scope, $rootScope, $window, $state, $stateParams, $location, Authentication, Articles) {
        $scope.authentication = Authentication;

        //helps browser know what to show as user jumps to/from editing mode
        $scope.$on('$stateChangeSuccess', function() {
            $scope.editing = ['main.edit', 'articles.create', 'articles.edit'].indexOf($state.current.name) > -1;
        });

        //redirect user to new page, but only after making sure that user has saved his/her work
        $scope.redirect = function(page) {
            if (['main.edit', 'articles.create', 'articles.edit'].indexOf($state.current.name) > -1) {
                var confirmation = $window.confirm('Are you sure you want to leave this page without saving?');
                if (confirmation) {
                    $state.go(page);
                }
            } else {
                $state.go(page);
            }
        };

        $scope.user = function() {
            return $scope.authentication.user;
        };

        $scope.isAdmin = function() {
            if ($scope.authentication.user) {
                return $scope.authentication.user.roles[0] === 'admin';
            }
        };

        $scope.isActive = function(page) {
            return $state.current.name === page;
        };

        $scope.edit = function() {
            if ($state.current.name === 'main') {
                $state.go('main.edit', {}, {
                    reload: false,
                    notify: true
                });
            } else {
                $state.go('articles.edit', {
                    articleId: $stateParams.articleId
                }, {
                    reload: false,
                    notify: true
                });
            }
        };

        $scope.save = function() {
            $rootScope.$broadcast('clickedSave');
        };

        $scope.cancel = function() {
            if (['main.edit', 'articles.create'].indexOf($state.current.name) > -1) {
                $state.go('main');
            } else {
                $state.go('articles.view', {
                    articleId: $stateParams.articleId
                }, {
                    reload: false,
                    notify: true
                });
            }
        };

        $scope.remove = function() {
            $rootScope.$broadcast('clickedRemove');
        };

    }
]);
'use strict';

// Create the contenteditable directive
angular.module('core').directive('contenteditable',
function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || '');
      };

      element.bind('blur keyup change', function() {
        scope.$apply(read);
      });
    }
  };
});

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

    function() {
        // Define a set of default roles
        this.defaultRoles = ['*'];

        // Define the menus object
        this.menus = {};

        // A private function for rendering decision 
        var shouldRender = function(user) {
            if (user) {
                if (!!~this.roles.indexOf('*')) {
                    return true;
                } else {
                    for (var userRoleIndex in user.roles) {
                        for (var roleIndex in this.roles) {
                            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                                return true;
                            }
                        }
                    }
                }
            } else {
                return this.isPublic;
            }

            return false;
        };

        // Validate menu existance
        this.validateMenuExistance = function(menuId) {
            if (menuId && menuId.length) {
                if (this.menus[menuId]) {
                    return true;
                } else {
                    throw new Error('Menu does not exists');
                }
            } else {
                throw new Error('MenuId was not provided');
            }

            return false;
        };

        // Get the menu object by menu id
        this.getMenu = function(menuId) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Return the menu object
            return this.menus[menuId];
        };

        // Add new menu object by menu id
        this.addMenu = function(menuId, options) {
            options = options || {};

            // Create the new menu
            this.menus[menuId] = {
                isPublic: ((options.isPublic === null || typeof options.isPublic === 'undefined') ? true : options.isPublic),
                roles: options.roles || this.defaultRoles,
                items: options.items || [],
                shouldRender: shouldRender
            };

            // Return the menu object
            return this.menus[menuId];
        };

        // Remove existing menu object by menu id
        this.removeMenu = function(menuId) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Return the menu object
            delete this.menus[menuId];
        };

        // Add menu item object
        this.addMenuItem = function(menuId, options) {
            options = options || {};

            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Push new menu item
            this.menus[menuId].items.push({
                title: options.title || '',
                state: options.state || '',
                type: options.type || 'item',
                class: options.class,
                isPublic: ((options.isPublic === null || typeof options.isPublic === 'undefined') ? this.menus[menuId].isPublic : options.isPublic),
                roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].roles : options.roles),
                position: options.position || 0,
                items: [],
                shouldRender: shouldRender
            });

            // Add submenu items
            if (options.items) {
                for (var i in options.items) {
                	this.addSubMenuItem(menuId, options.link, options.items[i]);
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        // Add submenu item object
        this.addSubMenuItem = function(menuId, parentItemState, options) {
            options = options || {};

            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Search for menu item
            for (var itemIndex in this.menus[menuId].items) {
                if (this.menus[menuId].items[itemIndex].state === parentItemState) {
                    // Push new submenu item
                    this.menus[menuId].items[itemIndex].items.push({
                        title: options.title || '',
                        state: options.state|| '',
                        isPublic: ((options.isPublic === null || typeof options.isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : options.isPublic),
                        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
                        position: options.position || 0,
                        shouldRender: shouldRender
                    });
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        // Remove existing menu object by menu id
        this.removeMenuItem = function(menuId, menuItemURL) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Search for menu item to remove
            for (var itemIndex in this.menus[menuId].items) {
                if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
                    this.menus[menuId].items.splice(itemIndex, 1);
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        // Remove existing menu object by menu id
        this.removeSubMenuItem = function(menuId, submenuItemURL) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Search for menu item to remove
            for (var itemIndex in this.menus[menuId].items) {
                for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
                    if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
                        this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
                    }
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        //Adding the topbar menu
        this.addMenu('topbar', {
            isPublic: false
        });
    }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
    function(Authentication, $state, $timeout) {
    	// Connect to the Socket.io server only when authenticated
        if (Authentication.user) {
            this.socket = io();
        } else {
            $state.go('home');
        }

        // Wrap the Socket.io 'on' method
        this.on = function(eventName, callback) {
            if (this.socket) {
                this.socket.on(eventName, function(data) {
                    $timeout(function() {
                        callback(data);
                    });
                });
            }
        };

        // Wrap the Socket.io 'emit' method
        this.emit = function(eventName, data) {
            if (this.socket) {
                this.socket.emit(eventName, data);
            }
        };

        // Wrap the Socket.io 'removeListener' method
        this.removeListener = function(eventName) {
            if (this.socket) {
                this.socket.removeListener(eventName);
            }
        };
    }
]);

'use strict';

// Setting up route
angular.module('tags').config(['$stateProvider',
    function($stateProvider) {
        // Articles state routing
        $stateProvider.
        state('tags', {
            abstract: true,
            url: '/tags',
            template: '<ui-view/>'
        }).
        state('tags.list', {
            url: '',
            templateUrl: 'modules/tags/views/list-tags.client.view.html'
        });
    }
]);
'use strict';
/* global _: false */

angular.module('tags').controller('TagsController',
    ["$scope", "$window", "$state", "Authentication", "Tags", function($scope, $window, $state, Authentication, Tags) {
        $scope.authentication = Authentication;

        //allows admin to request tags data from database
        $scope.find = function() {
            if ($scope.authentication.user.roles[0] === 'user') {
                $state.go('main');
            } else {
                $scope.tags = Tags.query();
            }
        };

        //creates a new tag
        $scope.create = function() {
            if ($scope.tag.name) {
                var tag = new Tags($scope.tag);
                tag.$save(function(response) {
                    $scope.tag = null;
                    $scope.tags.push(response);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }
        };

        //deletes the selected tag
        $scope.removeTag = function(selected) {
            var confirmation = $window.prompt('Type DELETE to remove the ' + selected.name + ' ' + selected.type);
            if (confirmation) {
                selected.$remove(function() {
                    var oldTagIndex = _.findIndex($scope.tags, selected);
                    $scope.tags.splice(oldTagIndex, 1);
                });
            }
        };



    }]
);
'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('tags').factory('Tags', ['$resource',
	function($resource) {
		return $resource('api/tags/:tagId', {
			tagId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function ($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function ($q, $location, Authentication) {
				return {
					responseError: function (rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
    function($stateProvider) {
        // Users state routing
        $stateProvider.
        state('settings', {
            abstract: true,
            url: '/settings',
            templateUrl: 'modules/users/views/settings/settings.client.view.html'
        }).
        state('settings.profile', {
            url: '/profile',
            templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
        }).
        state('settings.password', {
            url: '/password',
            templateUrl: 'modules/users/views/settings/change-password.client.view.html'
        }).
        state('settings.users', {
            url: '/users',
            templateUrl: 'modules/users/views/settings/manage-users.client.view.html'
        }).
        state('settings.picture', {
            url: '/picture',
            templateUrl: 'modules/users/views/settings/change-profile-picture.client.view.html'
        }).
        state('authentication', {
            abstract: true,
            url: '/authentication',
            templateUrl: 'modules/users/views/authentication/authentication.client.view.html'
        }).
        state('authentication.signin', {
            url: '/signin',
            templateUrl: 'modules/users/views/authentication/signin.client.view.html'
        }).
        state('password', {
            abstract: true,
            url: '/password',
            template: '<ui-view/>'
        }).
        state('password.forgot', {
            url: '/forgot',
            templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
        }).
        state('password.reset', {
            abstract: true,
            url: '/reset',
            template: '<ui-view/>'
        }).
        state('password.reset.invalid', {
            url: '/invalid',
            templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
        }).
        state('password.reset.success', {
            url: '/success',
            templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
        }).
        state('password.reset.form', {
            url: '/:token',
            templateUrl: 'modules/users/views/password/reset-password.client.view.html'
        });
    }
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
    function($scope, $http, $location, Authentication) {
        $scope.authentication = Authentication;

        // If user is signed in then redirect back home
        if ($scope.authentication.user) $location.path('/wikiHome');

        $scope.signup = function() {
            $http.post('/api/auth/signup', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to the index page
                $location.path('/wikiHome');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        $scope.signin = function() {
            $http.post('/api/auth/signin', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to the index page
                $location.path('/wikiHome');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
    }
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/api/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
    function($scope, $http, $location, Users, Authentication) {
        $scope.user = Authentication.user;

        // If user is not signed in then redirect back home
        if (!$scope.user) $location.path('/');

        // Update a user profile
        $scope.updateUserProfile = function(isValid) {
            if (isValid) {
                $scope.success = $scope.error = null;
                var user = new Users($scope.user);

                user.$update(function(response) {
                    $scope.success = true;
                    Authentication.user = response;
                }, function(response) {
                    $scope.error = response.data.message;
                });
            } else {
                $scope.submitted = true;
            }
        };

        // Change user password
        $scope.changeUserPassword = function() {
            $scope.success = $scope.error = null;

            $http.post('/api/users/password', $scope.passwordDetails).success(function(response) {
                // If successful show success message and clear form
                $scope.success = true;
                $scope.passwordDetails = null;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
    }
]);
'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Users', 'Authentication',
	function($scope, $http, Users, Authentication) {
		$scope.user = Authentication.user;

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/api/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
	function ($scope, $timeout, $window, Authentication, FileUploader) {
		$scope.user = Authentication.user;
		$scope.imageURL = $scope.user.profileImageURL;

		// Create file uploader instance
		$scope.uploader = new FileUploader({
			url: 'api/users/picture'
		});

		// Set file uploader image filter
		$scope.uploader.filters.push({
			name: 'imageFilter',
			fn: function (item, options) {
				var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
				return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
			}
		});

		// Called after the user selected a new picture file
		$scope.uploader.onAfterAddingFile = function (fileItem) {
			if ($window.FileReader) {
				var fileReader = new FileReader();
				fileReader.readAsDataURL(fileItem._file);

				fileReader.onload = function (fileReaderEvent) {
					$timeout(function () {
						$scope.imageURL = fileReaderEvent.target.result;
					}, 0);
				};
			}
		};

		// Called after the user has successfully uploaded a new picture
		$scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
			// Show success message
			$scope.success = true;

			// Populate user object
			$scope.user = Authentication.user = response;

			// Clear upload buttons
			$scope.cancelUpload();
		};

		// Called after the user has failed to uploaded a new picture
		$scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
			// Clear upload buttons
			$scope.cancelUpload();

			// Show error message
			$scope.error = response.message;
		};

		// Change user profile picture
		$scope.uploadProfilePicture = function () {
			// Clear messages
			$scope.success = $scope.error = null;

			// Start upload
			$scope.uploader.uploadAll();
		};

		// Cancel the upload process
		$scope.cancelUpload = function () {
			$scope.uploader.clearQueue();
			$scope.imageURL = $scope.user.profileImageURL;
		};
	}
]);

'use strict';

angular.module('users').controller('EditProfileController', ['$scope', 'Users', 'Authentication',
	function($scope, Users, Authentication) {
		$scope.user = Authentication.user;

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid){
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};
	}
]);

'use strict';

angular.module('users').controller('ManageUsersController', ['$scope', '$http', '$window', 'Users', 'Authentication',
	function($scope, $http, $window, Users, Authentication) {
		$scope.user = Authentication.user;

		//requests all user data from database
    $scope.findUsers = function() {
      Users.query(function(response) {
        $scope.staff = response;
			});
    };

		//checks whether data is for new or existing user before saving
    $scope.saveProfile = function() {
      if (!$scope.newUser._id) {
        $scope.signup();
      } else {
        $scope.updateUserProfile();
      }
    };

		//creates new user
    $scope.signup = function() {
			$http.post('/api/auth/signup', $scope.newUser).success(function(response) {
        $scope.staff.push(response);
        $scope.newUser = null;
        $scope.addNewUser = false;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		//allows admin users to edit any existing user
    $scope.editUser = function(user, index) {
			if ($scope.user.roles[0] === 'admin') {
	      $scope.newUser = user;
	      $scope.userIndex = index;
	      $scope.addNewUser = true;
			}
    };

		//hides and resets editing form
    $scope.cancel = function() {
      $scope.newUser = $scope.userIndex = null;
      $scope.addNewUser = false;
    };

		//updates an existing user
		$scope.updateUserProfile = function() {
				$scope.error = null;
				var user = new Users($scope.newUser);
				user.$update(function(response) {
          $scope.staff.splice($scope.userIndex, 1);
          $scope.staff.push(response);
					$scope.cancel();
				}, function(response) {
					$scope.error = response.data.message;
				});
		};

		//deletes selected user
		$scope.removeUser = function() {
			var confirmation = $window.prompt('Type DELETE to remove ' + $scope.newUser.displayName + '\'s account.');
			if (confirmation === 'DELETE') {
				var user = new Users($scope.newUser);
				user.$remove(function() {
					$scope.staff.splice($scope.userIndex, 1);
					$scope.addNewUser = false;
				}, function(response) {
					$scope.error = response.data.message;
				});
			}
		};
	}
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$location', 'Users', 'Authentication',
	function($scope, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');
	}
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [

	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('api/users/:userId', {
			userId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
