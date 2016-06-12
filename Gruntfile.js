/*
 * grunt-pattern-lab-json
 * https://github.com/vinaymavi/pattern-lab-json
 *
 * Copyright (c) 2016 vinaymavi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        pattern_lab_json: {
            default_options: {
                my_dirs: ['test/atoms','test/molecules','test/organisms','test/templates','test/pages'],
                "pattern_path": "test/"
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'pattern_lab_json', 'nodeunit']);
    grunt.registerTask('build', ['pattern_lab_json']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
