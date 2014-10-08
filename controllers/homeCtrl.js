'use strict';

appControllers.controller('homeCtrl',['$scope', '$location', '$http', '$stateParams', 'localStorageService', '$ionicModal',function($scope, $location, $http, $stateParams, localStorageService, $ionicModal){
	$scope.nbLoad=1;
	$scope.displayHome=false;
	$scope.displayErreur=false;
	$scope.promos=["L1-A","L1-B","L1-C","L2-A","L2-B","L3-A","L3-B","L4-GI","L4-GRM","L4-GSA","L5-GI","L5-GRM","L5-GSA"];
	$scope.semaines=[];
	for(var i=0;i<=51;i++)
	{
		$scope.semaines[i]=i+1;
	}
	$scope.jours=["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];

	$scope.events = {};
	$scope.events_parsed = [];
	$scope.classeselect="";
	$scope.semaineselect="";
	$scope.courssemaine=[];
	$scope.lundi=[];
	$scope.mardi=[];
	$scope.mercredi=[];
	$scope.jeudi=[];
	$scope.vendredi=[];
	$scope.samedi=[];

	$scope.isSemaineSelect = function(){
		if($scope.semaineselect=="")
		{
			return false;
		}
		return true;
	}
	

	$scope.setClasse= function(classe)
	{
		$scope.classeselect=classe;
	}

	$scope.setSemaine= function(semaine)
	{
		var d = getWeekNumber(semaine);
		$scope.semaineselect=d;
	}

    function getWeekNumber(d) 
    {
	    // Copy date so don't modify original

	    d = new Date(d);
	    d.setHours(0,0,0);
	    // Set to nearest Thursday: current date + 4 - current day number
	    // Make Sunday's day number 7
	    d.setDate(d.getDate() + 4 - (d.getDay()||7));
	    // Get first day of year
	    var yearStart = new Date(d.getFullYear(),0,1);
	    // Calculate full weeks to nearest Thursday
	    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
	    // Return array of year and week number
	    return weekNo;
    }

	$scope.isinweek = function(event)
	{
		
		if($scope.semaineselect!="" && $scope.classeselect!="")
		{
		    var from = event.start_date.split("/");
		  
		    var f = new Date(from[2], from[1] - 1, from[0]);
		  
		    var weekNo = getWeekNumber(f);

			if(weekNo==$scope.semaineselect)
			{
				$scope.courssemaine.push(event);
				
				var from = event.start_date.split("/");
		    	var f = new Date(from[2], from[1] - 1, from[0]);
		    	
				if(f.getDay()==1)
				{
					$scope.lundi.push(event);
					$scope.lundi_date=event.start_date;
				}
				if(f.getDay()==2)
				{
					$scope.mardi.push(event);
					$scope.mardi_date=event.start_date;
				}
				if(f.getDay()==3)
				{
					$scope.mercredi.push(event);
					$scope.mercredi_date=event.start_date;
				}
				if(f.getDay()==4)
				{
					$scope.jeudi.push(event);
					$scope.jeudi_date=event.start_date;
				}
				if(f.getDay()==5)
				{
					$scope.vendredi.push(event);
					$scope.vendredi_date=event.start_date;
				}
				if(f.getDay()==6)
				{
					$scope.samedi.push(event);
					$scope.samedi_date=event.start_date;
				}
				
			}
		}
		
	}



	$scope.isNotEmptyLundi=function()
	{
		
		if($scope.lundi!=null && $scope.lundi != "")
		{
			return true;
		}
		else {return false};
	}


		$scope.isNotEmptyMardi=function()
	{
		
		if($scope.mardi!=null && $scope.mardi != "")
		{
			return true;
		}
		else {return false};
	}


		$scope.isNotEmptyMercredi=function()
	{
		
		if($scope.mercredi!=null && $scope.mercredi != "")
		{
			return true;
		}
		else {return false};
	}


		$scope.isNotEmptyJeudi=function()
	{
		
		if($scope.jeudi!=null && $scope.jeudi != "")
		{
			return true;
		}
		else {return false};
	}


		$scope.isNotEmptyVendredi=function()
	{
		
		if($scope.vendredi!=null && $scope.vendredi != "")
		{
			return true;
		}
		else {return false};
	}

		$scope.isNotEmptySamedi=function()
	{
		
		if($scope.samedi!=null && $scope.samedi != "")
		{
			return true;
		}
		else {return false};
	}

	$scope.init_calendar = function() 
	{

		$scope.courssemaine=[];
			$scope.lundi=[];
	$scope.mardi=[];
	$scope.mercredi=[];
	$scope.jeudi=[];
	$scope.vendredi=[];
	$scope.samedi=[];
		if($scope.classeselect!="")
		{
			var ical_file= "./ressources/ical/EdT_"+$scope.classeselect+".ics";
			
			//run ical parser on load
				//Create new ical parser
			new ical_parser(ical_file, function(cal){
				//When ical parser has loaded file
				//get future events
				$scope.events = cal.getEvents();
				
				//And display them
				$scope.parsing($scope.events);
				$scope.events_parsed.forEach(function(event){
					$scope.isinweek(event);
				});
				
				$scope.$apply();

			});	
		}
				

	}

	$scope.parsing = function(events){
		$scope.events_parsed=[];
		events.forEach(function(event){
			event.DESCRIPTION = escape(event.DESCRIPTION);
			var event_parsed = event.DESCRIPTION.split("%5Cn");
			for(var i=0;i<event_parsed.length;i++)
			{
				event_parsed[i]=unescape(event_parsed[i]);
			}
		
			for(var i=0;i<event_parsed.length;i++)
			{
				var sous_parse = event_parsed[i].split(" : ");
				event_parsed[i] = [];
				event_parsed[i].push(sous_parse);
			}

			event_parsed.day=event.day;
			event_parsed.dtstart=event.dtstart;
			event_parsed.start_time=event.start_time;
			event_parsed.end_time=event.end_time;
			event_parsed.start_date=event.start_date;

			$scope.events_parsed.push(event_parsed);

		});
		
	}

	//Display All future events in ical file as list.

	$scope.displayTrue = function(){
	$scope.nbLoad--;
	if($scope.nbLoad<=0){
		$scope.displayHome=true;
		}
	}


	$scope.init_calendar();
	$scope.displayTrue();


}]);
