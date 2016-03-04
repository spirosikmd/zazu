require('angular-mocks');

import zazuApp from '../src/index';

describe('component: zazuItem', () => {
  let $componentController;
  let $scope;
  let component;
  let zazu;
  let callbacks;

  beforeEach(angular.mock.module(zazuApp));

  beforeEach(inject((_$componentController_, _$rootScope_) => {
    $componentController = _$componentController_;
    $scope = _$rootScope_.$new();
    zazu = {id: 'zazu-id', label: 'zazu-label', checked: true};
  }));

  beforeEach(() => {
    callbacks = {
      onUpdateChecked: jasmine.createSpy('onUpdateChecked'),
      onUpdateLabel: jasmine.createSpy('onUpdateLabel')
    };
    component = $componentController('zazuItem', {$scope: $scope}, {
      zazu: zazu,
      onUpdateChecked: callbacks.onUpdateChecked,
      onUpdateLabel: callbacks.onUpdateLabel
    });
  });

  afterEach(() => {
    $componentController = null;
    $scope = null;
    component = null;
    callbacks = null;
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
});
