module.exports = function(grunt) {
  grunt.initConfig({
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
    clean: {
      release: [

        // Remoeve everything.
        'dist/**/*',

        // Except..
        '!dist/app.html',
        '!dist/manifest.json',
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
    }
  });
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-useref');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // grunt.registerTask('default', ['copy', 'useref', 'concat', 'uglify', 'cssmin', 'clean']);
  grunt.registerTask('default', ['copy', 'useref', 'concat', 'cssmin', 'clean']);
};
