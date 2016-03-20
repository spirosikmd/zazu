export class ZazuItemController {

  constructor ($window) {
    this.$window = $window;
  }

  /**
   * If element is not in viewport then scroll to its offsetTop.
   * @param {boolean} $inViewport True if element is in viewport, false otherwise.
   * @param {number} $offset The offsetTop of element.
   */
  scroll ($inViewport, $offset) {
    if ($inViewport) {
      return;
    }
    this.$window.scrollTo(0, $offset);
  }
}
