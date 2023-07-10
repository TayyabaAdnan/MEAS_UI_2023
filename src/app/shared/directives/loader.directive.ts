import { style } from '@angular/animations';
import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[Loader]'
})
export class LoaderDirective {
  @Input('Loader') Loader: boolean; 
  constructor(private el: ElementRef, private renderer: Renderer2) { }
  ngOnChanges() {  
    if (this.Loader) {  
     const parent = this.renderer.parentNode(this.el.nativeElement);  
     const div = this.renderer.createElement('div');  
     this.renderer.addClass(div, 'divshow');  
     // tslint:disable-next-line:label-position  
     const ispan: Element = this.renderer.createElement('i');  
     this.renderer.addClass(ispan, 'fa');  
     this.renderer.addClass(ispan, 'fa-spinner');  
     this.renderer.addClass(ispan, 'fa-spin');  
     this.renderer.addClass(ispan, 'center');  
     this.renderer.addClass(ispan, 'loder-icon');  
     this.el.nativeElement.parentElement.classList.add('positionReletive');  
     const finalhtml = this.renderer.appendChild(div, ispan);  
     this.renderer.appendChild(this.el.nativeElement, div);  
 } else {  
        Array.from(this.el.nativeElement.children).forEach(child => {  
         if (child['className'] === 'divshow') {  
                         this.renderer.removeChild(this.el.nativeElement, child);  
         }  
     });  
 }  
}  
} 