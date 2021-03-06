angular.module('controllers')
.controller('boardController', ['$scope', '$rootScope', 'socket', 'modalService', 'timeService', 'playerService', 'challengeService', function($scope, $rootScope, socket, modalService, timeService, playerService, challengeService) {
	
	init();
	
	function init() {
		// TODO: implement a better solution than guessing big at 12 tiers
		generateTiers(12);
		populatePlayers();
	}
	
	function generateTiers(tiers) {
		var arr = [];
		for (var t=1; t<tiers; t++) {
			arr.push(t);
		}
		$scope.tiers = arr;
	}
	
	function populatePlayers() {
		playerService.getPlayers().then( function(players) {
			sanitizeNames(players);
			$scope.players = players;
		});
	}
	
	/* Should be covered by back end check, but just in case */
	function sanitizeNames(players) {
		for (var i=0; i<players.length; i++) {
			players[i]['name'].replace(/&/g, '&amp;')
							  .replace(/>/g, '&gt;')
							  .replace(/</g, '&lt;')
							  .replace(/"/g, '&quot;');
		}
	}
	
	$scope.dangerLevel = function(gameTime) {
		var hours = timeService.hoursBetween(new Date(gameTime), new Date());
		if (hours <= 48)
			return 'alert-success';
		if (hours > 48 && hours <= 72)
			return 'alert-warning';
		if (hours > 72)
			return 'alert-danger';
	};
	
	$scope.challenge = function(challengeeId) {
		var player = $rootScope.myClient.player;
		if (!player) {
			var modalOptions = {
				actionButtonText: 'OK',
				headerText: 'Challenge',
				bodyText: 'You must log in first.'
			};
			modalService.showAlertModal({}, modalOptions);
		} else {
			var myId = player._id;
			challengeService.createChallenge(myId, challengeeId).then( goodChallenge, badChallenge );
		}
	};
	function goodChallenge(success) {
		var modalOptions = {
            headerText: 'Challenge',
            bodyText: success
        };
        modalService.showAlertModal({}, modalOptions);
	}
	function badChallenge(error) {
		console.log(error);
		var modalOptions = {
            headerText: 'Challenge',
            bodyText: error
        };
        modalService.showAlertModal({}, modalOptions);
	}
	
	socket.on('player:new', function(name) {
		populatePlayers();
	});
	socket.on('player:change:name', function(name) {
		populatePlayers();
	});
	socket.on('challenge:resolved', function() {
		populatePlayers();
	});
	socket.on('challenge:forfeited', function() {
		populatePlayers();
	});
}]);
