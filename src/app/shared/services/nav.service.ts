import { Injectable, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

// Menu
export interface Menu {
	path?: string;
	title?: string;
	icon?: string;
	type?: string;
	badgeType?: string;
	badgeValue?: string;
	active?: boolean;
	bookmark?: boolean;
	children?: Menu[];
}

@Injectable({
	providedIn: 'root'
})

export class NavService {
	BaseUrl: string = environment.apiUrl + environment.apiVersion;
	public screenWidth: any
	public collapseSidebar: boolean = false
	public fullScreen = false;
	constructor(private router: Router, private http: HttpClient) {
		this.onResize();
		if (this.screenWidth < 991) {
			this.collapseSidebar = true
		}
	}

	// Windows width
	@HostListener('window:resize', ['$event'])
	onResize(event?) {
		this.screenWidth = window.innerWidth;
	}

	MENUITEMS: Menu[] = [
		{
			title: 'Setting',icon: 'file-text', type: 'sub', active: false, children: [
				{ path: '/set/repeatpercentlist', title: 'Repeat Visits %', type: 'link' },
				{ path: '/set/zonelist', title: 'Zone', type: 'link' },
				{ path: '/set/zonehf', title: 'Zone Health Facility', type: 'link' },
				{ path: '/set/activehf', title: 'Active/InActive HF', type: 'link' },
				{ path: '/setting/categorylist', title: 'Category', type: 'link' },
				{ path: '/setting/subcategorylist', title: 'Sub Category', type: 'link' },
				{ path: '/indicator', title: 'Indicator', type: 'link' },
				{ path: '/indicator/viewindicators', title: 'View Indicator', type: 'link' },
				{ path: '/indicator/physicalview', title: 'Indicator Change(PC)', type: 'link' },
				{ path: '/set/specialvisits', title: 'Assign Visits', type: 'link' }
			]
		},
		{
			title: 'Monitoring',icon: 'file-text', type: 'sub', active: false, children: [
				{ path: '/evaluation/list', title: 'Monitoring Data', type: 'link' }
			]
		},
		{
			title: 'UMS',icon: 'user', type: 'sub', active: false, children: [
				{ path: '/ums/userlist', title: 'Users', type: 'link' },
				{ path: '/ums/userupload', title: 'Upload Users', type: 'link' },
			]
		},
	]
	items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
	getContactUs() : any {
		return this.http.get<any>(this.BaseUrl + "ContactFeedback/GetContactUs").toPromise();
	  }

}
