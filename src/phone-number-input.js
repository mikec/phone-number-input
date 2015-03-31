// phone-number-input
// v0.0.2

(function() {

	if(!window.litl) window.litl = angular.module('litl', []);

	window.litl.directive('phoneNumberInput', [function() {

		var numDigits = 10;

		var tmpl = 
			'<div class="phone-number-input">' +
				'<span class="paren open">(</span>' +
				getInputStr(0) + getInputStr(1) + getInputStr(2) +
				'<span class="paren close">)</span>' +
				getInputStr(3) + getInputStr(4) + getInputStr(5) +
				'<span class="dash">-</span>' +
				getInputStr(6) + getInputStr(7) + getInputStr(8) + getInputStr(9) +
			'</div>';

		function getInputStr(index) {
			var n = index + 1;
			return '<input ng-model="d' + n + '" '+
							'ng-keydown="keydown($event, ' + index + ')" ' +
							'ng-focus="focus($event, ' + index + ')" ' +
							'ng-blur="blur($event, ' + index + ')" ' +
							'class="digit d' + n + ' placeholder" />';
		}

		return {
			template: tmpl,
			link: function(scope, element) {

				var inputs = getInputElements();

				setAllPlaceholders();

				scope.focus = function(evt, idx) {
					clearPlaceholder(idx);
				};

				scope.blur = function(evt, idx) {
					var v = getValue(idx);
					if(angular.isUndefined(v) || v === '' || v === ' ') {
						setPlaceholder(idx);
					}
				};

				scope.keydown = function(evt, idx) {
					var key = event.keyCode || event.charCode;
					var del = ( key == 8 || key == 46 );
					var str = String.fromCharCode(key);
					var isNum = (/\d/.test(str));

					if(isNum) {
						clearPlaceholder(idx, str);
						var nxtIdx = idx + 1;
						if(nxtIdx < 10) {
							inputs[nxtIdx][0].focus();
						}
					} else if (del) {
						setPlaceholder(idx);
						var prevIdx = idx - 1;
						if(prevIdx >= 0) {
							inputs[prevIdx][0].focus();
						}
					}
					evt.preventDefault();
				};

				function setAllPlaceholders() {
					for(var i=0; i < numDigits; i++) {
						setPlaceholder(i);
					}
				}

				function setPlaceholder(index) {
					var n = index + 1;
					scope['d' + n] = '0';
					var inp = inputs[index];
					inp.hasPlaceholder = true;
					inp.addClass('placeholder');
				}

				function clearPlaceholder(index, newVal) {
					setValue(index, newVal);
					var inp = inputs[index];
					inp.hasPlaceholder = false;
					inp.removeClass('placeholder');
				}

				function getValue(index) {
					return scope['d' + (index + 1)];
				}

				function setValue(index, value) {
					scope['d' + (index + 1)] = value;
				}

				function getInputElements() {
					var inputElems = [];
					var elems = element.find('input');
					for(var i=0; i < numDigits; i++) {
						inputElems[i] = angular.element(elems[i]);
					}
					return inputElems;
				}

			}
		};

		/*function getCaretPosition(input) {
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
	    };*/

	}]);

})();