const Handlebars = require('handlebars');

var uri = "ws://jukebox.local:8081";
var conn = null;

track_list = document.getElementById('track_list')

// store a template for a track for updating playlist
Handlebars.registerHelper('url_encoder', function(file) {
  return new Handlebars.SafeString(encodeURIComponent(file));
});

Handlebars.registerHelper('if', function(conditional, options) {
  if(conditional) {
    return options.fn(this);
  }
});

var trackTemplate = Handlebars.compile('{{#each tracks}}'+
  '<tr data-file="{{file}}" class="{{user_rating}}">'+
    '<td class="track_time_to_play">{{eta}}</td>'+
    // '<td class="track_duration">{{duration}}</td>'+
    '<td class="track_title">{{title}}</td>'+
    '<td class="track_artist">{{artist}}</td>'+
    '<td class="track_rating"><span class="{{rating_class}}">{{rating}} {{{rating_icon}}}</span></td>'+
    '<td class="track_added_by {{added_by}}"><span>{{added_by}}</span> <a class="search_helper info_link" href="/statistics/track_info?file={{{url_encoder file}}}" title="Track information"><i class="fa fa-info-circle"></i></a></td>'+
  '</tr>'+
'{{/each}}');

var updatePlaylist = function(playlist){
    track_list.innerHTML = trackTemplate(playlist);
    // updateCurrentSongHighlight(playlist.current_track);

    playlist_table = document.getElementById('playlist_table')

    for (var i = 0, row; row = playlist_table.rows[i]; i++) {
      row.classList.remove('current');
      if (row.getAttribute('data-file') == playlist.current_track) {
        row.classList.add('current');
      }
    }

  // track_list.children('.current').removeClass('current');
  // track_list.children().filter(function(){
  //   return $(this).data('file') == filename;
  // }).addClass('current');
}

function start() {
  console.log('Connecting to WebSocket: ' + uri + '...')
  conn = new WebSocket(uri);

  conn.onopen = () => {
    console.log("Socket opened!");
  };

  conn.onerror = (e) => {
    console.log("Socket error: " + e.message);
    check();
  };

  conn.onclose = (e) => {
    console.log("Socket closed: " + e.code + ' reason:' + e.reason);
    check();
  };

  conn.onmessage = (msg) => {
    data = JSON.parse(msg.data);

    if ("playlist" in data) {
      updatePlaylist(data["playlist"]);
    }

  }
}

function check(){
  if(!conn || conn.readyState == 3) start();
}

start();

setInterval(check, 5000);
