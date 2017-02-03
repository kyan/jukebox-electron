const electron = require('electron')
const BrowserWindow = electron.BrowserWindow

rating_count = document.getElementById('rating_count')
track_title = document.getElementById('track_title')
track_owner = document.getElementById('track_owner')

function updateCurrentSong(track) {
  track_title.innerHTML = track.title || '-'
  track_title.setAttribute('title', track.title)

  track_owner.innerHTML = track.added_by || '-'

  track.rating == null ? rating_count.innerHTML = '0' : rating_count.innerHTML = track.rating;
  rating_count.setAttribute('class', track.rating_class);
}


var uri = "ws://jukebox.local:8081";
var conn = new WebSocket(uri);

function start() {
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
      // updatePlayPauseButton(data["state"]);
    }

    if ("track" in data) {
      updateCurrentSong(data["track"]);
    }

    if ("time" in data) {
      // updateCurrentTime(data["time"]);
    }

    if ("rating" in data) {
      // updateVotesAndRating(data["rating"]);
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
