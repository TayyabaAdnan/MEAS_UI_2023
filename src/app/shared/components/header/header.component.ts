
import { Component, OnInit, Output, EventEmitter,Inject } from '@angular/core';
import { NavService, Menu } from '../../services/nav.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DOCUMENT } from '@angular/common'; 
import { User } from 'src/app/shared/Models/User';
import { UserTypeEnum } from '../../../shared/Enums/UserTypeEnum';
var body = document.getElementsByTagName("body")[0];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public menuItems: Menu[];
  public items: Menu[];
  public openNav: boolean = false;
  public right_sidebar: boolean = false;
  public text: string;
  public searchResultEmpty: boolean = false;
  public isOpenMobile: boolean = false;
  public searchResult: boolean = false;
  public isVisible: boolean = true;
  public elem;
  user:any;
  public get UserTypeEnum(): typeof UserTypeEnum {
    return UserTypeEnum;
  }
  @Output() rightSidebarEvent = new EventEmitter<boolean>();

  constructor(public navServices: NavService,private _authService:AuthService,@Inject(DOCUMENT) private document: any) { 
    this.user = _authService.currentUser();
   }

  ngOnInit() {
    debugger;
    console.log(this.user);
    //this.user

    if (this.user == null) 
    {
      this.isVisible = false;
    }
    else
    {
      this.isVisible = true;
    }

  this.elem = document.documentElement;
    this.navServices.items.subscribe(menuItems => {
      this.items = menuItems
    });
  }
  openMobileNav() {
    this.openNav = !this.openNav;
  }
  collapseSidebar() {
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar
  }
  signOut()
  {
    this._authService.SignOut();
  }
  right_side_bar() {
    this.right_sidebar = !this.right_sidebar
    this.rightSidebarEvent.emit(this.right_sidebar)
  }
  toggleFullScreen() {
    this.navServices.fullScreen = !this.navServices.fullScreen;
    if (this.navServices.fullScreen) {
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem.mozRequestFullScreen) {
        /* Firefox */
        this.elem.mozRequestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
        /* IE/Edge */
        this.elem.msRequestFullscreen();
      }
    } else {
      if (!this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }
  checkSearchResultEmpty(items) {
    if (!items.length)
      this.searchResultEmpty = true;
    else
      this.searchResultEmpty = false;
  }
  addFix() {
    this.searchResult = true;
    body.classList.add("offcanvas");
  }

  removeFix() {
    this.searchResult = false;
    body.classList.remove("offcanvas");
    this.text = "";
  }
  searchTerm(term: any) {
    term ? this.addFix() : this.removeFix();
    if (!term) return this.menuItems = [];
    let items = [];
    term = term.toLowerCase();
    this.items.filter(menuItems => {
      if (menuItems.title.toLowerCase().includes(term) && menuItems.type === 'link') {
        items.push(menuItems);
      }
      if (!menuItems.children) return false
      menuItems.children.filter(subItems => {
        if (subItems.title.toLowerCase().includes(term) && subItems.type === 'link') {
          subItems.icon = menuItems.icon
          items.push(subItems);
        }
        if (!subItems.children) return false
        subItems.children.filter(suSubItems => {
          if (suSubItems.title.toLowerCase().includes(term)) {
            suSubItems.icon = menuItems.icon
            items.push(suSubItems);
          }
        })
      })
      this.checkSearchResultEmpty(items)
      this.menuItems = items
    });
  }
}
