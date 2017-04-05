'use strict';

angular.module('mosaicApp')
	.factory('EventViewerFactory', function($http, $q, $mdToast, mosaicUtilsFactory, mosaicConfigFactory) {
			var factory = {};

			factory.eventNumber=1;
			factory.recordCount=10;
			factory.eventViewPlot='';
			factory.errorText='';

			factory.plotUpdating=false;

			factory.updateEvientView = function() {
				mosaicUtilsFactory.post('/event-view', {
					'eventNumber': factory.eventNumber
				})
				.then(function(response, status) {
					factory.eventViewPlot=response.data.eventViewPlot;
					factory.eventNumber=response.data.eventNumber;
					factory.recordCount=response.data.recordCount;
					factory.errorText=response.data.errorText;

					if (factory.errorText != '') {
						factory.showErrorToast();
					} else {
						$mdToast.hide();
					};
					factory.plotUpdating=false;
				}, function(error) {
					console.log(error);
				});
				factory.plotUpdating=true;
			};

			factory.eventForward = function() {
				factory.eventNumber++;
				factory.eventNumber=Math.min(factory.eventNumber, factory.recordCount);
			};
			factory.eventBack = function() {
				factory.eventNumber--;
				factory.eventNumber=Math.max(1, factory.eventNumber);
			};

			factory.showErrorToast = function() {
				var toast = $mdToast.simple()
					.position('bottom center')
					.parent("#toastAnchor")
					.textContent(factory.errorText)
					.action('DISMISS')
					.highlightAction(true)
					.highlightClass('md-warn')
					.hideDelay(0);

					$mdToast.show(toast).then(function(response) {
						if ( response == 'ok' ) {
								factory.errorText='';
						}
					}, function() {});
			};

			return factory;
		}
	)
	.controller('eventViewerCtrl', function($scope, $mdDialog, $interval, EventViewerFactory) {
		$scope.model = EventViewerFactory;

		$scope.customFullscreen = true;

		$scope.model.updateEvientView();
		
		// watch
		$scope.$watch('model.eventNumber', function() {
			$scope.model.updateEvientView();
		});

		$scope.key=function($event) {
			if ($event.keyCode == 39) 
				$scope.model.eventForward();
			else if ($event.keyCode == 37)
				$scope.model.eventBack();
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};	
	});