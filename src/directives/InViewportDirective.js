/**
 * Execute callback with result whether element is in viewport and its offsetTop.
 * @param $parse
 * @constructor
 */
// @ngInject
export function InViewportDirective ($parse) {
  return {
    link: function (scope, element, attributes) {
      if (!attributes.inViewport) {
        return;
      }

      let inViewFunc = $parse(attributes.inViewport);

      inViewFunc(scope, {
        inViewport: elementInViewport(element[0]),
        offset: element[0].offsetTop
      });
    }
  };

  /**
   * Determine if element is in viewport.
   * @param {HTMLElement} el The element.
   */
  function elementInViewport (el) {
    let top = el.offsetTop;
    let left = el.offsetLeft;
    let width = el.offsetWidth;
    let height = el.offsetHeight;

    while (el.offsetParent) {
      el = el.offsetParent;
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
