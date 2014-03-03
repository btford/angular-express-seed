require.config({
  baseUrl: 'js',
  paths: {
    'angular': 'lib/angular/angular'
  },
  shim : {
    'angular': {
      exports: 'angular'
    },
  }
});