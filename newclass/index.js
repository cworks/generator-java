'use strict';

var generators = require('yeoman-generator'),
    _ = require('lodash');

module.exports = generators.Base.extend({
    constructor: function() {
        generators.Base.apply(this, arguments);
        this.argument('name', { type: String, required: true });
        this.log('inside newclass Sub-generator', this.name);
    },

    prompting: function() {
        this.log('NewClass prompting');
    },

    configuring: function() {
        var n = this.name.lastIndexOf('.');
        if(n < 0) {
            this.className = this.name;
            this.packageName = '';
        } else {
            this.className = this.name.substring(n+1);
            this.packageName = this.name.substring(0, n);
        }
        //this.log('CLASSNAME: ' + this.className);
        //this.log('PACKAGE NAME: ' + this.packageName);
    },

    writing: function() {
        this.log('inside writing Sub-generator', this.name);
        this._newClass();
    },

    _newClass: function() {
        var packageDir = this.packageName.replace(/\./g, '/');
        //this.log('PACKAGE DIR: ' + packageDir);
        this.fs.copyTpl(
            this.templatePath('src/main/java/_NewClass.java'),
            this.destinationPath('src/main/java/' + packageDir + '/' + this.className + '.java'), {
                codeHeader: '// A wittle code header',
                packageName: this.packageName,
                className: this.className
            }
        );
    }
});