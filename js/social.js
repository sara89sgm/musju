function socialInput(uriPl) {
	showTracks(uriPl);
}

var tempPlaylist;
var newPlaylistURI;

$(function() {

	var drop = document.querySelector('#friend-drop');
	drop.addEventListener('dragenter', handleDragEnter, false);
	drop.addEventListener('dragover', handleDragOver, false);
	drop.addEventListener('dragleave', handleDragLeave, false);
	drop.addEventListener('drop', handleDrop, false);

	function handleDragEnter(e) {
		this.style.background = '#444444';
	}

	function handleDragOver(e) {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy'; // See the section on the
											// DataTransfer object.
		return false;
	}

	function handleDragLeave(e) {
		this.style.background = '#333333';
	}

	function handleDrop(e) {
		this.style.background = '#333333';
		var uri = e.dataTransfer.getData('Text');
		//alert("uri:  " + uri);
		if (uri.split("/")[5] == "playlist") {

			newPlaylistURI = uri;

			showTracks(uri);
		}
	}
	

	
	if (navigator.geolocation) {
		  navigator.geolocation.getCurrentPosition(successGeo, errorGeo);
		} else {
		  error('not supported');
		}
	

});

function successGeo(position) {
	  lng=position.coords.longitude;
	  lat=position.coords.latitude;
	  console.log("fine geolocation");
	}

	function errorGeo(msg) {
	
	  
	  console.log("error geolocation"+msg.code);
	}

function showTracks(uriPl) {

	var uriPlaylist = new models.Playlist.fromURI(uriPl);
	tempPlaylist = new models.Playlist();
	console.log(uriPlaylist.length);
	$.each(uriPlaylist.tracks, function(num, track) {

		tempPlaylist.add(models.Track.fromURI(track.uri));
	});
	var playlistList = new views.List(tempPlaylist);
	playlistList.node.classList.add("temporary");
	$("#friend-title").html(uriPlaylist.name);
	$("#friend-tracks").empty();
	$("#friend-tracks").append(playlistList.node);
	$("#friend-drop").empty();
	$("#friend-drop").append(uriPlaylist.name);
}

function submitPlaylist() {
	alert("Creating new Musju Playlist...");
	checkPlaylistNoExists(newPlaylistURI);
	

}

function createNewPlaylist() {
	var PlaylistMusju = Parse.Object.extend("PlaylistMusju");
	var newplaylist = new PlaylistMusju();
	var uriPlaylist = new models.Playlist.fromURI(newPlaylistURI);
	var nameP = uriPlaylist.name;
	newplaylist.set("url", newPlaylistURI);
	newplaylist.set("name", nameP);
	newplaylist.set("latitude", 0.0);
	newplaylist.set("longitude", 0.0);
	newplaylist.set("idUser", sessionStorage.idUser)
	
	

	newplaylist
			.save(
					null,
					{
						success : function(newplaylist) {
							alert("You have created a new Musju Playlist...start sharing it!!");

							showPlaylistImages(newPlaylistURI);
							

						},
						error : function(newplaylist, error) {
							// The save failed.
							// error is a Parse.Error with an error code and
							// description.
						}
					});
	
	
}

function checkPlaylistNoExists(url){
	var PlaylistMusju = Parse.Object.extend("PlaylistMusju");
	var query = new Parse.Query(PlaylistMusju);
	
	query.equalTo("url", url);
	query.find({
	  success: function(results) {
		  alert("playlists: "+results.length);
		  if(results.length==0){
			  createNewPlaylist();}else{
				  alert("The playlist already exists, select it to listen to it and manage it" );
			  }
		 
	   
	  },
	  error: function(error) {
			
			
	    	  }
	});
	
}

function showPlaylistNoImages(uriPl){
	var uriPlaylist = new models.Playlist.fromURI(uriPl);
	tempPlaylist = new models.Playlist();
	console.log(uriPlaylist.length);
	$.each(uriPlaylist.tracks, function(num, track) {

		tempPlaylist.add(models.Track.fromURI(track.uri));
	});
	var playlistList = new views.List(tempPlaylist);
	playlistList.node.classList.add("temporary");
	$("#title-actualPl").html('<h3 class="blackText">'+uriPlaylist.name+'</h3>');
	$("#showActualPlaylist2").empty();
	$("#showActualPlaylist2").append(playlistList.node);
	window.location.href = 'spotify:app:musju:playlist';
	$("#friend-tracks").empty();
	
	$("#friend-drop").empty();
}

function showPlaylistImages(uriPlaylist) {
	var tempPlaylist = new models.Playlist.fromURI(uriPlaylist);
sessionStorage.actualPlaylist=uriPlaylist;
	
	$("#actualSong").empty();
	$("#nextsong").empty();
	$("#possibleSongs").empty();
	tempPlaylist2 = new models.Playlist();
	$.each(tempPlaylist.tracks, function(num, track) {

		tempPlaylist2.add(models.Track.fromURI(track.uri));
	});
	
	$("#title-actualPl").append(tempPlaylist.name);
	//console.log(uriPlaylist.length);
	var i = 0;
	$.each(tempPlaylist2.tracks, function(num, track2) {
		switch(i)
		{
		case 0:
			
			  var trackAux = models.Track.fromURI(track2.uri);
			var playlistt = new models.Playlist();
            playlistt.add(trackAux);
			var playerView2 = new views.Player();
           // playerView2.track = null; // Don't play the track right away
            playerView2.context = playlistt;
            $('#actualSong').append(playerView2.node);
            $('#actualSong').append( '<a class="more medium orange awesome""  style="float:right">More</a>');
            $('#actualSong').append( '<div id="moreInfoResults"></div>');
            var nameS=trackAux.name;
            var artist="";
          
            
            
        	$('a.more').click(function(e){
        		
        	    if($(this).parent().hasClass("open")){
        	        $(this).parent().animate({"height":125}).removeClass("open");
        	        $(this).html("More...");
        	        $("#moreInfoResults").empty();
        	        
        	    }else{
        	    	
        	        $(this).parent().animate({"height":300}).addClass("open");
        	        $(this).html("Less...");
        	        alert(track2.album.name);
        	        moreInfo(track2.name, track2.artists[0].name, track2.album.name);
        	        
        	    }
        	    e.preventDefault();
        	});
  
		  break;
		case 1:
			$("#nextsong").append(
					'<a class="item" data-id="id-' + i
							+ '" data-type="track"><img height="100" src="'
							+ track2.image + '" /><h3 class="blackText">'
							+ track2.name + '(' + track2.artists[0].name
							+ ')</h3></a>');
			
		  break;
		default:
			$("#possibleSongs").append(
					'<li class="item" data-id="id-' + i
							+ '" data-type="track"><img height="100" src="'
							+ track2.image + '" /><h4 class="blackText">' 
							+ track2.name + '(' + track2.artists[0].name
							+ ')</h4></li>');
		}
		
		// $("#showActualPlaylist2").append("trackuri:"+track2.uri+"cover"+track2.image+"artist"+track2.artists[0].name);
		i++;
		

	});

	
	window.location.href = 'spotify:app:musju:playlist';
	$("#friend-tracks").empty();
	
	$("#friend-drop").empty();
	$("#friend-drop").append("Drag and drop your playlist!");
	
	//setInterval(function() {
		//updatePl()
	//}, 5000);

}

function updatePl() {

	
	
	
}


function getPlaylistUser() {

	
	var PlaylistMusju = Parse.Object.extend("PlaylistMusju");
	var query = new Parse.Query(PlaylistMusju);
	
	query.equalTo("idUser", sessionStorage.idUser);
	query.find({
		success : function(results) {
			var i=0;
			
		while(i<results.length){
			
				url="'"+results[i].get("url")+"'";
				
				$("#playlistsUser").append('<a href="spotify:app:musju:playlist" onclick="showPlaylistImages('+url+')" class="large orange awesome">'+results[i].get("name")+' &raquo;</a> <br /><br />');
			i++;
				}
		
		
		
		},
		error : function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
}

function requestSong(){
	  var track = models.Track.fromURI(sessionStorage.requestSongUri);
      // Create a playlist object from a URI
     
      var tempPlaylist = new models.Playlist.fromURI(sessionStorage.actualPlaylist);
      // Add the track
      tempPlaylist.add(track);
      var last=tempPlaylist.length;
      last--;
      $("#possibleSongs").append(
				'<li class="item" ><img height="100" src="'
						+ tempPlaylist.tracks[last].image + '" /><h4 class="blackText">' 
						+ tempPlaylist.tracks[last].name + '(' + tempPlaylist.tracks[last].artists[0].name
						+ ')</h4></li>');

	
}

function moreInfo(name, artist,album){
	
	 /* $.get("http://ws.spotify.com/search/1/track.json", {
          q: ""+name+" "+artist
      }, function(data) {
      	alert("data"+data);
      });*/
	searchMoreInfo(name,artist,album);
}
