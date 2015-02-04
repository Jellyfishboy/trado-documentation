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

    var tradoPromoConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        trado_promo: tradoPromoConfig,
        watch: {
            options: {
                nospawn: true,
                livereload: true
            },
            concatJavascript: {
                files: ['<%= trado_promo.app %>/js/{,*/}*.js'],
                tasks: ['concat:javascripts']
            },
            compass: {
                files: ['<%= trado_promo.app %>/src/sass/{,*/}*.{scss,sass}'],
                tasks: ['compass:server', 'concat:stylesheets']
            },
            assemble: {
                files: ['<%= trado_promo.app %>/layouts/*.hbs', 'app/pages/*.hbs', 'app/partials/**/*.hbs'],
                tasks: ['assemble']
            },
            // img: {
            //     files: ['<%= trado_promo.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'],
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
                        '<%= trado_promo.app %>/*.html',
                        '<%= trado_promo.app %>/css',
                        '<%= trado_promo.app %>/js/trado-promo.js',
                        '<%= trado_promo.dist %>/*',
                        '!<%= trado_promo.dist %>/.git*'
                    ]
                }]
            },
            server: {
                files: [{
                    src: [
                        '<%= trado_promo.app %>/*.html',
                        '<%= trado_promo.app %>/css',
                        '<%= trado_promo.app %>/js/trado-promo.js',
                        '<%= trado_promo.dist %>/*'
                    ]
                }]
            },
            css: {
                files: [{
                    src: [
                        '<%= trado_promo.dist %>/css/trado-promo.css'
                    ]
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= trado_promo.app %>',
                    dest: '<%= trado_promo.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '*.html',
                        'img/*'
                    ]
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= trado_promo.app %>/css',
                dest: '<%= trado_promo.dist %>/css/',
                src: '{,*/}*.css'
            },
            javascripts: {
                expand: true,
                cwd: '<%= trado_promo.app %>/js',
                dest: '<%= trado_promo.dist %>/js/',
                src: '*.js'
            },
            modernizr:
            {
                expand: true,
                cwd: '<%= trado_promo.app %>/components/modernizr',
                dest: '<%= trado_promo.dist %>/components/modernizr',
                src: 'modernizr.js'
            },
            fontawesome:
            {
                expand: true,
                cwd: '<%= trado_promo.app %>/components/font-awesome/fonts',
                dest: '<%= trado_promo.dist %>/fonts',
                src: '*'
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        compass: {
            options: {
                sassDir: '<%= trado_promo.app %>/src/sass',
                cssDir: '<%= trado_promo.app %>/css',
                outputStyle: 'nested',
                imagesDir: '<%= trado_promo.app %>/img',
                imagesPath: '<%= trado_promo.app %>/img',
                httpGeneratedImagesPath: 'http://cdn1.trad.io/trado-promo/assets/img',
                httpImagesPath: 'http://cdn1.trado.io/trado-promo/assets/img',
                // httpImagesPath: '/img',
                relative_assets: false
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
                    '<%= trado_promo.app %>/components/ajaxchimp/jquery.ajaxchimp.js'
                ],
                dest: '<%= trado_promo.app %>/js/trado-promo.js',
            },
            stylesheets: {
                options: {
                    separator: ''
                },
                src: [
                    '<%= trado_promo.app %>/components/normalize-css/normalize.css',
                    '<%= trado_promo.app %>/components/bootstrap/dist/css/bootstrap.min.css',
                    '<%= trado_promo.app %>/components/font-awesome/css/font-awesome.min.css',
                    '<%= trado_promo.app %>/css/trado-promo.css'
                ],
                dest: '<%= trado_promo.app %>/css/trado-promo.css'
            }
        },
        uglify: {
            options: {
              mangle: true
            },
            dist: {
                files: {
                    '<%= trado_promo.dist %>/js/application.js': [ '<%= trado_promo.dist %>/js/application.js' ],
                    '<%= trado_promo.dist %>/js/trado-promo.js': [ '<%= trado_promo.dist %>/js/trado-promo.js' ],
                    '<%= trado_promo.dist %>/components/modernizr/modernizr.js' : ['<%= trado_promo.dist %>/components/modernizr/modernizr.js']
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
                    banner: '/* Compiled Trado promotional stylesheet assets */'
                },
                files: {
                    '<%= trado_promo.dist %>/css/trado-promo.css': ['<%= trado_promo.dist %>/css/trado-promo.css']
                }
            }
        },
        cdnify: {
            dist: {
                options: {
                    base: 'http://cdn0.trado.io/trado-promo/assets/',
                    html: {
                        'link[rel=icon]' : 'href'
                    }
                },
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: '**/*.{css,html}',
                    dest: 'dist'
                }]
            }
        },
        htmlbuild: {
            dist: {
                src: '<%= trado_promo.dist %>/index.html',
                dest: '<%= trado_promo.dist %>/'
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
        'copy:javascripts',
        'copy:modernizr',
        'copy:fontawesome',
        'uglify:dist',
        'copy:dist',
        'cdnify:dist',
        'htmlbuild:dist'
    ]);
};