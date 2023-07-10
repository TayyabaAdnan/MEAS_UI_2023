import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hf-active',
  templateUrl: './hf-active.component.html',
  styleUrls: ['./hf-active.component.scss']
})
export class HfActiveComponent implements OnInit {
  submit: boolean = false;
  public event: EventEmitter<any> = new EventEmitter();
  list: any[] = [];
  HFActiveForm: FormGroup;

  constructor(public bsModalRef: BsModalRef, private formBuilder: FormBuilder
    , public loaderService: LoaderService, public _categoryService: CategoryService,
    public toastr: ToastrService) { }

  ngOnInit(): void {
    if (this.list.length > 0) {
      this.CreateFormOnEdit();
    }
  }
  CreateFormOnEdit() {
    console.log(this.list[0]);
    this.HFActiveForm = this.formBuilder.group({
      HfId: [this.list[0].HfId, Validators.required],
      Remarks: [this.list[0].Remarks, Validators.required],
      InActiveTill: [this.list[0].InActiveTill],
      IsActive: [this.list[0].Active]
    });
  }
  save() {
    if (this.HFActiveForm.controls.IsActive.value == false && this.HFActiveForm.controls.InActiveTill.value == "") {
      let InActiveTillControl = this.HFActiveForm.controls.InActiveTill;
      InActiveTillControl.setErrors({ required: true });
    }
    if (this.HFActiveForm.valid) {
      this._categoryService.ToggleActivationHFRemarks(this.HFActiveForm.value).then((res) => {
        if (!res.Error) {
          this.toastr.success(res.Message, "Success");
          this.triggerEvent(res.Data);
          this.bsModalRef.hide();
        } else {
          this.toastr.error(res.Message, "Error");
        }
      }).catch((error) => {
        this.toastr.error(error.message, "Error");
      });
    }
  }
  triggerEvent(data) {
    this.event.emit({ res: data });
    //this.event.emit();
  }
}
