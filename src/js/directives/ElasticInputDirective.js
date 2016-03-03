/**
 * angular-elastic-input
 * A directive for AngularJS which automatically resize the width of input field according to the content, while typing.
 * @author: Jacek Pulit <jacek.pulit@gmail.com>
 * @license: MIT License
 */
export default function ($document, $window) {

  var wrapper = angular.element('<div style="position:fixed; top:-999px; left:0;"></div>');
  angular.element($document[0].body).append(wrapper);

  function setMirrorStyle (mirror, element, attributes) {
    var style = $window.getComputedStyle(element[0]);
    var defaultMaxWidth = style.maxWidth === 'none' ? element.parent().prop('clientWidth') : style.maxWidth;
    element.css('minWidth', attributes.elasticInputMinWidth || style.minWidth);
    element.css('maxWidth', attributes.elasticInputMaxWidth || defaultMaxWidth);

    angular.forEach(['fontFamily', 'fontSize', 'fontWeight', 'fontStyle',
      'letterSpacing', 'textTransform', 'wordSpacing'], function (value) {
      mirror.css(value, style[value]);
    });

    mirror.css('paddingLeft', style.textIndent);

    if (style.boxSizing === 'border-box') {
      angular.forEach(['paddingLeft', 'paddingRight',
        'borderLeftStyle', 'borderLeftWidth',
        'borderRightStyle', 'borderRightWidth'], function (value) {
        mirror.css(value, style[value]);
      });
    } else if (style.boxSizing === 'padding-box') {
      angular.forEach(['paddingLeft', 'paddingRight'], function (value) {
        mirror.css(value, style[value]);
      });
    }
  }

  return {
    restrict: 'A',
    link: function postLink (scope, element, attributes) {

      // Disable trimming inputs by default
      attributes.$set('ngTrim', attributes.ngTrim === 'true' ? 'true' : 'false');

      var mirror = angular.element('<span style="white-space:pre;"></span>');
      setMirrorStyle(mirror, element, attributes);

      wrapper.append(mirror);

      function update () {
        mirror.text(element.val() || attributes.placeholder || '');
        var delta = parseInt(attributes.elasticInputWidthDelta) || 1;
        element.css('width', mirror.prop('offsetWidth') + delta + 'px');
      }

      update();

      if (attributes.ngModel) {
        scope.$watch(attributes.ngModel, update);
      } else {
        element.on('keydown keyup focus input propertychange change', update);
      }

      scope.$on('$destroy', function () {
        mirror.remove();
      });
    }
  };
}
