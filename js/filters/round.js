app.filter('round', function() {
  return function(value) {
    return Math.round(value);
  };
});
