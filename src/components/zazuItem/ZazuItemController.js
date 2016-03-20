export class ZazuItemController {

  /**
   * If element is not in viewport then scroll to its offsetTop.
   * @param {boolean} inViewport True if element is in viewport, false otherwise.
   * @param {number} offset The offsetTop of element.
   */
  scroll (inViewport, offset) {
    if (inViewport) {
      return;
    }
    this.onOutViewport({offset: offset});
  }
}
