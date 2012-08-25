//requires URL of the playlist we're calculating the votes for
//return trackURL of next song to play
function nextSong(playlistURL) {
	
	var TrackPlaylistMusju = Parse.Object.extend("TrackPlaylistMusju");
	var query = new Parse.Query(TrackPlaylistMusju);
	query.equalTo("urlPlaylist", playlistURL);
	query.descending("votes");
	query.first({
  		success: function(track) {
    		// Successfully retrieved the track with most votes.
    		console.log(track);
    		console.log(track.get("votes"));
    		track.set("votes", 0);
    		track.save();
    		return track.get("urlTrack");
  		},
  		error: function(error) {
    		alert("Error: " + error.code + " " + error.message);
  		}
	});

}

function testNextSong() {
	alert(nextSong('http://open.spotify.com/user/shara_sgm/playlist/6xGeQ46kWrpEJfszBXZeh6'));
} 