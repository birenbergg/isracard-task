// Module declaration
var githubSearchApp = angular.module('githubSearchApp', ['ngRoute']);

// Module configuration
githubSearchApp.config(['$routeProvider', $routeProvider => {

    // Rounting
    $routeProvider
        .when('/', {
            redirectTo: '/search'
        })
        .when('/search', {
            templateUrl: '/Templates/Search.html'
        })
        .when('/bookmarks', {
            templateUrl: '/Templates/Bookmarks.html'
        })
        .otherwise({
            redirectTo: '/search'
        })
}]);

// Custom derective for quite complex button
githubSearchApp.directive('bookmarkToggleButton', [() => {
    return {
        restrict: 'E',
        scope: {
            repo: '='
        },
        templateUrl: '/Templates/BookmarkToggleButton.html'
    };
}]);

// Controller
githubSearchApp.controller('githubSearchController', ['$scope', '$http', ($scope, $http) => {

    // Message boxes visibilty
    $scope.loading = false;
    $scope.zeroFound = false;
    $scope.zeroBookmarked = true;

    $scope.reposSearchResult = [];  // repositories brought by search result
    $scope.bookmarkedRepos = [];    // repositories bookmarked by user

    // Brings bookmarked repos from the session on server side (if any)
    $http.get('/Bookmarks/Repos').then(data => {
        $scope.bookmarkedRepos = data.data != '' ? data.data : [];
        console.log($scope.bookmarkedRepos);
    });

    // Searches repos by keyword, usind GitHub API
    $scope.searchRepos = function (searchQuery) {

        // Clear previous result
        $scope.reposSearchResult = [];

        // Turn 'Searching...' message on
        $scope.loading = true;

        $scope.zeroFound = false;

        // AJAX call to GitHub API
        $http.get('https://api.github.com/search/repositories?q=' + searchQuery)
            .then(data => {
                if (data.data.items.length > 0) {
                    // Store in local variable
                    $scope.reposSearchResult = data.data.items;
                } else { // if empty result...
                    // Show message
                    $scope.zeroFound = true;
                }

                // Turn 'Searching...' message off
                $scope.loading = false;
            });
    }

    // Bookmarks / Unbookmarks a repository
    $scope.toggleBookmark = repo => {

        if (!$scope.isRepoBookmarked(repo.id)) {
            // Add repo to local bookmarked repos array
            $scope.bookmarkedRepos.push(repo);
        } else {
            // Remove repo from local bookmarked repos array
            console.log(repo);
            console.log($scope.bookmarkedRepos.indexOf(repo));

            var index = $scope.bookmarkedRepos.findIndex(r => r.id === repo.id)
            $scope.bookmarkedRepos.splice(index, 1);
        }

        // Post updated array to server (and store there in the session, see Controllers/BookmarksController.cs)
        $http.post('/Bookmarks/Repos', {
            repos: JSON.stringify($scope.bookmarkedRepos)
        });
    }

    // A helper funtion, checks if a repository is in 'Bookmarked' array
    $scope.isRepoBookmarked = id => {
        return $scope.bookmarkedRepos.filter(repo => (repo.id === id)).length > 0; // (filter by repository ID)
    }
}]);