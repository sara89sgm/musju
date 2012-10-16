var nameSongSelected='';
var hrefSong='';

var placeId='';
var placeName='';
var idSongObj='';


//Initialize Facebook
	var accessTokenFB='';
	//var idUser='';
	window.onload = function() {
        /* Instantiate the global sp object; include models */
        var sp = getSpotifyApi(1);
        var auth = sp.require('sp://import/scripts/api/auth');

        /* Set the permissions you want from the user. For more
         * info, check out http://bit.ly/A4KCW3 */
        var permissions = ['user_about_me'];
        var app_id = '403799456325756';
        var fbButtonHTML = document.getElementById('fb-login');

        fbButtonHTML.addEventListener('click', authFB);

        function authFB() {
            auth.authenticateWithFacebook(app_id, permissions, {
                onSuccess: function(accessToken, ttl) {
                	accessTokenFB=accessToken;
                	
                	
                    
                },
                onFailure: function(error) {
                    console.log('Authentication failed with error: ' + error);
                },
                onComplete: function() { }
            });
        }
    }


function showMap(){
localStorage.lat = 37.7879938 ;
localStorage.lng = -122.4074374 ; 
getPlacesMap();
                                         
}


function getPlacesMap(){
   
    
  alert("hello");
   
    
    FB.api('search?center='+localStorage.lat+','+localStorage.lng, { limit: 10, type: 'place', distance : 1000 }, function(response) {
           
           var place=response.data[0];
           var i=0;
           
           while(((typeof(place)) != 'undefined') && (i<10)){
           
           
           var latitudeAndLongitudeOne = new google.maps.LatLng(place.location.latitude,place.location.longitude);
           
           var markerOne = new google.maps.Marker({
                                                  position: latitudeAndLongitudeOne,
                                                  map: map_object
                                                  });
           
                      
           showGenre(place.id, place.name);
      
           
           
           i++;
           place=response.data[i];
           
           }
        
           
           }); 
    
    
    
}

function showGenre(venueID, placeName){
   
    var VenuesGenre = Parse.Object.extend("VenuesGenre");
    var query = new Parse.Query(VenuesGenre);
    query.equalTo("venueID", venueID);
    query.find({
                success: function(object) {
                alert(object.length);
                if(object.length>0){
                alert("encontrado"+placeName+" "+venueID);
                $("#listPlacesNow").append('<li><a href="#" ><h3>'+object.get("venueID")+' ('+object.get("genre")+')</h3></a></li>');
                }else{
                var venuesTracks = Parse.Object.extend("VenuesTracksTest");
                var query = new Parse.Query(venuesTracks);
                query.equalTo("venueID", venueID); //add to the query "only the last 20 songs"
                
                query.find({
                           success: function(results) {
                           if(results.length>0){
                           alert("encontrado pero calculando");
                           getTopGenreForSpecificVenue(place.id);
                           setTimeout('showGenre('+venueID+','+placeName+')', 3000);
                           }else{
                           alert("There is no data for that location: "+placeName);
                           }
                           
                           },
                           error: function(error) {
                           alert("Error: " + error.code + " " + error.message);
                           }
                           });
                }
                
                },
                error: function(error) {
                
                
                
                

                }
                });
    
    
    
    
    
}






