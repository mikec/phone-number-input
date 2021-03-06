var phVal = '0';
var phClass = 'placeholder';

describe('phone-number-input', function() {

    beforeEach(module('litl.phoneNumberInput'));

    describe('without a form', function() {

        beforeEach(inject(function($rootScope, $compile) {
            this.body = $j(window.document.body);
            this.scope = $rootScope.$new();
            this.element = $compile(
                '<div phone-number-input ng-model="phoneNumber"></div>')(this.scope);
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

        describe('when an element with a value is input, then deleted, then focused and blurred',
        function() {

            beforeEach(function() {
                this.setInputFocus(0);
                this.scope.keydown(new MockKeyEvent(55), 0);
                this.setInputFocus(0);
                this.scope.keydown(new MockKeyEvent(8), 0);
                this.setInputFocus(0);
                this.blurInput(0);
            });

            it('should set the placeholder value', function() {
                this.expectValue(0).toBe(phVal);
            });

        });

        describe('when an element with a value is focused', function() {

            beforeEach(function() {
                this.setInputFocus(0);
                this.scope.keydown(new MockKeyEvent(55), 0);
                this.setInputFocus(0);
            });

            it('should clear the value', function() {
                this.expectValue(0).toBeUndefined();
            });

            describe('and then blurred', function() {

                beforeEach(function() {
                    this.blurInput(0);
                });

                it('should set the original value', function() {
                    this.expectValue(0).toBe('7');
                });

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

        describe('when a full phone number is input', function() {

            beforeEach(function() {
                this.setInputFocus(0);
                this.scope.keydown(new MockKeyEvent(53), 0);
                this.scope.keydown(new MockKeyEvent(53), 1);
                this.scope.keydown(new MockKeyEvent(53), 2);
                this.scope.keydown(new MockKeyEvent(55), 3);
                this.scope.keydown(new MockKeyEvent(55), 4);
                this.scope.keydown(new MockKeyEvent(55), 5);
                this.scope.keydown(new MockKeyEvent(56), 6);
                this.scope.keydown(new MockKeyEvent(56), 7);
                this.scope.keydown(new MockKeyEvent(56), 8);
                this.scope.keydown(new MockKeyEvent(56), 9);
            });

            it('should set the model to an unformatted phone number', function() {
                expect(this.scope.phoneNumber).toBe('5557778888');
            });

        });

        describe('when scope value is set to a full phone number', function() {

            beforeEach(function() {
                this.scope.phoneNumber = '2223334444';
                this.scope.$digest();
            });

            it('should display this phone number in the view', function() {
                this.expectPhoneNumberDisplayToBe(
                    '2', '2', '2', '3', '3', '3', '4', '4', '4', '4');
            });

        });

        describe('when scope value is set to a partial phone number', function() {

            beforeEach(function() {
                this.scope.phoneNumber = '234';
                this.scope.$digest();
            });

            it('should display this phone number in the view', function() {
                this.expectPhoneNumberDisplayToBe('2', '3', '4');
            });

        });

        describe('when scope value has non-numeric characters', function() {

            beforeEach(function() {
                this.scope.phoneNumber = 'A1B2';
                this.scope.$digest();
            });

            it('should remove the non-numeric characters from view', function() {
                this.expectPhoneNumberDisplayToBe('1', '2');
            });

        });

        describe('when a numeric value is input on the last input', function() {

            beforeEach(function() {
                this.setInputFocus(9);
                this.scope.keydown(new MockKeyEvent(55), 9);
            });

            it('the last input should not be blurred', function() {
                this.expectToBeFocused(9);
            });

            describe('and another numeric value is entered', function() {

                beforeEach(function() {
                    this.scope.keydown(new MockKeyEvent(53), 9);
                });

                it('should not display the value', function() {
                    this.expectValue(9).toBe('7');
                });

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
                this.scope.keydown(new MockKeyEvent(50), 4);
                this.scope.keydown(new MockKeyEvent(55), 5);
                this.setInputFocus(5);
                this.scope.keydown(new MockKeyEvent(8), 5);
            });

            runDeleteKeyTests();

        });

        describe('when delete is pressed', function() {

            beforeEach(function() {
                this.scope.keydown(new MockKeyEvent(50), 4);
                this.scope.keydown(new MockKeyEvent(55), 5);
                this.setInputFocus(5);
                this.scope.keydown(new MockKeyEvent(46), 5);
            });

            runDeleteKeyTests();

        });

        describe('when backspace is pressed on the first input', function() {

            beforeEach(function() {
                this.setInputFocus(0);
                this.scope.keydown(new MockKeyEvent(8), 0);
            });

            it('should not blur the first input', function() {
                this.expectToBeFocused(0);
            });

            it('should not set any value on the first input', function() {
                this.expectValue(0).toBeUndefined();
            });

        });

        describe('when backspace is pressed on the last input', function() {

            beforeEach(function() {
                this.setInputFocus(9);
                this.scope.keydown(new MockKeyEvent(55), 9);
                this.scope.keydown(new MockKeyEvent(8), 9);
            });

            it('should focus the previous input', function() {
                this.expectToBeFocused(8);
            });

            it('should set the placeholder value on the last input', function() {
                this.expectValue(9).toBe(phVal);
            });

        });

        describe('when left arrow is pressed', function() {

            beforeEach(function() {
                this.setInputFocus(7);
                this.scope.keydown(new MockKeyEvent(37), 7);
            });

            it('should focus previous element', function() {
                this.expectToBeFocused(6);
            });

        });

        describe('when right arrow is pressed', function() {

            beforeEach(function() {
                this.setInputFocus(7);
                this.scope.keydown(new MockKeyEvent(39), 7);
            });

            it('should focus next element', function() {
                this.expectToBeFocused(8);
            });

        });

        describe('when down arrow is pressed', function() {

            beforeEach(function() {
                this.setInputFocus(7);
                this.scope.keydown(new MockKeyEvent(40), 7);
            });

            it('should focus previous element', function() {
                this.expectToBeFocused(6);
            });

        });

        describe('when up arrow is pressed', function() {

            beforeEach(function() {
                this.setInputFocus(7);
                this.scope.keydown(new MockKeyEvent(38), 7);
            });

            it('should focus next element', function() {
                this.expectToBeFocused(8);
            });

        });

    });

    describe('when used within a form', function() {

        beforeEach(inject(function($rootScope, $compile) {
            this.body = $j(window.document.body);
            this.scope = $rootScope.$new();
            this.element = $compile(
                '<form name="phoneNumberForm" novalidate> \
                    <div phone-number-input \
                            name="num" \
                            ng-model="num"> \
                    </div> \
                </form>'
            )(this.scope);
            this.body.append(this.element);
            this.scope.$digest();
        }));

        it('should set phoneNumber error to true', function() {
            expect(this.scope.phoneNumberForm.num.$error.phoneNumber).toBeTruthy();
        });

        describe('when the model value is a valid phone number', function() {

            beforeEach(function() {
                this.scope.num = '5558230948';
                this.scope.$digest();
            });

            it('should set phoneNumber error to false', function() {
                expect(this.scope.phoneNumberForm.num.$error.phoneNumber).toBeUndefined();
            });

        });

        describe('when the phone number has a leading zero', function() {

            beforeEach(function() {
                this.scope.num = '0658230948';
                this.scope.$digest();
            });

            it('should set phoneNumber error to true', function() {
                expect(this.scope.phoneNumberForm.num.$error.phoneNumber).toBeTruthy();
            });

        });

    });

    describe('with required directive is used within a form', function() {

        beforeEach(inject(function($rootScope, $compile) {
            this.body = $j(window.document.body);
            this.scope = $rootScope.$new();
            this.element = $compile(
                '<form name="phoneNumberForm" novalidate> \
                    <div phone-number-input \
                            name="num" \
                            ng-model="num" \
                            required></div> \
                </form>'
            )(this.scope);
            this.body.append(this.element);
            this.scope.$digest();
        }));

        it('should set required error to true', function() {
            expect(this.scope.phoneNumberForm.num.$error.required).toBeTruthy();
        });

        describe('when the model value is a partial number', function() {

            beforeEach(function() {
                this.scope.num = '123';
                this.scope.$digest();
            });

            it('should set required error to false', function() {
                expect(this.scope.phoneNumberForm.num.$error.required).toBeFalsy();
            });

        });

        describe('when the model value is a full number', function() {

            beforeEach(function() {
                this.scope.num = '2223334444';
                this.scope.$digest();
            });

            it('should set required error to false', function() {
                expect(this.scope.phoneNumberForm.num.$error.required).toBeFalsy();
            });

        });

    });

    // TODO: fix this test. force-focus attribute works as expected,
    //       but this test fails using PhantomJS
    /*describe('with the force-focus attribute', function() {

        beforeEach(inject(function($rootScope, $compile) {
            this.body = $j(window.document.body);
            this.scope = $rootScope.$new();
            this.element = $compile(
                '<div phone-number-input \
                        force-focus \
                        ng-model="num"> \
                </div>'
            )(this.scope);
            this.body.append(this.element);
            this.scope.$digest();
        }));

        it('should focus the first input', function() {
            this.expectToBeFocused(0);
        });

    });*/

    beforeEach(function() {

        this.expectValue = function(index) {
            var n = index + 1;
            return expect(this.scope['d' + n]);
        };

        this.expectPhoneNumberDisplayToBe = function() {
            for(var i=0; i < 10; i++) {
                var c = arguments[i];
                if(c) {
                    this.expectValue(i).toBe(c);
                    expect(this.getInputElement(i).hasClass(phClass)).toBeFalsy();
                } else {
                    this.expectValue(i).toBe(phVal);
                    expect(this.getInputElement(i).hasClass(phClass)).toBeTruthy();
                }
            }
        };

        this.blurInput = function(index) {
            this.getInputElement(index).blur();
        };

        this.setInputFocus = function(index) {
            this.getInputElement(index).focus();
        };

        this.getInputElement = function(index) {
            return $j(this.element).find('input:eq(' + index + ')');
        };

        this.expectToBeFocused = function(index) {
            expect(this.getInputElement(index)[0]).toEqual(window.document.activeElement);
        };

        this.expectToBeBlurred = function(index) {
            expect(this.getInputElement(index)[0]).not.toEqual(window.document.activeElement);
        };

    });

});

function runDeleteKeyTests() {

    it('should set the value of the current input to the placeholder value', function() {
        this.expectValue(5).toBe(phVal);
    });

    it('should move focus to the previous input', function() {
        this.expectToBeFocused(4);
    });

    describe('and newly focused input is blurred', function() {

        beforeEach(function() {
            this.blurInput(4);
        });

        it('should set the blurred input to the placeholder value', function() {
            this.expectValue(4).toBe(phVal);
        });

    });

}

function MockKeyEvent(keyCode) {
    this.keyCode = keyCode;
}

MockKeyEvent.prototype.preventDefault = function() {};
