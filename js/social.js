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

});

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

							showPlaylistNoImages(newPlaylistURI);
							

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
	
	alert("hello");
	$("#showActualPlaylist2").empty();
	tempPlaylist2 = new models.Playlist();
	$.each(tempPlaylist.tracks, function(num, track) {

		tempPlaylist2.add(models.Track.fromURI(track.uri));
	});
	
	//console.log(uriPlaylist.length);
	var i = 0;
	$.each(tempPlaylist2.tracks, function(num, track2) {
		$("#showActualPlaylist2").append(
				'<li class="item" data-id="id-' + i
						+ '" data-type="track"><img height="100" src="'
						+ track2.image + '" /><h3>' + (i + 1) + '.'
						+ track2.name + '(' + track2.artists[0].name
						+ ')</h3></li>');
		// $("#showActualPlaylist2").append("trackuri:"+track2.uri+"cover"+track2.image+"artist"+track2.artists[0].name);
		i++;

	});

	
	//setInterval(function() {
		//updatePl()
	//}, 5000);

}

function updatePl() {

	
	
	
}


function getPlaylistUser() {

	
	var PlaylistMusju = Parse.Object.extend("PlaylistMusju");
	var query = new Parse.Query(PlaylistMusju);
	alert("idUser"+sessionStorage.idUser);
	query.equalTo("idUser", sessionStorage.idUser);
	query.find({
		success : function(results) {
			var i=0;
			alert("playlist ready"+results.length);
		while(i<results.length){
				alert("results:"+results[i]);
				url="'"+results[i].get("url")+"'";
				
				$("#playlistsUser").append('<a onclick="showPlaylistNoImages('+url+')" class="large orange awesome">'+results[i].get("name")+' &raquo;</a> <br /><br />');
			i++;
				}
		
		
		
		},
		error : function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
}
