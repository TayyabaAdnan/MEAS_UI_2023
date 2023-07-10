import { Component, OnInit } from '@angular/core';
import { NavService } from 'src/app/shared/services/nav.service';
//import { Contact } from 'src/app/shared/Models/DTO/Contact';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  //contact: Contact=new Contact();
  constructor(public _navService: NavService) { }

  ngOnInit() { 
    this.GetContactDetail();
  }

  GetContactDetail(){
    // this._navService.getContactUs().then((res) => {
    //   if (res.Data != null) {
    //     this.contact=res.Data;
    //   }
    // });
  }

}
