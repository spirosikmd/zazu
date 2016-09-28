import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {Zazu} from '../../models/zazu.model';
import {ZazuItemComponent} from './zazu-item.component';
import {FormsModule} from '@angular/forms';
import {FocusDirective} from '../../directives/focus.directive';

describe('ZazuItemComponent', () => {
  let comp: ZazuItemComponent;
  let fixture: ComponentFixture<ZazuItemComponent>;
  let zazuEl: DebugElement;
  let zazu: Zazu;
  let isSelected: boolean;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ZazuItemComponent, FocusDirective],
    });
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(ZazuItemComponent);
    comp = fixture.componentInstance;
    zazuEl = fixture.debugElement.query(By.css('.zazu'));

    zazu = new Zazu();
    zazu.id = 'zazu-id';
    zazu.label = 'zazu-label';
    zazu.checked = true;
    isSelected = true;

    comp.zazu = zazu;
    comp.isSelected = isSelected;

    fixture.detectChanges();
  });

  it('should call the onUpdateLabel binding when zazu label is updated', () => {
    let updateLabelData: {id: string, label: string, keyCode: number};
    comp.onUpdateLabel.subscribe((data) => {
      updateLabelData.id = data.id;
      updateLabelData.label = data.label;
      updateLabelData.keyCode = data.keyCode;
    });
  });
  //
  // describe('scroll', () => {
  //   it('should not call onOutViewport if element is in viewport', () => {
  //     component.scroll(true, 10);
  //     expect(component.onOutViewport).not.toHaveBeenCalled();
  //   });
  //
  //   it('should call onOutViewport with offset if element is not in viewport', () => {
  //     component.scroll(false, 10);
  //     expect(component.onOutViewport).toHaveBeenCalledWith({offset: 10});
  //   });
  // });
});
