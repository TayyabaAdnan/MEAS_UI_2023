import { Directive, OnDestroy, OnInit, Input, Renderer2, ElementRef, HostListener } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { ISubscription } from 'rxjs/Subscription';

@Directive({
  selector: '[formControlName][appPhoneMask]',
})
export class PhoneMaskDirective{

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event) {
    this.onInputChange(event.target.value, true);
  }
  
  
  private sub:ISubscription;
  
  constructor(public ngControl: NgControl) { }

  onInputChange(event, backspace) {
    let newVal = event.replace(/\D/g, '');
    if (backspace && newVal.length <= 6) {
      newVal = newVal.substring(0, newVal.length - 1);
    }
    if (newVal.length === 0) {
      newVal = '';
    } else if (newVal.length <= 4) {
      newVal = newVal.replace(/^(\d{0,4})/, '$1');
    } else if (newVal.length <= 11) {
      newVal = newVal.replace(/^(\d{0,4})(\d{0,7})/, '$1-$2');
    } else {
      newVal = newVal.substring(0, 11);
      newVal = newVal.replace(/^(\d{0,4})(\d{0,7})/, '$1-$2');
    }
    this.ngControl.valueAccessor.writeValue(newVal);
  }

}
