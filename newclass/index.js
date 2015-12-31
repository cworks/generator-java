'use strict';

var generators = require('yeoman-generator'),
             _ = require('lodash'),
          path = require('path'),
     javautils = require('../src/js/javautils'),
      datetime = require('../src/js/datetime');

module.exports = generators.Base.extend({
    constructor: function() {
        generators.Base.apply(this, arguments);
        this.argument('className', { type: String, required: false });
    },

    prompting: function() {
        // if user did not set projectName argument then prompt
        var prompts = [];
        if(!this.className) {
            prompts.push({
                type: 'input',
                name: 'className',
                message: 'Class Name (i.e. com.acme.Dynomite)',
                default: 'MyClass'
            });
        }

        // prompt for newclass type
        prompts.push({
            type: 'list',
            name: 'classType',
            message: 'New Class Type',
            choices: [
                {
                    name: 'default',
                    value: 'default',
                    checked: true
                },
                {
                    name: 'interface',
                    value: 'interface',
                    checked: true
                },
                {
                    name: 'factoryMethod',
                    value: 'factoryMethod',
                    checked: false
                },
                {
                    name: 'singleton',
                    value: 'singleton',
                    checked: false
                }
            ]
        });

        // *** execute prompts ***
        var done = this.async();
        this.prompt(prompts, function(answers) {
            this.className = answers.className;
            this.classType = answers.classType;
            done();
        }.bind(this));
    },

    configuring: function() {
        this.meta = javautils.parseFullyQualifiedClass(this.className);
        if(!this.meta) {
            this.env.error('argument not a valid fully-qualified-class');
            process.exit(1);
        }

        //this.log('META: ' + this.meta.className + ' ' + this.meta.packageName + ' ' + this.meta.packageDir);
    },

    writing: function() {
        if(this.classType === 'factoryMethod') {
            this._newJavaClass('_NewFactoryMethodClass.java');
        } else if(this.classType === 'singleton') {
            this._newJavaClass('_NewSingletonClass.java');
        } else if(this.classType === 'interface') {
            this._newJavaClass('_NewInterface.java');
        } else {
            this._newJavaClass('_NewClass.java');
        }
    },

    end: function() {
        // this.log('THIS IS THE END');
    },

    _newJavaClass: function(templateName) {
        var packageText = '';
        if(this.meta.packageName) {
            packageText = 'package ' + this.meta.packageName + ';'
        }
        this.fs.copyTpl(
            this.templatePath('src/main/java/' + templateName),
            this.destinationPath('src/main/java/' + this.meta.packageDir + this.meta.className + '.java'), {
                codeHeader: this._codeHeader(),
                package: packageText,
                className: this.meta.className
            }
        );
    },

    _projectName: function() {
        return path.basename(process.cwd());
    },

    _codeHeader: function() {
        //this.log('CWD: ' + process.cwd());
        var tempCodeHeader = process.cwd() + '/.codeheader';
        this.fs.copyTpl(
            this.templatePath('codeheader/Header.txt'),
            this.destinationPath(tempCodeHeader), {
                projectName: this._projectName(),
                createdTime: datetime.nowFormatted(),
                packageName: this.meta.packageName,
                className: this.meta.className,
                tagline: 'Baked with love'
            }
        );
        var content = this.fs.read(this.destinationPath(tempCodeHeader));
        this.fs.delete(this.destinationPath(tempCodeHeader));
        return content;
    }
});