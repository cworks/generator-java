'use strict';

var generators = require('yeoman-generator'),
             _ = require('lodash'),
         chalk = require('chalk'),
         yosay = require('yosay'),
      datetime = require('../src/js/datetime');

module.exports = generators.Base.extend({

    constructor: function() {
        generators.Base.apply(this, arguments);
        this.argument('projectName', {
            type: String, required: false
        });
        this.projectName = _.kebabCase(this.projectName);

        this.option('codeheader', {
            desc: 'A codeheader template to apply on all source files.',
            type: String,
            default: 'codeheader/Header.txt'
        });
    },

    initializing: function() {
        this.log('initializing');
    },

    /*
     * ---------------------------------------------------------------------------------------------
     *  Prompt user for input
     * ---------------------------------------------------------------------------------------------
     */
    prompting: function() {
        this.log(yosay('Welcome to gizmo, ' +
            chalk.red('the code generator that wuvs you.')));

        // if user did not set projectName argument then prompt
        var prompts = [];
        if(!this.projectName) {
            prompts.push({
                type: 'input',
                name: 'projectName',
                message: 'Project Name',
                default: 'new-project'
            });
        }

        // prompt for project description
        prompts.push({
            type: 'input',
            name: 'description',
            message: 'Project Description',
            default: 'My wittle project, baked with wuv.'
        });
        // prompt for packageName
        prompts.push({
            type: 'input',
            name: 'packageName',
            message: 'Top Level Package',
            default: 'cworks.app'
        });
        // prompt for mainClassName
        prompts.push({
            type: 'input',
            name: 'mainClassName',
            message: 'Class with main method',
            default: 'Application'
        });
        // prompt for project version
        prompts.push({
            type: 'input',
            name: 'version',
            message: 'Project Version',
            default: '1.0.0'
        });
        // prompt for packaging
        prompts.push({
            type: 'list',
            name: 'packaging',
            message: 'Project Type',
            choices: [
                {
                    name: 'jar',
                    value: 'jar',
                    checked: true
                },
                {
                    name: 'war',
                    value: 'war',
                    checked: false
                }
            ]
        });
        // prompt for java version
        prompts.push({
            type: 'list',
            name: 'javaVersion',
            message: 'Java Version',
            choices: [
                {
                    name: 'java8',
                    value: '1.8',
                    checked: true
                },
                {
                    name: 'java7',
                    value: '1.7',
                    checked: false
                }
            ]
        });

        prompts.push({
            type: 'list',
            name: 'buildTool',
            message: 'Select a build tool',
            choices: [
                {
                    name: 'gradle',
                    value: 'gradle',
                    checked: true
                },
                {
                    name: 'maven',
                    value: 'maven',
                    checked: false
                }
            ]
        });

        // *** execute prompts ***
        var done = this.async();
        this.prompt(prompts, function(answers) {
            this.log(answers);
            this.projectName = answers.projectName;
            this.buildTool = answers.buildTool;
            this.packageName = answers.packageName;
            this.version = answers.version;
            this.description = answers.description;
            this.packaging = answers.packaging;
            this.javaVersion = answers.javaVersion;
            this.mainClassName = answers.mainClassName;
            done();
        }.bind(this));

    },

    configuring: function() {
        this.log('configuring');
        // if codeheader option not set then set variable automatically
        if(!this.options.codeheader) {
            this.codeHeader = 'codeheader/Header.txt';
        } else {
            this.codeHeader = this.options.codeheader;
        }
    },

    default: function() {
        this.log('default');
    },

    writing: {

        gizmoFile: function() {
            this.copy('_gizmo', this._fromRoot('/.gizmo'));
        },

        gitFiles: function() {
            this.copy('_gitattributes', this._fromRoot('/.gitattributes'));
            this.copy('_gitignore', this._fromRoot('/.gitignore'));
        },

        javaProject: function() {
            var packageDir = this.packageName.replace(/\./g, '/');
            // src/main/java
            this.fs.copyTpl(
                this.templatePath('src/main/java/_App.java'),
                this.destinationPath(this._fromRoot('src/main/java/' + packageDir + '/' + this.mainClassName + '.java')), {
                    codeHeader: this._codeHeader(),
                    packageName: this.packageName,
                    mainClassName: this.mainClassName
                }
            );
            // src/test/java
            var testClassName = 'Test' + this.mainClassName;
            this.fs.copyTpl(
                this.templatePath('src/test/java/_TestApp.java'),
                this.destinationPath(this._fromRoot('src/test/java/' + packageDir + '/' + testClassName + '.java')), {
                    codeHeader: this._codeHeader(),
                    packageName: this.packageName,
                    testClassName: testClassName
                }
            );
        },

        mavenizeProject: function() {
            if(this.buildTool === 'maven') {
                this.fs.copyTpl(
                    this.templatePath('maven/_pom.xml'),
                    this.destinationPath(this._fromRoot('pom.xml')), {
                        projectName: this.projectName,
                        groupId: this.packageName,
                        version: this.version,
                        description: this.description,
                        packaging: this.packaging,
                        javaVersion: this.javaVersion
                    }
                );
            }
        },

        gradlizeProject: function() {
            this.log('gradlizeProject is running ' + this.buildtool);

            if(this.buildTool === 'gradle') {
                this.log('this.buildTool is gradle');

                this.fs.copyTpl(
                    this.templatePath('gradle/_build.gradle'),
                    this.destinationPath(this._fromRoot('build.gradle')), {
                        description: this.description
                    }
                );
                this.fs.copyTpl(
                    this.templatePath('gradle/_gradle.properties'),
                    this.destinationPath(this._fromRoot('gradle.properties')), {
                        projectName: this.projectName,
                        javaVersion: this.javaVersion,
                        groupName: this.packageName,
                        version: this.version
                    }
                );
                this.copy('gradle/_gradlew', this._fromRoot('gradlew'));
                this.copy('gradle/_gradlew.bat', this._fromRoot('gradlew.bat'));
                this.copy('gradle/_settings.gradle', this._fromRoot('settings.gradle'));
                this.directory('gradle/wrapper', this._fromRoot('gradle/wrapper'));

            }
        },

        miscFiles: function() {
            this.copy('_editorconfig', this._fromRoot('editorconfig'));
            this.fs.copyTpl(
                this.templatePath('_README.md'),
                this.destinationPath(this._fromRoot('README.md')), {
                    projectName: this.projectName
                }
            );
        }
    },

    conflicts: function() {
        this.log('conflicts');
    },

    install: function() {
        this.        this.log('conflicts');
('install');
    },

    end: function() {
        this.log('end');
    },

    _fromRoot: function(asset) {
        return this.projectName + '/' + asset;
    },

    _codeHeader: function() {
        this.fs.copyTpl(
            this.templatePath(this.codeHeader),
            this.destinationPath(this._fromRoot('.codeheader')), {
                projectName: this.projectName,
                createdTime: datetime.nowFormatted(),
                packageName: this.packageName,
                className: this.mainClassName,
                tagline: 'Baked with love'
            }
        );
        var content = this.fs.read(this.destinationPath(this._fromRoot('.codeheader')));
        this.fs.delete(this.destinationPath(this._fromRoot('.codeheader')));
        return content;
    }

});
