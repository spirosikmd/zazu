import {Zazu} from '../../models/zazu.model';
import zazuApp from '../../app.component';
require('angular-mocks');

describe('component: zazuItem', () => {
  let $componentController: angular.IComponentControllerService;
  let $scope: angular.IScope;
  let component;
  let zazu: Zazu;
  let isSelected: boolean;
  let callbacks: {
    onUpdateChecked: jasmine.Spy;
    onUpdateLabel: jasmine.Spy;
    onOutViewport: jasmine.Spy;
  };

  beforeEach(angular.mock.module(zazuApp));

  beforeEach(inject((_$componentController_, _$rootScope_) => {
    $componentController = _$componentController_;
    $scope = _$rootScope_.$new();
    zazu = new Zazu();
    zazu.id = 'zazu-id';
    zazu.label = 'zazu-label';
    zazu.checked = true;
    isSelected = true;
  }));

  beforeEach(() => {
    callbacks = {
      onUpdateChecked: jasmine.createSpy('onUpdateChecked'),
      onUpdateLabel: jasmine.createSpy('onUpdateLabel'),
      onOutViewport: jasmine.createSpy('onOutViewport')
    };
    component = $componentController('zazuItem', {$scope: $scope}, {
      zazu: zazu,
      isSelected: isSelected,
      onUpdateChecked: callbacks.onUpdateChecked,
      onUpdateLabel: callbacks.onUpdateLabel,
      onOutViewport: callbacks.onOutViewport
    });
  });

  afterAll(() => {
    $componentController = null;
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
    it('should not call onOutViewport if element is in viewport', () => {
      component.scroll(true, 10);
      expect(component.onOutViewport).not.toHaveBeenCalled();
    });

    it('should call onOutViewport with offset if element is not in viewport', () => {
      component.scroll(false, 10);
      expect(component.onOutViewport).toHaveBeenCalledWith({offset: 10});
    });
  });
});
