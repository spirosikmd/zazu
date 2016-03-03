/**
 * focus directive which focus on an element when element is loaded.
 * @param $timeout
 * @constructor
 */
export default function FocusDirective ($timeout) {
  return {
    link: function (scope, element, attributes) {
      scope.$watch(attributes.focus, function (value) {
        if (value === true) {
          $timeout(function () {
            element[0].focus();
          });
        }
      });
    }
  }
}
