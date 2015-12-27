'use strict';
/*
 * Make methods private
 * prefix methods with '_' to make it private
 * use instance method
 * implement method in Base object
 */
var generators = require('yeoman-generator');

var MyBase = generators.Base.extend({
    // methods that are implemented in base class are not automatically executed
    anotherHelper: function() {
        console.log('inside another helper');
    }
});

module.exports = MyBase.extend({

    constructor: function() {
        generators.Base.apply(this, arguments);

    },

    init: function() {
        this.log('inside init');
        // instance methods are private and not executed by yeoman
        this.baz = function() {
            this.log('inside instance method baz');
        }
    },

    bar: function() {
        this.log('inside bar');
        this._foo();
        this.baz();
        this.anotherHelper();
    },

    // methods that start with '_' are private and not executed by yeoman
    _foo: function() {
        this.log('inside foo');
    },

    method1: function() {
        this.log('Hello, World!');
    }
});
