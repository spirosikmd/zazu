require('angular-mocks');

import zazuApp from '../src/index';

describe('component: zazuItem', () => {
  let $componentController;
  let $window;
  let $scope;
  let component;
  let zazu;
  let isSelected;
  let callbacks;

  beforeEach(angular.mock.module(zazuApp));

  beforeEach(inject((_$componentController_, _$window_, _$rootScope_) => {
    $componentController = _$componentController_;
    $window = _$window_;
    $scope = _$rootScope_.$new();
    zazu = {id: 'zazu-id', label: 'zazu-label', checked: true};
    isSelected = true;
  }));

  beforeEach(() => {
    callbacks = {
      onUpdateChecked: jasmine.createSpy('onUpdateChecked'),
      onUpdateLabel: jasmine.createSpy('onUpdateLabel')
    };
    component = $componentController('zazuItem', {$scope: $scope, $window: $window}, {
      zazu: zazu,
      isSelected: isSelected,
      onUpdateChecked: callbacks.onUpdateChecked,
      onUpdateLabel: callbacks.onUpdateLabel
    });
  });

  afterEach(() => {
    $componentController = null;
    $window = null;
    $scope = null;
    component = null;
    callbacks = null;
    zazu = null;
    isSelected = null;
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should assign the name bindings to the zazu object', () => {
    expect(component.zazu.id).toBe('zazu-id');
    expect(component.zazu.label).toBe('zazu-label');
    expect(component.zazu.checked).toBe(true);
  });

  it('should call the onUpdateChecked binding when zazu checked is updated', () => {
    component.onUpdateChecked({id: component.zazu.id, checked: component.zazu.checked});
    expect(callbacks.onUpdateChecked).toHaveBeenCalledWith({id: component.zazu.id, checked: component.zazu.checked});
  });

  it('should call the onUpdateLabel binding when zazu label is updated', () => {
    component.onUpdateLabel({$event: null, id: component.zazu.id, label: component.zazu.label});
    expect(callbacks.onUpdateLabel).toHaveBeenCalledWith({
      $event: null,
      id: component.zazu.id,
      label: component.zazu.label
    });
  });

  describe('scroll', () => {
    beforeEach(() => {
      spyOn($window, 'scrollTo');
    });

    it('should not call $window scrollTo if element is in viewport', () => {
      component.scroll(true, 10);
      expect($window.scrollTo).not.toHaveBeenCalled();
    });

    it('should call $window scrollTo with offsetTop if element is not in viewport', () => {
      component.scroll(false, 10);
      expect($window.scrollTo).toHaveBeenCalledWith(0, 10);
    });
  });
});
