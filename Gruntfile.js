module.exports = function(grunt) {

  'use strict';
  
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
    ' * TrilloJS v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
    ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
    ' * Licensed under the <%= pkg.license %> license\n' +
    ' */\n',
    clean: {
      dist: 'dist'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      grunt: {
        options: {
          jshintrc: 'grunt/.jshintrc'
        },
        src: ['Gruntfile.js']
      },
      todojs: {
        src: 'apps/todo/js/*.js'
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      todo: {
        src: [
          'apps/todo/js/appInit.js',
          'apps/todo/js/listModel.js',
          'apps/todo/js/todoListC.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        compress: {
          warnings: false
        },
        mangle: true,
        preserveComments: /^!|@preserve|@license|@cc_on/i
      },
      todo: {
        src: '<%= concat.todo.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    copy: {
      assets: {
          files: [
              {expand: true, src: ['todo-assets/**'], dest: '../website-deployment/todo/'},
              {expand: true, src: ['trillojs/**'], dest: '../website-deployment/todo/'},
              { src: ['todo-assets/website-index.html'], dest: '../website-deployment/todo/todo-assets/index.html'}
          ],
          options: {
            mode: true
          }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['clean', 'jshint', 'concat', 'uglify:todo']);
  grunt.registerTask('deploy', ['clean', 'jshint', 'concat', 'uglify:todo', 'copy:assets']);

};