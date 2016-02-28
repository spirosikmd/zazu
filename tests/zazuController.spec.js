require('angular-mocks');

import zazu from '../src/zazu';
import {ZazuController} from '../src/controllers/ZazuController';

describe('ZazuController', () => {
  let $controller;
  let $scope;
  let controller;
  let ZazuService;

  beforeEach(angular.mock.module(zazu));

  beforeEach(inject((_$controller_, _$rootScope_, _ZazuService_) => {
    $controller = _$controller_;
    $scope = _$rootScope_.$new();
    ZazuService = _ZazuService_;
  }));

  beforeEach(() => {
    controller = $controller(ZazuController, {$scope: $scope});
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
