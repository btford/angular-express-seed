'use strict';
/*global module*/
module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: ['./gruntfile.js', './test/*.js',
        './examples/*.js', './error-handler.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        nonew: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        eqnull: true,
        node: true,
        strict: true,
        boss: false
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('hint', ['jshint']);
  grunt.registerTask('default', ['jshint']);
};