function socialInput(uriPl) {
	showTracks(uriPl);
}

var tempPlaylist;
var newPlaylistURI;
var playingPlaylist = new models.Playlist();

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
		// alert("uri: " + uri);
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
	lng = position.coords.longitude;
	lat = position.coords.latitude;
	console.log("fine geolocation");
}

function errorGeo(msg) {

	console.log("error geolocation" + msg.code);
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
							saveTracksPlaylist(newPlaylistURI);
							showPlaylistImages(newPlaylistURI);

						},
						error : function(newplaylist, error) {
							// The save failed.
							// error is a Parse.Error with an error code and
							// description.
						}
					});

}

function checkPlaylistNoExists(url) {
	var PlaylistMusju = Parse.Object.extend("PlaylistMusju");
	var query = new Parse.Query(PlaylistMusju);

	query.equalTo("url", url);
	query
			.find({
				success : function(results) {
					alert("playlists: " + results.length);
					if (results.length == 0) {
						createNewPlaylist();
					} else {
						alert("The playlist already exists, select it to listen to it and manage it");
					}

				},
				error : function(error) {

				}
			});

}
function saveTracksPlaylist(url) {

	var tempPlaylist = new models.Playlist.fromURI(url);

	tempPlaylist2 = new models.Playlist();
	$.each(tempPlaylist.tracks, function(num, track) {

		tempPlaylist2.add(models.Track.fromURI(track.uri));
	});

	// console.log(uriPlaylist.length);
	var i = 0;
	$.each(tempPlaylist2.tracks, function(num, track2) {
		var TrackPlaylistMusju = Parse.Object.extend("TrackPlaylistMusju");
		var newtrack = new TrackPlaylistMusju();

		newtrack.set("urlTrack", track2.uri);
		newtrack.set("nameTrack", track2.name);
		newtrack.set("nameArtist", track2.artists[0].name);
		newtrack.set("urlPlaylist", url);
		newtrack.set("idUser", sessionStorage.idUser);
		newtrack.set("votes", 0);

		newtrack.save(null, {
			success : function(newplaylist) {

			},
			error : function(newplaylist, error) {
				// The save failed.
				// error is a Parse.Error with an error code and
				// description.
			}
		});

	});
}

function showPlaylistNoImages(uriPl) {
	var uriPlaylist = new models.Playlist.fromURI(uriPl);
	tempPlaylist = new models.Playlist();
	console.log(uriPlaylist.length);
	$.each(uriPlaylist.tracks, function(num, track) {

		tempPlaylist.add(models.Track.fromURI(track.uri));
	});
	var playlistList = new views.List(tempPlaylist);
	playlistList.node.classList.add("temporary");
	$("#title-actualPl").html(
			'<h3 class="blackText">' + uriPlaylist.name + '</h3>');
	$("#showActualPlaylist2").empty();
	$("#showActualPlaylist2").append(playlistList.node);
	window.location.href = 'spotify:app:musju:playlist';
	$("#friend-tracks").empty();

	$("#friend-drop").empty();
}

//Show the tracks with the images of the album in the Playlist Tab

function showPlaylistImages(uriPlaylist) {
	sessionStorage.first=0;
	var tempPlaylist = new models.Playlist.fromURI(uriPlaylist);
	sessionStorage.actualPlaylist = uriPlaylist;

	$("#actualSong").empty();
	$("#nextsong").empty();
	$("#possibleSongs").empty();
	tempPlaylist2 = new models.Playlist();
	$.each(tempPlaylist.tracks, function(num, track) {

		tempPlaylist2.add(models.Track.fromURI(track.uri));
	});

	$("#title-actualPl").append(tempPlaylist.name);
	// console.log(uriPlaylist.length);
	var i = 0;
	$
			.each(
					tempPlaylist2.tracks,
					function(num, track2) {
						switch (i) {
						case 0:

							var trackAux = models.Track.fromURI(track2.uri);
							
							playingPlaylist.add(trackAux);
							var playerView2 = new views.Player();
							// playerView2.track = null; // Don't play the track right away
							playerView2.context = playingPlaylist;
							$('#actualSong').append(playerView2.node);
							$('#actualSong')
									.append(
											'<a class="more medium orange awesome""  style="float:right">More</a>');
							$('#actualSong').append(
									'<div id="moreInfoResults"></div>');
							var nameS = trackAux.name;
							var artist = "";

							$('a.more').click(
									function(e) {

										if ($(this).parent().hasClass("open")) {
											$(this).parent().animate({
												"height" : 125
											}).removeClass("open");
											$(this).html("More...");
											$("#moreInfoResults").empty();

										} else {

											$(this).parent().animate({
												"height" : 300
											}).addClass("open");
											$(this).html("Less...");
											alert(track2.album.name);
											moreInfo(track2.name,
													track2.artists[0].name,
													track2.album.name);

										}
										e.preventDefault();
									});

							break;
						case 1:
							$("#nextsong")
									.append(
											'<a class="item" data-id="id-'
													+ i
													+ '" data-type="track"><img height="100" src="'
													+ track2.image
													+ '" /><h3 class="blackText">'
													+ track2.name + '('
													+ track2.artists[0].name
													+ ')</h3></a>');
							var trackAux2 = models.Track.fromURI(track2.uri);
							
							playingPlaylist.add(trackAux2);
							localStorage.nextTrackURI=track2.uri;

							break;
						default:
							$("#possibleSongs")
									.append(
											'<li class="item" data-id="id-'
													+ i
													+ '" data-type="track"><img height="100" src="'
													+ track2.image
													+ '" /><h4 class="blackText">'
													+ track2.name + '('
													+ track2.artists[0].name
													+ ')</h4></li>');
						}

						// $("#showActualPlaylist2").append("trackuri:"+track2.uri+"cover"+track2.image+"artist"+track2.artists[0].name);
						i++;

					});

	window.location.href = 'spotify:app:musju:playlist';
	$("#friend-tracks").empty();

	$("#friend-drop").empty();
	$("#friend-drop").append("Drag and drop your playlist!");

	 setInterval(function() {
	 checkAddedTracks()
	 }, 5000);

}

//Update the NextSong div with the new selected song
function updatePlaylist(uriTrack, uriPlaylist) {
	
	var trackAux2 = models.Track.fromURI(uriTrack);
	alert("next:"+trackAux2.name);
	$("#nextsong").empty();
	/*$("#nextsong")
	.append(
			'<a class="item" data-id="id-'
					+ i
					+ '" data-type="track"><img height="100" src="'
					+ trackAux2.image
					+ '" /><h3 class="blackText">'
					+ trackAux2.name + '('
					+ trackAux2.album.artist.name
					+ ')</h3></a>');*/


playingPlaylist.add(trackAux2);
localStorage.nextTrackURI=trackAux2.uri;
updateOtherSongsPlaylist(uriPlaylist);
	

}

//Update playlist when the song change to the nextSong
player.observe(models.EVENT.CHANGE, function (e) {

	// Only update the page if the track changed
	if (e.data.curtrack == true) {
		if(sessionStorage.first==0){
			sessionStorage.first=1;
		}else{
		updatePagePlaylist(player.track.uri);
		}
	}
});

//Change Playing with the Nextsong track and call vote() to get the nextSong
function updatePagePlaylist(uri){
	var trackAux = models.Track.fromURI(uri);
	alert("here"+trackAux.name);
	
	var playerView = new views.Player();

	playerView.context = playingPlaylist;
	
	$('#actualSong').empty();
	$('#actualSong').append(playerView.node);
	/*$('#actualSong')
			.append(
					'<a class="more medium orange awesome""  style="float:right">More</a>');
	$('#actualSong').append(
			'<div id="moreInfoResults"></div>');*/
	var nameS = trackAux.name;
	var artist = "";

	$('a.more').click(
			function(e) {

				if ($(this).parent().hasClass("open")) {
					$(this).parent().animate({
						"height" : 125
					}).removeClass("open");
					$(this).html("More...");
					$("#moreInfoResults").empty();

				} else {

					$(this).parent().animate({
						"height" : 300
					}).addClass("open");
					$(this).html("Less...");
					alert(track2.album.name);
					moreInfo(track2.name,
							track2.artists[0].name,
							track2.album.name);

				}
				e.preventDefault();
			});
	localStorage.actualTrackURI=trackAux.uri;
	nextSong(sessionStorage.actualPlaylist);
	
}

//Updating the rest of the songs

function updateOtherSongsPlaylist(uri){
	var tempPlaylist = new models.Playlist.fromURI(uri);
	$("#possibleSongs").empty();
	tempPlaylist2 = new models.Playlist();
	$.each(tempPlaylist.tracks, function(num, track) {

		tempPlaylist2.add(models.Track.fromURI(track.uri));
	});

	
	// console.log(uriPlaylist.length);
	var i = 0;
	$
			.each(
					tempPlaylist2.tracks,
					function(num, track2) {
					if(track2.uri!=localStorage.actualTrackURI &&track2.uri!=localStorage.nextTrackURI){
							$("#possibleSongs")
									.append(
											'<li class="item" data-id="id-'
													+ i
													+ '" data-type="track"><img height="100" src="'
													+ track2.image
													+ '" /><h4 class="blackText">'
													+ track2.name + '('
													+ track2.artists[0].name
													+ ')</h4></li>');
					}

						i++;

					});
}



function checkAddedTracks(){
	
	var RequestTrack = Parse.Object.extend("RequestTrack");
	var query = new Parse.Query(RequestTrack);

	query.equalTo("urlPlaylist", sessionStorage.actualPlaylist);
	query.find({
		success : function(results) {
			var i = 0;

			while (i < results.length) {

				addSongPlaylist(results[i].get("urlTrack"), sessionStorage.actualPlaylist);
				i++;
			}

		},
		error : function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
	
}

function getPlaylistUser() {

	var PlaylistMusju = Parse.Object.extend("PlaylistMusju");
	var query = new Parse.Query(PlaylistMusju);

	query.equalTo("idUser", sessionStorage.idUser);
	query.find({
		success : function(results) {
			var i = 0;

			while (i < results.length) {

				url = "'" + results[i].get("url") + "'";

				$("#playlistsUser").append(
						'<a href="spotify:app:musju:playlist" onclick="showPlaylistImages('
								+ url + ')" class="large orange awesome">'
								+ results[i].get("name")
								+ ' &raquo;</a> <br /><br />');
				i++;
			}

		},
		error : function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
}

function requestSong() {
	addSongPlaylist(sessionStorage.requestSongUri,sessionStorage.actualPlaylist);
	

}

function addSongPlaylist(uri, playlist){
	var track = models.Track.fromURI(uri);
	var TrackPlaylistMusju = Parse.Object.extend("TrackPlaylistMusju");
	var query = new Parse.Query(TrackPlaylistMusju);

	query.equalTo("urlTrack", track.uri);
	query.equalTo("urlPlaylist", playlist);
	query.first({
		success : function(results) {

			alert("This track is already in the playlist");

		},
		error : function(error) {
			
			var tempPlaylist = new models.Playlist.fromURI(
					sessionStorage.actualPlaylist);
			// Add the track
			tempPlaylist.add(track);
			var last = tempPlaylist.length;
			last--;
			$("#possibleSongs")
					.append(
							'<li class="item" ><img height="100" src="'
									+ tempPlaylist.tracks[last].image
									+ '" /><h4 class="blackText">'
									+ tempPlaylist.tracks[last].name + '('
									+ tempPlaylist.tracks[last].artists[0].name
									+ ')</h4></li>');

			var TrackPlaylistMusju = Parse.Object.extend("TrackPlaylistMusju");
			var newtrack = new TrackPlaylistMusju();

			newtrack.set("urlTrack", track.uri);
			newtrack.set("nameTrack", track.name);
			newtrack.set("nameArtist", track.artists[0].name);
			newtrack.set("urlPlaylist", sessionStorage.actualPlaylist);
			newtrack.set("idUser", sessionStorage.idUser);
			newtrack.set("votes", 1);

			newtrack.save(null, {
				success : function(newplaylist) {

				},
				error : function(newplaylist, error) {
					// The save failed.
					// error is a Parse.Error with an error code and
					// description.
				}
			});
			

		}

	});
	voteTrack(uri, playlist);
}

function moreInfo(name, artist, album) {

	/*
	 * $.get("http://ws.spotify.com/search/1/track.json", { q: ""+name+"
	 * "+artist }, function(data) { alert("data"+data); });
	 */
	searchMoreInfo(name, artist, album);
}

function voteTrack(urlTrack, urlPlaylist) {
	var TrackPlaylistMusju = Parse.Object.extend("TrackPlaylistMusju");
	var query = new Parse.Query(TrackPlaylistMusju);
	query.equalTo("urlTrack", track.uri);
	query.equalTo("urlPlaylist", playlist);
	
	query.first({
	 
		success : function(track) {
			votes = track.get("votes");
		
			votes++;
			track.set("votes", votes);
			newVotes = track.get("votes");
			alert("You have voted the track! Wait to listen to it! :)");
			track.save();
			// The object was retrieved successfully.
		},
		error : function(object, error) {
			alert("Error");
			// The object was not retrieved successfully.
			// error is a Parse.Error with an error code and description.
		}
	});
}
