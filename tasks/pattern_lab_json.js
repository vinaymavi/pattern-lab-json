/*
 * grunt-pattern-lab-json
 * https://github.com/vinaymavi/pattern-lab-json
 *
 * Copyright (c) 2016 vinaymavi
 * Licensed under the MIT license.
 */

'use strict';
module.exports = function (grunt) {

    var REG_EXP_INCLUDE_PARTIAL = /{{>(.*?)}}/g,
        REG_EXP_SECTION = /{{(.*?)}}/g,
        REG_EXP_TYPE_KEY = /{{(.*?)}}/g,
        REG_EXP_TYPE_START_OBJ = /{{[#^]+(.*?)}}/g,
        REG_EXP_TYPE_END_OBJ = /{{\/(.*?)}}/g,
        PATTERN_EXTENSION = ".mustache",
        TYPE_KEY = "KEY",
        TYPE_START_OBJ = "START_OBJ",
        TYPE_END_OBJ = "END_OBJ",
        PATTERN_PATH = grunt.config.get("pattern_lab_json.default_options.pattern_path");

    grunt.registerMultiTask('pattern_lab_json', 'create pattern lab atomic design json automatically', function () {
        var myDirs = grunt.config.get("pattern_lab_json.default_options.my_dirs");
        myDirs.forEach(function (value, index) {
            grunt.file.recurse(value, function callback(abspath, rootdir, subdir, filename) {
                if (filename.endsWith(PATTERN_EXTENSION)) {
                    console.log("******************");
                    console.log(abspath);
                    var includeStr = includePartials(abspath);
                    console.log(includeStr);
                    var sectionArr = includeStr.match(REG_EXP_SECTION);
                    if (sectionArr !== null) {
                        console.log(createJson(sectionArr));
                    }
                }
            });
        });
    });

    /**
     * contact all partials in single file.
     * @param abspath {String} file path.
     * @return {String} contacted String
     */
    function includePartials(abspath) {
        var fileStr = grunt.file.read(abspath);
        var fileLines = fileStr.split('\n');
        for (var i = 0; i < fileLines.length; i++) {
            if (fileLines[i].match(REG_EXP_INCLUDE_PARTIAL) !== null) {
                var partialCode = fileLines[i].match(REG_EXP_INCLUDE_PARTIAL)[0];
                var partialAbsPath = patternAbsPath(partialCode.replace(REG_EXP_INCLUDE_PARTIAL, "$1"));
                var partialHtml = includePartials(partialAbsPath);
                fileLines[i] = partialHtml;
            }
        }
        return fileLines.join('');
    }

    /*TODO utility function should be separate file.*/
    /**
     * Return pattern absPath by pattern name;
     * @param patternName {String} pattern name;
     * @return {string} absPath of pattern
     */
    function patternAbsPath(patternName) {
        var type = getPatternType(patternName);
        var patternFileName = getPatternFileName(patternName);
        var absPath = "";
        /*TODO use join for path*/
        var path = PATTERN_PATH + type;
        grunt.file.recurse(path, function patternNameCallback(abspath, rootdir, subdir, filename) {
            if (filename === patternFileName) {
                absPath += abspath;
            }
        });
        return absPath;
    }

    /**
     * return pattern type like atoms,molecules etc.
     * @param patternName {String} pattern name like atoms-hr
     * @return type {String}
     */
    function getPatternType(patternName) {
        var patternArr = patternName.trim().split('-');
        var type = patternArr[0];
        return type;
    }

    /**
     * return pattern file name with extension
     * @param patternName {String} pattern name like atoms-hr
     */
    function getPatternFileName(patternName) {
        var patternArr = patternName.trim().split('-');
        var patternFileName;
        patternArr.splice(0, 1);
        patternFileName = patternArr.join('-');
        if (patternFileName.indexOf('(') !== -1) {
            patternFileName = patternFileName.split('(')[0];
        }
        if (patternFileName.indexOf(':') !== -1) {
            patternFileName = patternFileName.split(':')[0];
        }
        return patternFileName + PATTERN_EXTENSION;
    }

    /**
     * create JSON from section arr.
     * @params sectionArr {Array}
     * @return {String} stringify javascript object.
     */
    function createJson(sectionArr) {
        var currentSection,
            sectionStr,
            currentPath = [],
            sectionStrArr,
            jsonObject = {};
        for (var i = 0; i < sectionArr.length; i++) {
            currentSection = sectionArr[i];

            if (isMustacheKey(currentSection)) {
                sectionStr = sectionToString(TYPE_KEY, currentSection);
                sectionStrArr = sectionStr.split('.');
                for (var j = 0; j < sectionStrArr.length; j++) {
                    if (j === sectionStrArr.length - 1) {
                        addKey(currentPath, jsonObject, sectionStrArr[j]);
                    } else {
                        addObject(currentPath, jsonObject, sectionStrArr[j]);
                    }
                }
                for (var j = 0; j < sectionStrArr.length - 1; j++) {
                    currentPath.pop();
                }

            } else if (isMustacheObjectStart(currentSection)) {
                sectionStr = sectionToString(TYPE_START_OBJ, currentSection);
                sectionStrArr = sectionStr.split('.');
                for (var k = 0; k < sectionStrArr.length; k++) {
                    addObject(currentPath, jsonObject, sectionStrArr[k]);
                }
            } else if (isMustacheObjectEnd(currentSection)) {
                sectionStr = sectionToString(TYPE_END_OBJ, currentSection);
                sectionStrArr = sectionStr.split('.');
                for (var l = 0; l < sectionStrArr.length; l++) {
                    currentPath.pop();
                }
            }
        }
        return JSON.stringify(jsonObject);
    }

    /*TODO should be a single function that return type*/
    function isMustacheKey(currentSection) {
        if (currentSection.indexOf('#') === -1 && currentSection.indexOf('^') === -1 && currentSection.indexOf('/') === -1) {
            return true;
        }
        return false;
    }

    function isMustacheObjectStart(currentSection) {
        if (currentSection.indexOf('#') !== -1 || currentSection.indexOf('^') !== -1) {
            return true;
        }
        return false;
    }

    function isMustacheObjectEnd(currentSection) {
        if (currentSection.indexOf('/') !== -1) {
            return true;
        }
        return false;
    }

    function sectionToString(sectionType, currentSection) {
        var sectionStr;
        switch (sectionType) {
            case TYPE_KEY:
            {
                sectionStr = currentSection.replace(REG_EXP_TYPE_KEY, '$1');
                break;
            }
            case TYPE_START_OBJ:
            {
                sectionStr = currentSection.replace(REG_EXP_TYPE_START_OBJ, '$1');
                break;
            }
            case TYPE_END_OBJ:
            {
                sectionStr = currentSection.replace(REG_EXP_TYPE_END_OBJ, '$1');
                break;
            }
        }
        return sectionStr.trim();
    }

    function addObject(currentPath, jsonObject, name) {
        var currentLocPointer = jsonObject;
        currentPath.forEach(function (value, index) {
            currentLocPointer = currentLocPointer[value];
        });

        if (!currentLocPointer[name]) {
            currentLocPointer[name] = {};
        }

        currentPath.push(name);
    }

    function addKey(currentPath, jsonObject, name) {
        var currentLocPointer = jsonObject;
        currentPath.forEach(function (value, index) {
            currentLocPointer = currentLocPointer[value];
        });

        if (!currentLocPointer[name]) {
            currentLocPointer[name] = name;
        }
    }

};
