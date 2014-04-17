module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-connect-proxy');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-html2js');

  // Default task.
  grunt.registerTask('default', ['jshint','karma:unit']);
  grunt.registerTask('build', ['clean','html2js','concat','recess:build','copy:assets']);
  grunt.registerTask('release', ['clean','html2js','uglify','jshint','karma:unit','concat:index','concat:config', 'concat:x2js','recess:min','copy:assets']);
  grunt.registerTask('test-watch', ['karma:watch']);

  grunt.registerTask('serve', function (target) {
    grunt.task.run([
        'build',
        'configureProxies:server',
        'connect:server',
        'watch:all'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  // Project configuration.
  grunt.initConfig({
    distdir: 'dist',
    pkg: grunt.file.readJSON('package.json'),
    banner:
    '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
    ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
    src: {
      js: ['src/**/*.js'],
      config: ['src/config/**/*.js'],
      jsTpl: ['<%= distdir %>/templates/**/*.js'],
      specs: ['test/**/*.spec.js'],
      scenarios: ['test/**/*.scenario.js'],
      html: ['src/index.html'],
      tpl: {
        main: ['src/main/**/*.tpl.html']
      },
      less: ['src/less/stylesheet.less'], // recess:build doesn't accept ** in its file patterns
      lessWatch: ['src/less/**/*.less']
    },
    clean: ['<%= distdir %>/*'],
    copy: {
      assets: {
        files: [{ dest: '<%= distdir %>', src : '**', expand: true, cwd: 'src/assets/' }]
      }
    },
    karma: {
      unit: { configFile: 'test/config/karma.conf.js', singleRun: true },
      watch: { configFile: 'test/config/karma.conf.js',
               singleRun:false,
               browsers: ['Chrome'],
               autoWatch: true }
    },
    html2js: {
      main: {
        options: {
          base: 'src/main'
        },
        src: ['<%= src.tpl.main %>'],
        dest: '<%= distdir %>/templates/qas.js',
        module: 'templates.qas'
      }
    },
    concat:{
      dist:{
        options: {
          banner: "<%= banner %>"
        },
        src:['<%= src.js %>', '<%= src.jsTpl %>'],
        dest:'<%= distdir %>/<%= pkg.name %>.js'
      },
      config:{
        src: ['<%= src.config %>'],
        dest: '<%= distdir %>/config.js'
      },
      driver:{
        src: ['src/driver.js'],
        dest: '<%= distdir %>/driver.js'
      },
      index: {
        src: ['src/index.html'],
        dest: '<%= distdir %>/index.html',
        options: {
          process: true
        }
      },
      angular: {
        src:['vendor/angular/angular.js'],
        dest: '<%= distdir %>/angular.js'
      },
      bootstrap: {
        src:['vendor/angular-ui/*.js'],
        dest: '<%= distdir %>/bootstrap.js'
      },
      jquery: {
        src:['vendor/jquery/*.js'],
        dest: '<%= distdir %>/jquery.js'
      },
      x2js: {
        src:['vendor/x2js/xml2json.min.js'],
        dest: '<%= distdir %>/xml2json.min.js'
      }
    },
    uglify: {
      dist:{
        options: {
          banner: "<%= banner %>"
        },
        src:['<%= src.js %>' ,'<%= src.jsTpl %>'],
        dest:'<%= distdir %>/<%= pkg.name %>.js'
      },
      angular: {
        src:['<%= concat.angular.src %>'],
        dest: '<%= distdir %>/angular.js'
      },
      bootstrap: {
        src:['vendor/angular-ui/*.js'],
        dest: '<%= distdir %>/bootstrap.js'
      },
      jquery: {
        src:['vendor/jquery/*.js'],
        dest: '<%= distdir %>/jquery.js'
      }
    },
    recess: {
      build: {
        files: {
          '<%= distdir %>/<%= pkg.name %>.css':
          ['<%= src.less %>'] },
        options: {
          compile: true
        }
      },
      min: {
        files: {
          '<%= distdir %>/<%= pkg.name %>.css': ['<%= src.less %>']
        },
        options: {
          compress: true
        }
      }
    },
    watch:{
      all: {
        files:['<%= src.js %>', '<%= src.config %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.main %>', '<%= src.html %>'],
        tasks:['default','timestamp']
      },
      build: {
        files:['<%= src.js %>', '<%= src.config %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.main %>', '<%= src.html %>'],
        tasks:['build','timestamp']
      }
    },
    jshint:{
      files:['gruntFile.js', '<%= src.js %>', '<%= src.config %>', '<%= src.jsTpl %>', '<%= src.specs %>', '<%= src.scenarios %>'],
      options:{
        curly:true,
        eqeqeq:true,
        immed:true,
        latedef:true,
        newcap:true,
        noarg:true,
        sub:true,
        boss:true,
        eqnull:true,
        globals:{}
      }
    },
    connect: {
        server: {
            options: {
                port: 9000,
                base: 'dist',
                open: true,
                hostname: 'localhost',
                middleware: function (connect, options) {
                    var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
                    return [
                    // Include the proxy first
                    proxy,
                    // Serve static files.
                    connect.static(String(options.base)),
                    // Make empty directories browsable.
                    connect.directory(options.base)
                    ];
                }
            },
            proxies: [
                {
                    context: '/urban',
                    host: 'www.urbanoutfitters.com',
                    port: 443,
                    https: true,
                    changeOrigin: true,
                    xforward: false
                }
            ]
        }
    }

  });

};
