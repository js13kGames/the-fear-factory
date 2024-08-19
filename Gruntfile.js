module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        mangle: {
          toplevel: true,
          eval: true,
          keep_fnames: false,
          reserved: ["startGame"]
        }
      },
      build: {
        files: [{
          expand: false,
          src: ["assets/js/sound.js",
                "assets/js/song.js",
                "assets/js/particle.js",
                "assets/js/decor.js",
                "assets/js/spawner.js",
                "assets/js/enemy.js",
                "assets/js/camera.js",
                "assets/js/keys.js",
                "assets/js/entity.js",
                "assets/js/hero.js",
                "assets/js/enums.js",
                "assets/js/gun.js",
                "assets/js/utility.js",
                "assets/js/intro.js",
                "assets/js/cart.js",
                "assets/js/game.js",
                ],
          dest: 'dst/game.min.js',
          ext: '.min.js'
        }]
      }
    },
    watch: {
      files: ['assets/js/*.js'],
      tasks: ['uglify']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify-es');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['uglify']);
};
