import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UserService } from 'src/app/shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  registerForm: FormGroup;
  /** Component Variables */
  user: any;
  currentUser: any;
  submit: boolean;
  divisions: Location[];
  districts: Location[];
  tehsils: Location[];
  zones: Location[];
  UserMode: string = 'User Register';
  userId: string;
  roleName: string;
  roles:any;
  userTypes:any;
  regions:any;
  healthFacilities:any;
  allzones:any;
  //public phoneMask = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  
  constructor(public formBuilder: FormBuilder, public _useService: UserService, 
    private toastr: ToastrService,
    private route: ActivatedRoute, private router: Router, 
    public _authService: AuthService, public loaderService: LoaderService,
    public _profileService:ProfileService) {

    this.currentUser = this._authService.currentUser();
    if (this.currentUser != null) {
      this.roleName = this.currentUser.UserRole;
    }
  }

  // public get UserTypeEnum(): typeof UserTypeEnum {
  //   return UserTypeEnum;
  // }

  ngOnInit() {

    let id = this.route.snapshot.paramMap.get('userId');
    this.submit = false;
    this.userId = id;

    this.CreateFormOnAdd();
    this.GetHealthFacilities();
    this.GetRoles();
    this.GetReigon();
    this.GetUserTypes();
    if (this.userId) {
      this.UserMode = 'Edit User';
      this._useService.getByUserId(Number(this.userId)).then(res => {
        if (!res.Error) {     
          setTimeout(() => {
            this.user = res.Data;
            this.GetDDLSelected();
            this.CreateFormOnEdit();
          }, 3000);
           //this.registerForm.patchValue(res.Data);
        } else {
          this.toastr.error(res.Message, "Error");
        }
      })
    } 
  }
  CreateFormOnAdd() {
    this.registerForm = this.formBuilder.group({
      UserId: [0],
      FullName: ['', [Validators.required]],
      ContactNo: ['', [Validators.required, Validators.maxLength(12), Validators.minLength(11)]],
      Username: ['', [Validators.required]],
      //Password: ['', [Validators.required]],
      CNIC: ['', [Validators.pattern('[0-9]+'), Validators.maxLength(13), Validators.required, Validators.minLength(13)]],
      RoleId: ['', [Validators.required]],
      IsActive: [false],
      DivsionId: [this.currentUser?.divsionId],
      DistrictId: [this.currentUser?.districtId],
      TehsilId: [this.currentUser?.tehsilId],
      ZoneId: [this.currentUser?.ucId],
      Email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      RegionId:['',Validators.required],
      UserTypeId:['',Validators.required]
    });
  }
  CreateFormOnEdit() {
    this.registerForm = this.formBuilder.group({
      UserId: [this.user.UserId],
      FullName: [this.user.FullName, [Validators.required]],
      ContactNo: [this.user.ContactNo, [Validators.required, Validators.maxLength(12), Validators.minLength(11)]],
      Username: [this.user.Username, [Validators.required]],
     // Password: [this.user.Password, [Validators.required]],
      CNIC: [this.user.CNIC, [Validators.pattern('[0-9]+'), Validators.maxLength(15), Validators.required, Validators.minLength(13)]],
      RoleId: [this.user.RoleId, [Validators.required]],
      IsActive: [this.user.IsActive],
      DivsionId: [this.user.DivsionId],
      DistrictId: [this.user.DistrictId],
      TehsilId: [this.user.TehsilId],
      ZoneId: [this.user.ZoneId],
      Email: [this.user.Email, [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      RegionId:[this.user.RegionId,Validators.required],
      UserTypeId:[this.user.UserTypeId,Validators.required]
    });
  }
  GetDDLSelected() {
    if(this.user.DivsionId != null && this.user.DivsionId != '')
    {
      this.districts = this.healthFacilities.filter(x => x.lvl == "District" && x.DivisionCode == this.user.DivsionId);
    }
    if(this.user.DistrictId != null && this.user.DistrictId != '')
    {
      this.tehsils = this.healthFacilities.filter(x => x.lvl == "Tehsil" && x.DistrictCode == this.user.DistrictId);
    }
    if(this.user.TehsilId != null && this.user.TehsilId != '')
    {
      this.zones = this.allzones.filter(x => x.TehsilCode == this.user.TehsilId);
    }
  }
   GetRoles() {
    this._profileService.GetRoles().then((res) => {
      if (!res.Error) {
        this.roles = res.List;
      } else {
        this.toastr.error(res.message, "Error");
      }
    }).catch((error) => {
      this.toastr.error(error.Message, "Error");
    });
  }
  GetUserTypes() {
    this._profileService.GetUserTypes().then((res) => {
      if (!res.Error) {
        this.userTypes = res.List;
      } else {
        this.toastr.error(res.message, "Error");
      }
    }).catch((error) => {
      this.toastr.error(error.Message, "Error");
    });
  }
  GetReigon() {
    this._profileService.GetRegions().then((res) => {
      if (!res.Error) {
        this.regions = res.List;
      } else {
        this.toastr.error(res.message, "Error");
      }
    }).catch((error) => {
      this.toastr.error(error.Message, "Error");
    });
  }
   GetHealthFacilities() {
    this._profileService.GetHealthFacilities().then((res) => {
      if (!res.Error) {
        this.healthFacilities = res.List.HealthFacilities;
        this.allzones = res.List.zones;
        this.divisions= this.healthFacilities.filter(x => x.lvl == "Division");
      } else {
        this.toastr.error(res.message, "Error");
      }
    }).catch((error) => {
      this.toastr.error(error.Message, "Error");
    });
  }
  public GetDDTU(id: string, type: string)
  {
   switch(type){
     case "District":
       this.districts = this.healthFacilities.filter(x => x.lvl == "District" && x.DivisionCode == id);
       break;
       case "Tehsil":
       this.tehsils = this.healthFacilities.filter(x => x.lvl == "Tehsil" && x.DistrictCode == id);
       break;
       case "Zone":
       this.zones = this.allzones.filter(x => x.TehsilCode == id);
       break;
   }
  }
  public save() {
    debugger;
    this.submit = true;
    // if (this.optionValue == "ProvisionalUser" && !this.registerForm.value.provinceId) {
    //   const provinceControl = this.registerForm.controls.provinceId;
    //   provinceControl.setErrors({ required: true });
    // }
    // if (this.optionValue == "DivisionalUser" && !this.registerForm.value.divsionId) {
    //   const divisionControl = this.registerForm.controls.divsionId;
    //   divisionControl.setErrors({ required: true });
    // }
    // if (this.optionValue == "DistrictUser" && !this.registerForm.value.districtId) {
    //   const districtControl = this.registerForm.controls.districtId;
    //   districtControl.setErrors({ required: true });
    // }
    // if (this.optionValue == "TehsilUser" && !this.registerForm.value.tehsilId) {
    //   const tehsilControl = this.registerForm.controls.tehsilId;
    //   tehsilControl.setErrors({ required: true });
    // }
    // if (this.optionValue == "UnionCouncilUser" && !this.registerForm.value.ucId) {
    //   const UnionCouncilControl = this.registerForm.controls.ucId;
    //   UnionCouncilControl.setErrors({ required: true });
    // }
    if (this.registerForm.valid) {
      this._useService.RegisterUser(this.registerForm.value).then((res) => {
        this.submit = false;
        this.router.navigate(["/ums/userlist"]);
      }).catch((error) => {
        this.toastr.error(error.Message, "Error");
      });
    }
  }
 
}
