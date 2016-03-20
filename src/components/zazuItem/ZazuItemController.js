export class ZazuItemController {

  constructor ($window) {
    this.$window = $window;
  }

  scroll ($inViewport, $offset) {
    if ($inViewport) {
      return;
    }
    this.$window.scrollTo(0, $offset);
  }
}
