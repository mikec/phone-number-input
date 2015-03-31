(function() {

	if(!window.litl) window.litl = angular.module('litl', []);

	window.litl.directive('phoneNumberInput', [function() {

		function getCaretPosition(input) {
			if (!input) return 0;
			if (input.selectionStart !== undefined) {
				return input.selectionStart;
			} else if (document.selection) {
				input.focus();
				var selection = document.selection.createRange();
				selection.moveStart('character', input.value ? -input.value.length : 0);
				return selection.text.length;
			}
			return 0;
		}

	    function setCaretPosition(input, pos){
	        if (!input) return 0;
	        if (input.offsetWidth === 0 || input.offsetHeight === 0) {
	            return; // Input's hidden
	        }
	        if (input.setSelectionRange) {
	            input.focus();
	            input.setSelectionRange(pos, pos);
	        }
	        else if (input.createTextRange) {
	            var range = input.createTextRange();
	            range.collapse(true);
	            range.moveEnd('character', pos);
	            range.moveStart('character', pos);
	            range.select();
	        }
	    }

	    return {
	        require: 'ngModel',
	        link: function(scope, elem, attrs, ctrl) {
	        	ctrl.$parsers.push(function(val) {
	        		var append = ' 867 - 5309';
	        		var newVal = val.replace(append, '') + append;
	        		ctrl.$viewValue = newVal;
	        		elem.val(newVal);
	        		return newVal;
	        	});
	        }
	    };
	}]);

})();