'use strict';
var _ = require('./node_modules/grunt/node_modules/lodash/lodash.min.js');
var path = require('path');

module.exports = function(grunt) {

    function readData(datasrc) {
        return grunt.file.readJSON(datasrc);
    }
  
    //Function for creating an array of files from each node in a JSON file
    function createPages(datasrc,template) {
        var data = readData(datasrc);
        var pageArray = [];

        for (var i = 0; i < data.spreads.length; i++) {
            for (var k = 0; k < data.spreads[i].pages.length; k++) { 
                pageArray.push({
                    filename: data.spreads[i].pages[k]['id'] + '.html',
                    data: data.spreads[i].pages[k],
                    content: grunt.file.read(template),
                });
            }
        }
        return _.flatten(pageArray);
    }

    // Project configuration.
    grunt.initConfig({
        config: {
            src: 'root-src',
            dev: 'root-dev'
        },
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            //options: {
            //    sourceMap: true,
            //},
            dev: {
                files: {
                    '<%= config.dev %>/css/<%= pkg.mainCss %>.css': '<%= config.src %>/scss/<%= pkg.mainCss %>.scss',
                },
            },
        },
        copy: {
            //bower: {
            //    expand: true,
            //    cwd: 'bower_components/',
            //    src: ['**/*'],
            //    dest: 'dev/bower_components'
            //},
            assets: {
                expand: true,
                cwd: '<%= config.src %>/',
                src: ['fonts/**/*', 'img/**/*'],
                dest: '<%= config.dev %>/',
            }
        },
        watch: {
            sass: {
                files: ['<%= config.src %>/**/*.scss'],
                tasks: ['sass'],
                options: {
                    livereload: true,
                },
            },
            script: {
                files: ['<%= config.src %>/**/*.js'],
                tasks: ['concat'],
            },
            assemble: {
                files: ['<%= config.src %>/views/{,*/}*.{hbs,json}'],
                tasks: ['assemble'],
            },
            livereload: {
                //Here we watch the files the sass task will compile to
                //These files are sent to the live reload server after sass compiles to them
                options: { livereload: true },
                files: ['<%= config.dev %>/**/*'],
            },
        },
        concat: {
            options: {
                banner: '',
                stripBanners: false,
            },
            dev: {
                src: [
                    '<%= config.src %>/js/**/*',
                ],
                dest: '<%= config.dev %>/js/<%= pkg.mainJs %>.js',
            },
        },
        clean: {
            tmp: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/',
                        src: '**/*',
                    },
                ],
            },
            dev: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.dev %>/',
                        src: '**/*',
                    },
                ],
            }
        },
        assemble: {
            options: {
                flatten: true,
                helpers: '<%= config.src %>/views/helpers/**/*.js',
                layoutdir: '<%= config.src %>/views/layouts/',
                layout: 'root.hbs',
                data: '<%= config.src %>/views/data/pageData.json',
                partials: '<%= config.src %>/views/partials/*.hbs',
                meta: readData('root-src/views/data/metaData.json'),
                dev: true
            },
            index: {
                options: {
                    pageData: readData('root-src/views/data/pageData.json'),
                    layout: 'root.hbs',
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.src %>/views/pages',
                        src: 'index.hbs',
                        dest: '<%= config.dev %>/',
                    }
                ]
            },
            pages: {
                options: {
                    pages: createPages('root-src/views/data/pageData.json', 'root-src/views/pages/page.hbs')
                },
                files: [
                    { dest: 'root-dev/page/', src: '!*' } //We need to trick assemble here using !* as the src
                ]
            },
        }
    });

    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('assemble');

    grunt.registerTask('devbuild', ['clean', 'copy', 'assemble', 'sass', 'concat']);

    // Default task(s).
    grunt.registerTask('default', ['devbuild', 'watch']);

};