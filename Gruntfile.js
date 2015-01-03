'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt, {config: 'package.json'});
    grunt.loadNpmTasks('assemble');
    require('time-grunt')(grunt);

    var tradoDocConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        trado_doc: tradoDocConfig,
        watch: {
            options: {
                nospawn: true,
                livereload: true
            },
            concatJavascript: {
                files: ['<%= trado_doc.app %>/js/{,*/}*.js'],
                tasks: ['concat:javascripts']
            },
            compass: {
                files: ['<%= trado_doc.app %>/src/sass/{,*/}*.{scss,sass}'],
                tasks: ['compass:server', 'concat:stylesheets']
            },
            assemble: {
                files: ['<%= trado_doc.app %>/layouts/*.hbs', 'app/pages/*.hbs', 'app/partials/**/*.hbs'],
                tasks: ['assemble']
            },
            // img: {
            //     files: ['<%= trado_doc.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'],
            //     options: {
            //         livereload: true
            //     }
            // }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, 'app'),
                            lrSnippet
                        ];
                    }
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= trado_doc.app %>/*.html',
                        '<%= trado_doc.app %>/css',
                        '<%= trado_doc.app %>/js/trado-doc.js',
                        '<%= trado_doc.dist %>/*',
                        '!<%= trado_doc.dist %>/.git*'
                    ]
                }]
            },
            server: {
                files: [{
                    src: [
                        '<%= trado_doc.app %>/*.html',
                        '<%= trado_doc.app %>/css',
                        '<%= trado_doc.app %>/js/trado-doc.js',
                        '<%= trado_doc.dist %>/*'
                    ]
                }]
            },
            css: {
                files: [{
                    src: [
                        '<%= trado_doc.dist %>/css/application.css'
                    ]
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= trado_doc.app %>',
                    dest: '<%= trado_doc.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        'components/**/*',
                        '*.html'
                    ]
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= trado_doc.app %>/css',
                dest: '<%= trado_doc.dist %>/css/',
                src: '{,*/}*.css'
            },
            javascripts: {
                expand: true,
                cwd: '<%= trado_doc.app %>/js',
                dest: '<%= trado_doc.dist %>/js/',
                src: '*.js'
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        compass: {
            options: {
                sassDir: '<%= trado_doc.app %>/src/sass',
                cssDir: '<%= trado_doc.app %>/css',
                outputStyle: 'nested',
                imagesDir: '<%= trado_doc.app %>/img',
                httpGeneratedImagesPath: '/img',
                httpImagesPath: '/img'
            },
            dist: {
            },
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        concat: {
            javascripts: {
                options: {
                  separator: ';'
                },
                src: [

                ],
                dest: '<%= trado_doc.app %>/js/trado-doc.js',
            },
            stylesheets: {
                options: {
                    separator: ''
                },
                src: [
                    '<%= trado_doc.app %>/components/normalize-css/normalize.css',
                    '<%= trado_doc.app %>/components/animate.css/animate.min.css',
                    '<%= trado_doc.app %>/components/bootstrap/dist/css/bootstrap.min.css',
                    '<%= trado_doc.app %>/css/application.css'
                ],
                dest: '<%= trado_doc.app %>/css/application.css'
            }
        },
        uglify: {
            options: {
              mangle: true
            },
            server: {
                files: {
                    '<%= trado_doc.app %>/js/application.js': [ '<%= trado_doc.app %>/js/application.js' ],
                    '<%= trado_doc.app %>/js/trado-doc.js': [ '<%= trado_doc.app %>/js/trado-doc.js' ]
                }
            }
        },
        assemble: {
            options: {
                layout: "app/layouts/application.hbs",
                partials: "app/partials/**/*.hbs",
                flatten: true
            },
            pages: {
                files: {
                    'app/': ['app/pages/*.hbs']
                }
            }
        },
        cssmin: {
            add_banner: {
                options: {
                    banner: '/* Compiled Trado documentation stylesheet assets */'
                },
                files: {
                    '<%= trado_doc.dist %>/css/trado-doc.css': ['<%= trado_doc.dist %>/css/application.css']
                }
            }
        }
    });

    grunt.registerTask('server', function (target) {
        grunt.task.run([
            'clean:server',
            'compass:server',
            'concat:javascripts',
            'concat:stylesheets',
            'assemble',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });
    grunt.registerTask('build', [
        'clean:dist',
        'compass:dist',
        'concat:javascripts',
        'concat:stylesheets',
        'assemble',
        'copy:styles',
        'cssmin',
        'clean:css',
        'uglify:server',
        'copy:javascripts',
        'copy:dist'
    ]);
};