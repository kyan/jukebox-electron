const storage = require('electron-json-storage');
const remote = require('electron').remote;

var user_id = document.getElementById('user_id')
var initials = document.getElementById('initials')
var save_button = document.getElementById('save')

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
