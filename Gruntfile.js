var fs = require("fs");
module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({

    // Package.json.
    pkg: grunt.file.readJSON('package.json'),

    // Copy everything to dist directory.
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: '**',
            dest: 'dist/'
          }
        ]
      }
    },

    // Compile scripts & styles together.
    useref: {
      html: "dist/app.html",
      temp: "dist"
    },

    // Remove unnecessary files.
    clean: {
      release: [

        // Remoeve everything.
        'dist/**/*',

        // Except..
        '!dist/app.html',
        '!dist/manifest.json',
        '!dist/manifest.mobile.json',
        '!dist/background.js',
        '!dist/app.min.js',
        '!dist/_locales', '!dist/_locales/**/*',
        '!dist/angular', '!dist/angular/**/*',
        '!dist/partial', '!dist/partial/**/*',
        '!dist/style', '!dist/style/app.min.css',
        '!dist/style/font', '!dist/style/img',
        '!dist/style/font/*', '!dist/style/img/*'
      ]
    },

    // For dev ease. e.g. grunt watch
    watch: {
      scripts: {
        files: ['src/**/*'], // No need to be too specific.
        tasks: ['default']
      }
    },

    // Make the zipfile for release.
    compress: {
      release: {
        options: {
          archive: "release.zip"
        },
        expand: true,
        cwd: 'dist/',
        src: ['**/*'],
        dest: './'
      }
    }
  });

  // Packages
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-useref');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Custom task to set version from package.json to manifest.
  grunt.registerTask('versionmanifest', 'Set manifest version from package.json', function() {
    var done = this.async();
    fs.readFile('./dist/manifest.json', function (err, data) {
      if (err) {
        throw err;
      }
      var json = JSON.parse(data);
      json.version = grunt.config.get('pkg').version;
      fs.writeFile('./dist/manifest.json', JSON.stringify(json), function (err) {
        if (err) {
          throw err;
        }
        done();
      });
    });
  });

  // Custom task to remove the key from the manifest file for releases.
  grunt.registerTask('manifestrelease', 'Remove the key from the manifest for release.', function() {
    var done = this.async();
    fs.readFile('./dist/manifest.json', function (err, data) {
      if (err) {
        throw err;
      }
      var json = JSON.parse(data);
      delete json.key;
      fs.writeFile('./dist/manifest.json', JSON.stringify(json), function (err) {
        if (err) {
          throw err;
        }
        done();
      });
    });
  });

  grunt.registerTask('release', ['copy', 'versionmanifest', 'useref', 'concat', 'uglify', 'cssmin', 'clean', 'manifestrelease', 'compress', 'default']);
  grunt.registerTask('default', ['copy', 'versionmanifest', 'useref', 'concat', 'cssmin', 'clean']);
};
