# grunt-pattern-lab-json

> create pattern lab atomic design json automatically

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-pattern-lab-json --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-pattern-lab-json');
```

## The "pattern_lab_json" task

### Overview
In your project's Gruntfile, add a section named `pattern_lab_json` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  pattern_lab_json: {
    default_options: {
      pattern_dirs: ['test/atoms','test/molecules','test/organisms','test/templates','test/pages'],
      "pattern_path": "test/"
    }
  },
});
```

### Options

#### default_options.pattern_dirs
Type: `Array`
Default value: `',  '`

A list of patters directory to crate JSON.

#### default_options.pattern_path
Type: `String`

String path of patterns.

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  pattern_lab_json: {
    default_options: {
      pattern_dirs: ['test/atoms','test/molecules','test/organisms','test/templates','test/pages'],
      "pattern_path": "test/"
    }
  },
});
```

## Release History
_(Nothing yet)_
