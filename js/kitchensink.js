/**
 *      by @ptrwtts             
 *		https://github.com/ptrwtts/kitchensink
 *		Free to distribute under MIT and all that jazz
 */

// Initialize the Spotify objects
var sp = getSpotifyApi(1),
	models = sp.require("sp://import/scripts/api/models"),
	views = sp.require("sp://import/scripts/api/views"),
	ui = sp.require("sp://import/scripts/ui");
	player = models.player,
	library = models.library,
	application = models.application,
	playerImage = new views.Player();
	
//Initialize Parse
	

	Parse.initialize("UD2mcikqPwaRl7i4a8erG5wSZvj9XcfAfGNR6vXn", "29je5N9Fz4tz7ymc9XcQ4ymStqyfNVQzIIgwtG2J");

	
	//Initialize Parse with Facebook
	
	window.fbAsyncInit = function() {
		  Parse.FacebookUtils.init({
		    appId      : '403799456325756', // Facebook App ID
		    channelUrl : 'http://musju.herokuapp.com/', // Channel File
		    status     : true, // check login status
		    cookie     : true, // enable cookies to allow the server to access the session
		    xfbml      : true  // parse XFBML
		  });

		  // Additional initialization code here
		};	

// Handle URI arguments
application.observe(models.EVENT.ARGUMENTSCHANGED, handleArgs);
	
function handleArgs() {
	var args = models.application.arguments;
	$(".section").hide();	// Hide all sections
	$("#"+args[0]).show();	// Show current section
	console.log(args);
	
	// If there are multiple arguments, handle them accordingly
	if(args[1]) {		
		switch(args[0]) {
			case "search":
				searchInput(args);
				break;
			case "social":
				socialInput(args[1]);
				break;
		}
	}
}

// Handle items 'dropped' on your icon
application.observe(models.EVENT.LINKSCHANGED, handleLinks);

function handleLinks() {
	var links = models.application.links;
	if(links.length) {
		switch(links[0].split(":")[1]) {
			case "user":
				socialInput(links[0].split(":")[2]);
				break;
			default:
				// Play the given item
				player.play(models.Track.fromURI(links[0]));
				break;
		}		
	} 
}

function login(){
	$("#login").hide();
	$("#restApp").show();
	window.location.href = 'spotify:app:musju:home';
}

function loginFB(){
	
		Parse.FacebookUtils.logIn(null, {
			  success: function(user) {
			    if (!user.existed()) {
			      alert("User signed up and logged in through Facebook!");
			    } else {
			      alert("User logged in through Facebook!");
			    }
			    $("#login").hide();
				$("#restApp").show();
				window.location.href = 'spotify:app:musju:home';
			  },
			  error: function(user, error) {
			    alert("User cancelled the Facebook login or did not fully authorize.");
			  }
			});
	
}

$(function(){
	
	console.log('Loaded.');
	
	// Run on application load
	handleArgs();
	handleLinks();
        $("#createPlaylist").hide();
        $("#restApp").hide();
	
});



