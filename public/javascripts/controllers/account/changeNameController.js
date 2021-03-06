angular.module('controllers')
.controller('changeNameController', ['$scope', '$rootScope', 'modalService', 'playerService', function($scope, $rootScope, modalService, playerService) {
	
	init();
	
	function init() {
		$scope.newName = $rootScope.myClient.player.name || '';
	}
	
	$scope.validateName = function() {
		var playerId = $rootScope.myClient.player._id;
		playerService.changeName(playerId, $scope.newName).then(
			// Success
			function(success) {
				modalOptions = {
					headerText: 'Change Username',
					bodyText: success
				};
				modalService.showAlertModal({}, modalOptions);
			},
			// Error
			function(error) {
				modalOptions = {
					headerText: 'Change Username',
					bodyText: error
				};
				modalService.showAlertModal({}, modalOptions);
			}
		);
	}
}]);
