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
					var inp = inputs[idx];
					if(!inp.hasPlaceholder) {
						inp.storedValue = getValue(idx);
					}
					clearPlaceholder(idx);
				};

				scope.blur = function(evt, idx) {
					var v = getValue(idx);
					if(angular.isUndefined(v) || v === '' || v === ' ') {
						var sv = inputs[idx].storedValue;
						if(!sv) {
							setPlaceholder(idx);
						} else {
							setValue(idx, sv);
						}
					}
				};

				scope.keydown = function(evt, idx) {
					var key = evt.keyCode || evt.charCode;
					var del = ( key == 8 || key == 46 );
					var str = String.fromCharCode(key);
					var isNum = (/\d/.test(str));

					if(isNum) {
						clearPlaceholder(idx, str);
						var nxtIdx = idx + 1;
						if(nxtIdx < 10) {
							inputs[nxtIdx][0].focus();
						} else {
							inputs[idx][0].blur();
						}
					} else if (del) {
						setPlaceholder(idx);
						var prevIdx = idx - 1;
						if(prevIdx >= 0) {
							inputs[prevIdx][0].focus();
						} else {
							inputs[idx][0].blur();
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
					inp.storedValue = undefined;
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

	}]);

})();