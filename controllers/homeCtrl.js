'use strict';

appControllers.controller('homeCtrl',['$scope', '$location', '$http', '$stateParams', 'localStorageService', '$ionicModal',function($scope, $location, $http, $stateParams, localStorageService, $ionicModal){
	

	$scope.nbLoad=1;
	$scope.displayHome=false;
	$scope.displayErreur=false;
	$scope.promos=["L1-A","L1-B","L2-A","L2-B","L3-A","L3-B","L4-GI","L4-GRM","L4-GSA","L5-GI","L5-GRM","L5-GSA"];
	$scope.semaines=[];
	for(var i=0;i<=51;i++)
	{
		$scope.semaines[i]=i+1;
	}
	$scope.jours=["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];

	var today=new Date();
	var day = today.getDate();
	var month = today.getMonth()+1;
	var year = today.getFullYear();

	$scope.events = [];
	$scope.events_parsed = [];
	$scope.classeselect="";
	if(month<10)
	{
		month="0"+month;
	}
	if(day<10)
	{
		day="0"+day;
	}
	$scope.dayselect=year+"-"+month+"-"+day;

	
	$scope.setSemaine= function(semaine)
	{	
		var d = getWeekNumber(semaine);
		$scope.semaineselect=d;
	}


	$scope.setSemaine($scope.dayselect);
	$scope.lundi=[];
	$scope.mardi=[];
	$scope.mercredi=[];
	$scope.jeudi=[];
	$scope.vendredi=[];
	$scope.samedi=[];

	$scope.setClasse= function(classe)
	{
		$scope.classeselect=classe;
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
					
				var from = event.start_date.split("/");
		    	var f = new Date(from[2], from[1] - 1, from[0]);
		    	
				if(f.getDay()==1)
				{
					if(event[2]!=undefined)
					{
						$scope.lundi.push(event);
						$scope.lundi_date=event.start_date;
					}
				}
				if(f.getDay()==2)
				{
					if(event[2]!=undefined)
					{
						$scope.mardi.push(event);
						$scope.mardi_date=event.start_date;
					}
				}
				if(f.getDay()==3)
				{
					if(event[2]!=undefined)
					{
						$scope.mercredi.push(event);
						$scope.mercredi_date=event.start_date;
					}
				}
				if(f.getDay()==4)
				{
					if(event[2]!=undefined)
					{
						$scope.jeudi.push(event);
						$scope.jeudi_date=event.start_date;
					}
				}
				if(f.getDay()==5)
				{
					if(event[2]!=undefined)
					{
						$scope.vendredi.push(event);
						$scope.vendredi_date=event.start_date;
					}
				}
				if(f.getDay()==6)
				{
					if(event[2]!=undefined)
					{
						$scope.samedi.push(event);
						$scope.samedi_date=event.start_date;
					}
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
		$scope.lundi=[];
		$scope.mardi=[];
		$scope.mercredi=[];
		$scope.jeudi=[];
		$scope.vendredi=[];
		$scope.samedi=[];
		if($scope.classeselect!="")
		{
			
			$http.get("http://tanguymuselet.fr/WS-Hyperplanning/get"+$scope.classeselect+".php").
			success(function(edt){
				var ical_file=edt;
				$scope.parseICAL(ical_file);
				
				$scope.parsing($scope.events);
				
				$scope.events_parsed.forEach(function(event){
					$scope.isinweek(event);
				});
				

			});	

		}
		
				

	}

	$scope.parsing = function(events){
		$scope.events_parsed=[];
		events.forEach(function(event){
			if(event.DESCRIPTION!=undefined)
			{
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

			}

		});
		
	}

	//Display All future events in ical file as list.

	$scope.displayTrue = function(){
	$scope.nbLoad--;
	if($scope.nbLoad<=0){
		$scope.displayHome=true;
		}
	}

	$scope.makeDate = function(ical_date){
		//break date apart
		var dt =  {
			year: ical_date.substr(0,4),
			month: ical_date.substr(4,2),
			day: ical_date.substr(6,2),
			hour: ical_date.substr(9,2),
			minute: ical_date.substr(11,2)
		}
		//Create JS date (months start at 0 in JS - don't ask)
		dt.date = new Date(dt.year, (dt.month-1), dt.day, dt.hour, dt.minute);
		//Get the full name of the given day
		dt.dayname =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dt.date.getDay()];
		
		return dt;
	}
	

	$scope.parseICAL = function(data){
		//Ensure cal is empty
		var ln;
		var idx;
		var type;
		var val;
		var dt;
		//Clean string and split the file so we can handle it (line by line)
		var cal_array = data.replace(new RegExp( "\\r", "g" ), "").split("\n");
		
		//Keep track of when we are activly parsing an event
		var in_event = false;
		//Use as a holder for the current event being proccessed.
		var cur_event = null;
		for(var i=0;i<cal_array.length;i++){
			ln = cal_array[i];
			//If we encounted a new Event, create a blank event object + set in event options.
			if(!in_event && ln == 'BEGIN:VEVENT'){
				in_event = true;
				cur_event = {};
			}
			//If we encounter end event, complete the object and add it to our events array then clear it for reuse.
			if(in_event && ln == 'END:VEVENT'){
				in_event = false;
				$scope.events.push(cur_event);
				cur_event = null;
			}
			//If we are in an event
			if(in_event){
				//Split the item based on the first ":"
				idx = ln.indexOf(':');
				//Apply trimming to values to reduce risks of badly formatted ical files.
				type = ln.substr(0,idx).replace(/^\s\s*/, '').replace(/\s\s*$/, '');//Trim
				val = ln.substr(idx+1,ln.length-(idx+1)).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
				if(type=="DESCRIPTION;LANGUAGE=fr")
				{
					type="DESCRIPTION";
				}
				if(type=="DTSTART;VALUE=DATE")
				{
					type="DTSTART";
				}
				if(type=="DTEND;VALUE=DATE")
				{
					type="DTEND";
				}

				//If the type is a start date, proccess it and store details
				if(type =='DTSTART'){
					dt = $scope.makeDate(val);
					val = dt.date;
					//These are helpful for display
					cur_event.start_time = dt.hour+':'+dt.minute;
					cur_event.start_date = dt.day+'/'+dt.month+'/'+dt.year;
					cur_event.day = dt.dayname;
				}
				//If the type is an end date, do the same as above
				if(type =='DTEND'){
					dt = $scope.makeDate(val);
					val = dt.date;
					//These are helpful for display
					cur_event.end_time = dt.hour+':'+dt.minute;
					cur_event.end_date = dt.day+'/'+dt.month+'/'+dt.year;
					cur_event.day = dt.dayname;
				}
				//Convert timestamp
				if(type =='DTSTAMP') val = $scope.makeDate(val).date;
				
				//Add the value to our event object.
				cur_event[type] = val;
			}
		}
	}



	$scope.init_calendar();
	$scope.displayTrue();


}]);
