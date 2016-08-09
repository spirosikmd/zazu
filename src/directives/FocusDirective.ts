interface IFocusDirectiveAttributes extends angular.IAttributes {
  focus: string;
}

/**
 * focus directive which focus on an element when element is loaded.
 * @param $timeout
 * @constructor
 */
// @ngInject
export function FocusDirective ($timeout: angular.ITimeoutService) {
  return {
    link: function (
      scope: angular.IScope, element: angular.IAugmentedJQuery, attributes: IFocusDirectiveAttributes
    ) {
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
