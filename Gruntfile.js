module.exports = function(grunt){

  // load any app specific tasks
  grunt.loadTasks('grunt/tasks');
  // npm
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-mocha-test");

  /**
  * Load in our build configuration file.
   */
  var userConfig = require( './grunt/build.config.js' );


  var taskConfig = {

    jshint : {
      files : [ 'src/**/*js' ]
    },
    delta : {
      files: [ 'src/**/*js', 'test/**/*js'  ],
      tasks : ['jshint', 'mochaTest']
    },
    // Configure a mochaTest task
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    }

  };


  grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );


  /**
   * In order to make it safe to just compile or copy *only* what was changed,
   * we need to ensure we are starting from a clean, fresh build. So we rename
   * the `watch` task to `delta` (that's why the configuration var above is
   * `delta`) and then add a new task called `watch` that does a clean build
   * before watching for changes.
   */
  grunt.renameTask( 'watch', 'delta' );
  grunt.registerTask( 'watch', [  
    'build', 
    'delta' 
  ]);


  /**
   * The default task is to build and compile.
   */
  grunt.registerTask( 'default', [  'build' ] );

  /**
   * The `build` task gets your app ready to run for development and testing.
   */
  grunt.registerTask( 'build', [
    'jshint',
    'mochaTest'
  ]);



};