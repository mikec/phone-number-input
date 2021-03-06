/**
 * phone-number-input
 * v0.1.1
 *
 * captures input of US based 10-digit phone numbers
 **/

(function() {

    angular.module('litl.phoneNumberInput', []).directive('phoneNumberInput',
    [function() {

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
			require: 'ngModel',
			link: function(scope, element, attrs, ngModelCtrl) {

				var inputs = getInputElements();

				if(!angular.isUndefined(attrs.forceFocus)) {
					inputs[0][0].focus();
				}

				ngModelCtrl.$render = function() {
					var viewVal = ngModelCtrl.$viewValue;
					if(viewVal && viewVal.length > 0) {
						for(var i=0; i < viewVal.length; i++) {
							var inpVal = viewVal[i];
							setScopeValue(i, inpVal.displayValue);
							var inp = inputs[i];
							if(inpVal.hasPlaceholder) {
								inp.addClass('placeholder');
							} else {
								inp.removeClass('placeholder');
							}
						}
					}
				};

				ngModelCtrl.$validators.phoneNumber = function(modelValue) {
					var mob = /^[1-9]{1}[0-9]{9}$/;
    				return mob.test(modelValue);
				};

				ngModelCtrl.$isEmpty = function(value) {
					if(value) {
						for(var i=0; i < value.length; i++) {
							if(!angular.isUndefined(getModelValueForIndex(i))) {
								return false;
							}
						}
					}
					return true;
				};

				ngModelCtrl.$parsers.push(viewValueParser);
				ngModelCtrl.$formatters.push(valueFormatter);

				initView();

				scope.focus = function(evt, idx) {
					var inpVal = ngModelCtrl.$viewValue[idx];
					if(!inpVal.hasPlaceholder) {
						inpVal.storedValue = inpVal.displayValue;
					}
					clearPlaceholder(idx);
					setViewValue();
					ngModelCtrl.$render();
				};

				scope.blur = function(evt, idx) {
					var inpVal = ngModelCtrl.$viewValue[idx];
					var v = inpVal.displayValue;
					if(angular.isUndefined(v) || v === '' || v === ' ') {
						var sv = inpVal.storedValue;
						if(!sv) {
							setPlaceholder(idx);
						} else {
							inpVal.displayValue = sv;
						}
					}
					setViewValue();
					ngModelCtrl.$render();
				};

				scope.keydown = function(evt, idx) {
					var key = evt.keyCode || evt.charCode;
					var del = ( key == 8 || key == 46 );
					var leftOrDown = ( key == 37 || key == 40 );
					var rightOrUp = ( key == 39 || key == 38 );
					var str = String.fromCharCode(key);
					var isNum = (/\d/.test(str));
					var focusPrev, focusNext;

					var inpVal = ngModelCtrl.$viewValue[idx];

					if(isNum) {
						if(angular.isUndefined(inpVal.displayValue)) {
							clearPlaceholder(idx, str);
						}
						focusNext = true;
					} else if (del) {
						inpVal.storedValue = undefined;
						if(idx > 0) {
							setPlaceholder(idx);
							setPlaceholder(idx - 1);
						}
						focusPrev = true;
					} else if (leftOrDown) {
						focusPrev = true;
					} else if (rightOrUp) {
						focusNext = true;
					}

					if(focusPrev) {
						var prevIdx = idx - 1;
						if(prevIdx >= 0) {
							inputs[prevIdx][0].focus();
						}
					} else if (focusNext) {
						var nxtIdx = idx + 1;
						if(nxtIdx < 10) {
							inputs[nxtIdx][0].focus();
						}
					}

					evt.preventDefault();
					setViewValue();
					ngModelCtrl.$render();
				};

				function initView() {
					var viewVal = valueFormatter('');
					ngModelCtrl.$setViewValue(viewVal);
					ngModelCtrl.$render();
				}

				function valueFormatter(val) {
					if(!val) val = '';
					val = val.replace(/\D/g,'');
					var viewVal = [];
					for(var i=0; i < 10; i++) {
						var c = val.charAt(i);
						viewVal[i] = {
							displayValue: (c ? c : '0'),
							storedValue: undefined,
							hasPlaceholder: (c ? false : true)
						};
					}
					return viewVal;
				}

				function viewValueParser(viewValue) {
					var v = '';
					if(viewValue && viewValue.length > 0) {
						for(var i=0; i < viewValue.length; i++) {
							var val = getModelValueForIndex(i);
							if(!angular.isUndefined(val)) {
								v += val;
							}
						}
					}
					return v;
				}

				function getModelValueForIndex(index) {
					var val;
					var inpVal = ngModelCtrl.$viewValue[index];
					if(!inpVal.hasPlaceholder) {
						if((parseInt(inpVal.displayValue) >= 0)) {
							val = inpVal.displayValue;
						} else if ((parseInt(inpVal.storedValue) >= 0)) {
							val = inpVal.storedValue;
						}
					}
					return val;
				}

				function setPlaceholder(index) {
					var inpVal = ngModelCtrl.$viewValue[index];
					inpVal.displayValue = '0';
					inpVal.storedValue = undefined;
					inpVal.hasPlaceholder = true;
				}

				function clearPlaceholder(index, newVal) {
					var inpVal = ngModelCtrl.$viewValue[index];
					inpVal.displayValue = newVal;
					inpVal.hasPlaceholder = false;
				}

				function setScopeValue(index, value) {
					scope['d' + (index + 1)] = value;
				}

				function setViewValue() {
					ngModelCtrl.$setViewValue(
						angular.copy(ngModelCtrl.$viewValue)
					);
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

	}]);

})();