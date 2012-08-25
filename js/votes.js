//requires URL of the playlist we're calculating the votes for
//sets votes=0 to the track with most votes
//calls updatePlaylist with the trackURL of next song to play
function nextSong(playlistURL) {
	
	var TrackPlaylistMusju = Parse.Object.extend("TrackPlaylistMusju");
	var query = new Parse.Query(TrackPlaylistMusju);
	query.equalTo("urlPlaylist", playlistURL);
	query.descending("votes");
	query.first({
  		success: function(track) {
    		//Successfully retrieved the track with most votes.
    		track.set("votes", 0);
    		track.save();
    		console.log(track.get("urlTrack"));
    		updatePlaylist(track.get("urlTrack"),playlistURL);
  		},
  		error: function(error) {
    		alert("Error: " + error.code + " " + error.message);
    		return "hello";
  		}
	});

}

function testNextSong() {
	nextSong('http://open.spotify.com/user/shara_sgm/playlist/6xGeQ46kWrpEJfszBXZeh6');
	nextSong('http://open.spotify.com/user/shara_sgm/playlist/5l4wrbYGMorl2XGZ90TOsw');	
} 