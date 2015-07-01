

// LONDON : 51.5072, 0.1275

//37.7833° N, 122.4167° W
//San Francisco, Coordinates

// 30.0500° N, 31.2333° E
// Cairo, Coordinates

// 39.9167° N, 116.3833° E
// Beijing, Coordinates

// 40.7127° N, 74.0059° W
// New York City, Coordinates

// 33.8650° S, 151.2094° E
// Sydney, Coordinates

var $locations = {
	"london": [51.5072, -0.1275],
	"san-francisco": [37.7833, -122.4167],
	"cairo": [30.0500, 31.2333],
	"beijing": [39.9167, 116.3833],
	"new-york": [40.7127, -74.0059],
	"sydney": [-33.8650, 151.2094],
}

// var $API_KEY = "AIzaSyAdBXuNGEfEvanuCy9QdzCWSLPsLEZhoM0";

// var $location = { 
//      "lat": 39.6034810, 
//      "lng": -119.6822510, 
// };
// var $lat = round($location['lat'], 2);
// var $lng = round($location['lng'], 2);
function getTimezone(url){
	$.ajax({
		method: "GET",
		url: url
	}).done(function(response) {
		var dst_offset = response.dstOffset;
		var raw_offset = response.rawOffset;
		console.log(response.status);
		console.log(response);
		console.log(dst_offset + ", " + raw_offset);
		setHour(dst_offset, raw_offset);
	});
}

// function file_get_contents(url){
// 	var xhr = new XMLHttpRequest();
// 	xhr.open("GET", url, true);
// 	xhr.onload = function () {
// 	  if (xhr.readyState === 4) {
// 	    if (xhr.status === 200) {
// 	      console.log(xhr.responseText);
// 	      // $("#json").empty().append(xhr.responseText);
// 	      console.log(JSON.parse(xhr.responseText));
// 	      // $("#json").append(jparse(xhr.responseText));
// 	    } else {
// 	      console.error(xhr.statusText);
// 	    }
// 	  }
// 	};
// 	xhr.send(null);
// 	return response;
// }

function callGoogle(lat, lng){
	var timestamp = Math.floor(Date.now() / 1000);
	var lat_lng = lat.toString().concat(", ", lng);
	var url1 = "https://maps.googleapis.com/maps/api/timezone/json?location=";
	var url2 = "&timestamp="
	var url3 = "&key=AIzaSyAdBXuNGEfEvanuCy9QdzCWSLPsLEZhoM0";
	var $url = url1.concat(lat_lng ,url2 , timestamp, url3);
	console.log($url);
	// $json_timezone = file_get_contents($url);
	$json_timezone = getTimezone($url);
}

function changeColor(hours) {
    //rgb
    console.log('event fired');
    var colors = [0, 10, 30];

    //Will get an valid rgb color
    if (hours > 12){
    	hours = 24 - (hours);
    }

    var color = parseInt(255/12*hours);
    console.log(color);
    for(var i = 0; i < colors.length; i++) {
        colors[i] += color;
    }
    if (hours < 5){
    	document.getElementById("color-this").style.color = "white";
    }
    else{
    	document.getElementById("color-this").style.color = "black";
    }
    //add the color to the element you want:
    document.getElementById("color-this").style.backgroundColor = "rgb("+colors[0] + "," + colors[1] + "," + colors[2] + ")";
    console.log("event fired. color get:" + colors[0] + colors[1] + colors[2]);
}

var hours = new Date().getHours();
var $UTC = Math.floor(Date.now() / 1000);
var interval;

function setHour(dst, raw){
	$UTC = Math.floor(Date.now() / 1000);
	var combined_offset = $UTC + dst + raw;

	hours = Math.floor(combined_offset / 3600) % 24;
	console.log("UTC: " + $UTC + ", DST: " + dst + ", RAW: " + raw + ", Combined: " + combined_offset);
	console.log(hours);
	// hours = (callGoogle(utc) / 3600) % 24;
	// callGoogle(utc);
}

function startInterval() {
    // setInterval of 1000 milliseconds i.e. 1 second
    // to recall the startTime() method again n again
    interval = setInterval("everyTime();", 500);
}

function everyTime() {
    var currentTime = new Date()
	var epoch = currentTime.getTime() / 1000;
	// var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	var seconds = currentTime.getSeconds();
	var ms = currentTime.getMilliseconds();
	var suffix = "AM";
	// hours = 0;
	changeColor(hours);
	if (minutes < 10)
		minutes = "0" + minutes;
	if (seconds < 10)
		seconds = "0" + seconds;
	if (hours >= 12){
		if (hours < 24){
			suffix = "PM";
		}
	}
	var displayed_hours = hours;
	if (hours > 12){
		displayed_hours = hours - 12;
	}
	if (hours === 0){
		displayed_hours = 12;
	}
	var currentTimeString = displayed_hours + ":" + minutes + ":" + seconds + " " + suffix;
	$('#Timer').html(currentTimeString);
}

function stopInterval()   //***********IMPORTANT FUNC******************
{
    // clearInterval to stop the setInterval event
    alert(interval);  
    clearInterval(1);

}

$(document).ready(function(){

	$("#searchForm").submit(function(event) {

		// Stop form from submitting normally
		event.preventDefault();

		// Get some values from elements on the page:
		var $form = $(this),
		term = $form.find("input[name='s']").val(),
		url = $form.attr("action");
		$('#location').empty().append(term);
	});

	var $width = $(window).width();
	
	$("#zaccordion").zAccordion({
		speed: 500,
		slideClass: 'slide',
		animationStart: function () {
			$('#splash').find('li.slide-previous div').fadeOut();
		},
		animationComplete: function () {
			$('#splash').find('li.slide-open div').fadeIn();
		},
		buildComplete: function () {
			$('#splash').find('li.slide-closed div').css('display', 'none');
			$('#splash').find('li.slide-open div').fadeIn();
		},
		startingSlide: 2,
		slideWidth: $width/1.5,
		width: $width,
		height: 500
	});

	//Hard coded locations...hopefully populated in the future, maybe with angular//
	$("#here").click(function(){
		hours = new Date().getHours();
		$('#location').empty().append("Here");
	})
	$("#london").click(function(){
		callGoogle($locations["london"][0], $locations["london"][1]);
		$('#location').empty().append("London");
	});
	$("#san-francisco").click(function(){
		callGoogle($locations["san-francisco"][0], $locations["san-francisco"][1]);
		$('#location').empty().append("San Francisco");
	});
	$("#cairo").click(function(){
		callGoogle($locations["cairo"][0], $locations["cairo"][1]);
		$('#location').empty().append("Cairo");
	});
	$("#new-york").click(function(){
		callGoogle($locations["new-york"][0], $locations["new-york"][1]);
		$('#location').empty().append("New York");
	});
	$("#sydney").click(function(){
		callGoogle($locations["sydney"][0], $locations["sydney"][1]);
		$('#location').empty().append("Sydney");
	});
	$("#beijing").click(function(){
		callGoogle($locations["beijing"][0], $locations["beijing"][1]);
		$('#location').empty().append("Beijing");
	});
	
	startInterval();
 
});
