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
/*function sparqlQuery(q, callback){
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
    
}*/

function sparqlQuery(q, callback){
 var pref ='PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> '
 + 'PREFIX foaf: <http://xmlns.com/foaf/0.1/> '
 + 'PREFIX dc: <http://purl.org/dc/terms/> ';
 var urlLD = 'http://linkedbrainz.fluidops.net/sparql?query='+encodeURIComponent(pref+q)+'&format=application%2Fsparql-results%2Bjson';
    console.log(urlLD);
    
   
 //var yql = 'http://query.yahooapis.com/v1/public/yql?q='+encodeURIComponent('select * from xml where url="'+urlLD+'"')+'&format=json';
 $.ajax({
 url: urlLD,
 dataType: 'json',
   success: function(data) { 
        getDataLD(data);
        },
 });
 
 }

function getDataLD(data){
    $("#moreInfoResults").empty();
      $("#moreInfoResults").append(' <hr>');
    $("#moreInfoResults").append('<h3 class="blackText"> Other release of this artist: </h3> </br>');
    $("#moreInfoResults").append('<ul>');
     var i=0;
    release=data.results.bindings[0];
    while(((typeof(release)) != 'undefined') && (i<5)){
          $("#moreInfoResults").append('<li><a href="'+release.Release.value+'">'+release.result.value+'</a></li>');
        i++
        release=data.results.bindings[i];
    }
    $("#moreInfoResults").append('</ul>');
    console.log(JSON.stringify(data));
}
var cbfuncAll = function(data) {
    var arrayResults=data.query.results.sparql.results.result;
    var release=arrayResults[0];
    var i=0;
    while(((typeof(place)) != 'undefined') && (i<15)){
        type=release.binding[1].uri;
        alert("type:"+type);
        if(type=='http://xmlns.com/foaf/0.1/made'){
            alert("buscar");
    $.ajax({
           url: 'http://musicbrainz.org/ws/2/release/62bef034-b779-30dd-bbfd-a2035d0e0f74#_',
           method: 'GET',
           dataType: 'xml',
           success : function(result) {
           title=$(result).find("title").text()
           $("#moreInfoResults").append('<a href="'+uri+'">'+title+'</a>');
           }
           });
        }
        i++;
        release=arrayResults[i];
    }
		// 
		
  
};


function searchMoreInfo(name,artist,album){

	
	var q = 'PREFIX luc: <http://www.ontotext.com/owlim/lucene#> '+ 
 
    ' SELECT distinct ?Release ?v ?result' + 
    ' WHERE { '+
        '?Artist foaf:name  "'+artist+'". ' +
        '?Artist rdf:type purl-mo:MusicArtist .' +
        '?Release rdf:type purl-mo:Release.'+
        '?Release foaf:maker ?Artist .'+ 
        '?Release dcterms:title ?result.'+
          ' } LIMIT 100';
			
			alert("q:"+q);
			sparqlQuery(q, 'cbfuncAll');
		
	
	

  }