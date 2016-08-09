interface IInViewportDirectiveAttributes extends angular.IAttributes {
  inViewport: string;
}

/**
 * Execute callback with result whether element is in viewport
 * and its offsetTop when elements' offsetTop changes.
 * @param $parse
 * @constructor
 */
// @ngInject
export function InViewportDirective ($parse: angular.IParseService) {
  return {
    link: function (
      scope: angular.IScope, element: angular.IAugmentedJQuery, attributes: IInViewportDirectiveAttributes
    ) {
      if (!attributes.inViewport) {
        return;
      }

      let inViewFunc = $parse(attributes.inViewport);

      const positionWatch = scope.$watch(() => {
        return element[0].offsetTop;
      }, (newPosition) => {
        inViewFunc(scope, {
          inViewport: elementInViewport(element[0]),
          offset: newPosition
        });
      });

      scope.$on('$destroy', () => {
        positionWatch();
      })
    }
  };

  /**
   * Determine if element is in viewport.
   * @param {HTMLElement} el The element.
   */
  function elementInViewport (el: HTMLElement) {
    let top = el.offsetTop;
    let left = el.offsetLeft;
    let width = el.offsetWidth;
    let height = el.offsetHeight;

    while (el.offsetParent) {
      el = el.offsetParent as HTMLElement;
      top += el.offsetTop;
      left += el.offsetLeft;
    }

    return (
      top >= window.pageYOffset &&
      left >= window.pageXOffset &&
      (top + height) <= (window.pageYOffset + window.innerHeight) &&
      (left + width) <= (window.pageXOffset + window.innerWidth)
    );
  }
}
