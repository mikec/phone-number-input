
describe('init', function() {

    beforeEach(module('litl'));

    beforeEach(inject(function($rootScope, $compile) {
        this.scope = $rootScope.$new();
        this.element = $compile('<div phone-number-input ng-model="phone"></div>')(this.scope);
        this.scope.$digest();
    }));

    /*it('should set value to " 867 - 5309"', function() {
        expect(this.scope.phone).toBe(' 867 - 5309');
    });*/

	it('should', function() {});

});
