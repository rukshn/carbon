chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('/html/index.html', {
    'bounds': {
      'width': 350,
      'height': 600
    },
    frame: 'none',
    minWidth: 350,
    minHeight: 600,
    maxWidth: 350,
    maxHeight: 600
  });
});