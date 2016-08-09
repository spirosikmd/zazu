export class ZazuItemController {
  onOutViewport: (offset: {offset: number}) => void;

  /**
   * If element is not in viewport then scroll to its offsetTop.
   * @param {boolean} inViewport True if element is in viewport, false otherwise.
   * @param {number} offset The offsetTop of element.
   */
  scroll (inViewport: boolean, offset: number) {
    if (inViewport) {
      return;
    }
    this.onOutViewport({offset: offset});
  }
}
