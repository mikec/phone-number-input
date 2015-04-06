
phone-number-input
==================

[![Build Status](https://travis-ci.org/mikec/phone-number-input.svg?branch=master)](https://travis-ci.org/mikec/phone-number-input)

Angular directive to capture input of US based 10-digit phone numbers.

Take a look at the [demo page](https://mikec.github.io/phone-number-input)


Usage
-----

Get it with bower

    bower install phone-number-input

Reference the script

    <script src="path/to/phone-number-input.js"></script>

Add our module to your app

    angular.module('myApp', ['litl']);

Use it in your form with `ng-model`, just like you use other Angular input directives.

    <form name="myForm">
        <div phone-number-input
                name="myPhoneNumber"
                ng-model="myPhoneNumber">
        </div>
    </form>

It also works with the `required` directive

    <form name="myForm" novalidate>
        <div phone-number-input
                name="myPhoneNumber"
                ng-model="myPhoneNumber"
                required>
        </div>
    </form>


Forcing focus
-------------

Use the `force-focus` attribute to force focus of the first input box

    <div phone-number-input ng-model="myPhoneNumber" force-focus></div>


Customizing the Style
---------------------

The directive comes without any styling. Use these classes to stylize it:

* `.paren`: Both parentheses, `(` and `)`
* `.paren.open`: Opening parenthesis, `(`
* `.paren.close`: Closing parenthesis, `)`
* `.dash`: The dash character, `-`
* `.digit`: All 10 numeric digit boxes
* `.digit.d1`, `.digit.d2`, ... `.digit.d10`: Individual numeric digit boxes

The [demo page](https://mikec.github.io/phone-number-input) has some simple styles applied that you can use as an example.
