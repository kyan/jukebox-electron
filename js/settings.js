const storage = require('electron-json-storage');
const remote = require('electron').remote;

var event2string = require('./modules/key-event-to-string.js')({
  cmd: "Command",
  ctrl: "Control",
  alt: "Alt",
  shift: "Shift",
  joinWith: "+"
})

document.body.onkeydown = (e) => {
  var keys = event2string(e)
  console.log(keys)
  if (isVoteUpActive) {
    vote_up_hotkey.value = keys
    storage.set('vote_up_hotkey', keys, function(error) {
      if (error) throw error;
    });
  }
  if (isVoteDownActive) {
    vote_down_hotkey.value = keys
    storage.set('vote_down_hotkey', keys, function(error) {
      if (error) throw error;
    });
  }
}

var user_id = document.getElementById('user_id')
var initials = document.getElementById('initials')
var save_button = document.getElementById('save')

var vote_up_hotkey = document.getElementById('vote_up_hotkey')
var vote_down_hotkey = document.getElementById('vote_down_hotkey')

var isVoteUpActive = false
var isVoteDownActive = false

user_id.onkeyup = function(){
  storage.set('user_id', user_id.value, function(error) {
    if (error) throw error;
  });
};

initials.onkeyup = function(){
  storage.set('initials', initials.value, function(error) {
    if (error) throw error;
  });
}

vote_up_hotkey.onkeydown = function(event){
  event.preventDefault()
};

vote_down_hotkey.onkeydown = function(event){
  event.preventDefault()
};

vote_up_hotkey.onfocus = function(){
  isVoteUpActive = true
};

vote_up_hotkey.onblur = function(){
  isVoteUpActive = false
};

vote_down_hotkey.onfocus = function(){
  isVoteDownActive = true
};

vote_down_hotkey.onblur = function(){
  isVoteDownActive = false
};

save_button.onclick = function() {
  var window = remote.getCurrentWindow();
  window.close();
}

// SET values from persistent store
storage.get('user_id', function(error, data) {
  if (error) throw error;
  if (typeof(data) == 'object') {
    return console.log('Object returned expected value')
  }

  user_id.value = data
});

storage.get('initials', function(error, data) {
  if (error) throw error;
  if (typeof(data) == 'object') {
    return console.log('Object returned expected value')
  }

  initials.value = data
});

storage.get('vote_up_hotkey', function(error, data) {
  if (error) throw error;
  if (typeof(data) == 'object') {
    return console.log('Object returned expected value')
  }

  vote_up_hotkey.value = data
});

storage.get('vote_down_hotkey', function(error, data) {
  if (error) throw error;
  if (typeof(data) == 'object') {
    return console.log('Object returned expected value')
  }

  vote_down_hotkey.value = data
});
