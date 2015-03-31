var phVal = '0';
var phClass = 'placeholder';

describe('init', function() {

    beforeEach(module('litl'));

    beforeEach(inject(function($rootScope, $compile) {
        this.body = $j(window.document.body);
        this.scope = $rootScope.$new();
        this.element = $compile('<div phone-number-input></div>')(this.scope);
        this.body.append(this.element);
        this.scope.$digest();
    }));

    it('should set initial values to 0', function() {
        this.expectValue(0).toBe(phVal);
        this.expectValue(1).toBe(phVal);
        this.expectValue(2).toBe(phVal);
        this.expectValue(3).toBe(phVal);
        this.expectValue(4).toBe(phVal);
        this.expectValue(5).toBe(phVal);
        this.expectValue(6).toBe(phVal);
        this.expectValue(7).toBe(phVal);
        this.expectValue(8).toBe(phVal);
        this.expectValue(9).toBe(phVal);
    });

    it('should set placeholder classes', function() {
        expect(this.getInputElement(0).hasClass(phClass)).toBeTruthy();
        expect(this.getInputElement(1).hasClass(phClass)).toBeTruthy();
        expect(this.getInputElement(2).hasClass(phClass)).toBeTruthy();
        expect(this.getInputElement(3).hasClass(phClass)).toBeTruthy();
        expect(this.getInputElement(4).hasClass(phClass)).toBeTruthy();
        expect(this.getInputElement(5).hasClass(phClass)).toBeTruthy();
        expect(this.getInputElement(6).hasClass(phClass)).toBeTruthy();
        expect(this.getInputElement(7).hasClass(phClass)).toBeTruthy();
        expect(this.getInputElement(8).hasClass(phClass)).toBeTruthy();
        expect(this.getInputElement(9).hasClass(phClass)).toBeTruthy();
    });

    describe('when an input is focused', function() {

        beforeEach(function() {
            this.setInputFocus(0);
        });

        it('should set value to blank', function() {
            this.expectValue(0).toBeUndefined();
        });

        it('should remove placeholder class', function() {
            expect(this.getInputElement(0).hasClass(phClass)).toBeFalsy();
        });

        describe('and then blurred', function() {

            beforeEach(function() {
                this.blurInput(0);
            });

            it('should set value back to 0', function() {
                this.expectValue(0).toBe(phVal);
            });

            it('should add the placeholder class back', function() {
                expect(this.getInputElement(0).hasClass(phClass)).toBeTruthy();
            });

        });

    });

    describe('when an element with a value is blurred', function() {

        beforeEach(function() {
            this.setInputFocus(0);
            this.scope.keydown(new MockKeyEvent(55), 0);
            this.blurInput(0);
        });

        it('should not change the input value', function() {
            this.expectValue(0).toBe('7');
        });

    });

    describe('when a numeric value is input', function() {

        beforeEach(function() {
            this.setInputFocus(0);
            this.scope.keydown(new MockKeyEvent(55), 0);
        });

        it('should set value of the numeric key', function() {
            this.expectValue(0).toBe('7');
        });

        it('should move focus to the next element', function() {
            this.expectToBeFocused(1);
        });

    });

    describe('when a non-numeric value is input', function() {

        beforeEach(function() {
            this.setInputFocus(0);
            this.scope.keydown(new MockKeyEvent(88), 0);
        });

        it('should not set any value', function() {
            this.expectValue(0).toBeUndefined();
        });

        it('should keep focus on the current element', function() {
            this.expectToBeFocused(0);
        });

    });

    describe('when backspace is pressed', function() {

        beforeEach(function() {
            this.setInputFocus(5);
            this.scope.keydown(new MockKeyEvent(55), 0);
            this.scope.keydown(new MockKeyEvent(8), 5);
        });

        runDeleteKeyTests();

    });

    describe('when delete is pressed', function() {

        beforeEach(function() {
            this.setInputFocus(5);
            this.scope.keydown(new MockKeyEvent(55), 0);
            this.scope.keydown(new MockKeyEvent(46), 5);
        });

        runDeleteKeyTests();

    });

    beforeEach(function() {

        this.expectValue = function(index) {
            var n = index + 1;
            return expect(this.scope['d' + n]);
        };

        this.blurInput = function(index) {
            this.scope.blur(null, index);
            this.getInputElement(index).blur();
        };

        this.setInputFocus = function(index) {
            this.scope.focus(null, index);
            this.getInputElement(index).focus();
        };

        this.getInputElement = function(index) {
            return $j(this.element).find('input:eq(' + index + ')');
        };

        this.expectToBeFocused = function(index) {
            expect(this.getInputElement(index)[0]).toEqual(window.document.activeElement);
        };

    });

});

function runDeleteKeyTests() {

    it('should set the value of the current input to the placeholder value', function() {
        this.expectValue(5).toBe(phVal);
    });

    it('should move focus to the previous element', function() {
        this.expectToBeFocused(4);
    });

}

function MockKeyEvent(keyCode) {
    this.keyCode = keyCode;
}

MockKeyEvent.prototype.preventDefault = function() {};