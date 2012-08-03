function searchInput(args) {	
	// args[0] = page, args[1] = command, args[2] = value
	// e.g. spotify:app:kitchensink:search:play:the+cure+close+to+me
	var query = unescape(args[2].replace(/\+/g, " ")); // clean up the search
														// query
	console.log(query);
	$("#search-term").val(query);
	$("#search-"+args[1]).trigger('click');
}

var asyncCalls = [],  // Initiate for later
	tempPlaylist = new models.Playlist();

function searchPage(){
	alert("hello");
	$("#search-basic").click(function(e){
		var query = $("#search-term").val();
		var type = $(this).attr("id");
		if(query!="") {
			
					$("#search-results2").empty();
					$("#search-results2").append("<h2 class='clackText'>Songs</h2>");
					var search = new models.Search(query);
					search.localResults = models.LOCALSEARCHRESULTS.APPEND;		// Local
																				// files
																				// last
					search.observe(models.EVENT.CHANGE, function() {
						
						$("#search-results").append("<h2 class='blackText'>Tracks</h2>");
						if(search.tracks.length) {
							
							var playlistArt = new views.Player();
							playlistArt.track = tempPlaylist.get(0);
							playlistArt.context = tempPlaylist;
							$("#search-results").append(playlistArt.node);
						var saveButton = "<button id='savePlaylist' class='add-playlist button icon'>Save As Playlist</button>";
							$("#search-results .sp-player").append(saveButton);
							tempPlaylist = new models.Playlist();
							$.each(search.tracks,function(index,track){
								$("#search-results").append('<div><a href="'+track.uri+'">'+track.name+'</a></div>');
								
								// tempPlaylist.add(models.Track.fromURI(track.uri));
								// // Note: artwork is compiled from first few
								// tracks. if any are local it will fail to
								// generate....
							});				
						
							// var playlistList = new views.List(tempPlaylist);
							// playlistList.node.classList.add("temporary");
							// $("#search-results").append(playlistList.node);
						} else {
							$("#search-results").append('<div>No tracks in results</div>');
						}
					});
					search.appendNext();
					
		}
	});
	$("#search-examples a").click(function(e){
		$("#search-term").val($(this).text());
		e.preventDefault();
	});
	$("#savePlaylist").live('click',function(e){
		var myAwesomePlaylist = new models.Playlist($("#search-term").val()+" Tracks");
		$.each(tempPlaylist.data.all(),function(i,track){
			myAwesomePlaylist.add(track);
		});
		e.preventDefault();
	});
	
}

$(function() {
    $("#spotify_song_search").autocomplete({
        source: function(request, response) {
            $.get("http://ws.spotify.com/search/1/track.json", {
                q: request.term
            }, function(data) {
            	var firsts=new Array();
            	firsts[0]=data.tracks[0];
            	firsts[1]=data.tracks[1];
            	firsts[2]=data.tracks[2];
            	firsts[3]=data.tracks[3];
            	firsts[4]=data.tracks[4];
                response($.map(firsts, function(item) {
                    return {label: item.name, track: item};
                }));
            });
        },
        select: function(el, ui) {
                console.log(ui);
                sessionStorage.requestSongUri=ui.item.track.href;
           
        }
    });
});

function asyncComplete(key) {
	asyncCalls.splice(asyncCalls.indexOf(key), 1);
	if(asyncCalls.length==0) {
		console.log('All async calls home safely'); // <insert action that
													// requires all async calls>
	} else {
		console.log(asyncCalls.length+" aysnc calls remaining");
	}
	// Obviously in production you would want a more robust solution that can
	// handle calls that fail!
}


//We access the SPARQL endpoint through YQL to avoid the cross-domain issue
function sparqlQuery(q, callback){
	var pref = 'PREFIX movie:<http://data.linkedmdb.org/resource/movie/>'
		+ 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>'
		+ 'PREFIX foaf: <http://xmlns.com/foaf/0.1/>'
		+ 'PREFIX dc: <http://purl.org/dc/terms/>';
	var url = 'http://linkedbrainz.fluidops.net/sparql?query='+encodeURIComponent(pref+q);
	var yql = 'http://query.yahooapis.com/v1/public/yql?q='+encodeURIComponent('select * from xml where url="'+url+'"')+'&format=json';
	$.ajax({
		url: yql,
		dataType: 'jsonp',
		jsonp: 'callback',
		jsonpCallback: callback
	});

}

var cbfuncAll = function(data) {
	 
	 
	  
		$("#moreInfoResults").append(JSON.stringify(data));
		
  
};


function searchMoreInfo(name,artist,album){

	
	var arrayN=album.split(" ");
	var nameSplited="";
	
	for(x in arrayN){
		if(x==0){
			
			nameSplited=arrayN[x];
		}else{
			nameSplited=nameSplited+" AND "+arrayN[x];
		}
		
	}
	alert(nameSplited);
	
			var q = 'PREFIX luc: <http://www.ontotext.com/owlim/lucene#>'+ 
				'SELECT distinct ?Artist ?v ?result'+ 
					' WHERE { ?Object luc:luceneIndex "'+artist+'". '+ 
				' ?Object2 luc:luceneIndex "'+nameSplited+'" .'+
						' ?Release rdfs:label ?Object2 . '+
						' ?Release rdf:type purl-mo:Release . '+
						' ?Release foaf:maker ?Artist .'+
						' ?Artist foaf:name ?Object . '+
						' ?Artist rdf:type purl-mo:MusicArtist .  '+
						' ?Artist ?v ?result.} '+

						' LIMIT 1000 ';
			
			alert("q:"+q);
			sparqlQuery(q, 'cbfuncAll');
		
	
	

  }