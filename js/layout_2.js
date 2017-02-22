const electron = require('electron')
const {ipcRenderer} = require('electron')
const storage = require('electron-json-storage');
const {app} = electron
const BrowserWindow = electron.BrowserWindow

var playState;
var timeUpdater;
var current_track_file;
var uri = "ws://jukebox.local:8081";
var conn = null;

var current_user;
var current_user_id;

// SET values from persistent store
storage.get('user_id', function(error, data) {
  if (error) throw error;
  if (typeof(data) == 'object') {
    return console.log('Object returned expected value')
  }

  current_user_id = data
});

storage.get('initials', function(error, data) {
  if (error) throw error;
  if (typeof(data) == 'object') {
    return console.log('Object returned expected value')
  }

  current_user = data
});
// Vote listener
ipcRenderer.on('voteUp', (event, arg) => {
  if (!hasClass(vote_up, 'voted')) {
    vote(1)
  }
})
ipcRenderer.on('voteDown', (event, arg) => {
  if (!hasClass(vote_down, 'voted')) {
    vote(0)
  }
})

current_track = document.getElementById("current_track")
current_artist = document.getElementById("current_artist")
current_album = document.getElementById("current_album")
progress_bar = document.getElementById('progressbar')
current_owner = document.getElementById('current_owner')
rating_count = document.getElementById('rating_bubble')
user_positive_votes = document.getElementById('user_positive_votes')
user_negative_votes = document.getElementById('user_negative_votes')
user_no_votes = document.getElementById('user_no_votes')
vote_up = document.getElementById('vote_up')
vote_down = document.getElementById('vote_down')

var buildMPDMessage = function(command, value){
  var payload = { user_id: current_user_id };
  payload[command] = (value || '');
  var json_payload = JSON.stringify(payload);

  console.log('buildMPDMessage: ' + command + ' : ' + json_payload);

  return json_payload;
};

function updateCurrentSong(track){
  if (track.artwork_url) {
    document.getElementById('artwork_background').style.backgroundImage = "url('"+track.artwork_url+"')";
    document.getElementById('artwork').src = track.artwork_url
  }

  current_track.innerHTML = track.title || '-'
  current_track.setAttribute('title', track.title)
  current_artist.innerHTML = track.artist || '-'
  current_artist.setAttribute('title', track.artist)
  current_album.innerHTML = track.album || '-'
  current_album.setAttribute('title', track.album)

  current_owner.innerHTML = 'Chosen by '+track.added_by+'' || '-'

  track.rating == null ? rating_count.innerHTML = '0' : rating_count.innerHTML = track.rating;
  rating_count.setAttribute('class', track.rating_class);

  current_track_file = track.file
}

function hasClass(el, cls) {
  return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
}

var vote = function(state) {
  vote_up.setAttribute('class', '');
  vote_down.setAttribute('class', '');
  (state == 1 ? vote_up : vote_down).setAttribute('class', 'voted');
  conn.send( buildMPDMessage('vote', { 'state': state, 'filename': current_track_file }) );
}

var voteUp = function() {
  if (!hasClass(vote_up, 'voted')) {
    vote(1)
  }
}

var voteDown = function() {
  if (!hasClass(vote_down, 'voted')) {
    vote(0)
  }
}

vote_up.addEventListener("click", voteUp);
vote_down.addEventListener("click", voteDown);
playlist.addEventListener("click", openPlaylist)

let playlistWindow = null;

function openPlaylist() {
  ipcRenderer.send('openPlaylistWindow', 'ping')
}

function time_to_seconds(time) {
  if (time != null) {
    time = time.split(':');
    return parseInt(time[0],10)*60 + parseInt(time[1],10);
  }
}

function seconds_to_time(seconds) {
  var seconds = parseInt(seconds,10);
  var minutes = seconds/60;
  var padded = function(number){
    number = number+'';
    return number.length<2 ? '0'+number : number;
  }
  return padded(Math.floor(minutes)) + ':' + padded(seconds%60);
}

var updateVotesAndRating  = function(changes){
  user_negative_votes.innerHTML = changes.negative_ratings.join(", ")
  user_positive_votes.innerHTML = changes.positive_ratings.join(", ")
  user_no_votes.innerHTML = ''

  vote_down.classList.remove("voted");
  vote_up.classList.remove("voted");

  if (changes.negative_ratings && changes.negative_ratings.indexOf(current_user)>=0) {
    vote_down.classList.add('voted');
  }

  if (changes.positive_ratings && changes.positive_ratings.indexOf(current_user)>=0) {
    vote_up.classList.add('voted');
  }

  if (changes.rating == null) {
    user_no_votes.innerHTML = 'No votes'
    rating_count.setAttribute('class', 'unrated');
    return;
  };

  rating_count.innerHTML = changes.rating
  rating_count.setAttribute('class', changes.rating_class);
}

function updatePlayPauseButton(state) {
  playState = state;
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

    if ("state" in data) {
      updatePlayPauseButton(data["state"]);
    }

    if ("track" in data) {
      updateCurrentSong(data["track"]);
    }

    if ("rating" in data) {
      updateVotesAndRating(data["rating"]);
    }

    if ("refresh" in data) {
      window.location.reload(true);
    }

  }
}

function check(){
  if(!conn || conn.readyState == 3) start();
}

start();

setInterval(check, 5000);
