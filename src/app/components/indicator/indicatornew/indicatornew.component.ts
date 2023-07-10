import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../shared/services/profile.service';
import { IndicatorService } from '../../../shared/services/indicator.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OptionTypeEnum } from '../../../shared/Enums/OptionTypeEnum';

@Component({
  selector: 'app-indicatornew',
  templateUrl: './indicatornew.component.html',
  styleUrls: ['./indicatornew.component.scss']
})
export class IndicatornewComponent implements OnInit {

  reorderable: boolean = true;
  submit: boolean = false;
  HealthFacilities: any = [];
  HfFiltered: any = [];
  ApplicationTypes: any = [];
  Modules: any = [];
  ModulesSelected: any = [];
  Shifts: any;
  HFShifts: any;
  HFShiftsFiltered: any = [];
  HFTypeList: any;
  HFTypeListFiltered: any = [];
  Categories: any;
  CategoriesSelected: any;
  SubCategories: any;
  SubCategoriesFiltered: any = [];
  OptionTypes: any;
  indicatorForm: FormGroup;
  indicators: any = [];
  indicatorsFiltered: any = [];
  IndicatorMode: string = "Add Indicator";
  FormIndicatorOptions: FormArray;
  IndicatorQuestions: FormArray;
  SubIndicators: FormArray;
  FormSubIndicator: FormArray;
  IndicatorOptions: any = [];
  indicatorSelected: boolean = false;
  indicatorId: number = 0;
  indicator: any;
  OptionInputTypes: any;
  applicationTypeId: number;
  questionType: any = "";
  parentShifts: any;
  parentHfTypes: any;
  constructor(public formBuilder: FormBuilder, public loaderService: LoaderService,
    private _profileService: ProfileService, private toastr: ToastrService,
    private _indicatorService: IndicatorService, private route: ActivatedRoute, private router: Router) { }

  public get OptionTypeEnum(): typeof OptionTypeEnum {
    return OptionTypeEnum;
  }
  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('indicatorId');
    this.submit = false;
    this.CreateFormOnAdd();
    this.GetAllDropDowns();
    if (id) {
      this.IndicatorMode = 'Edit Indicator';
      this.indicatorId = parseInt(id);
      this._indicatorService.GetIndicatorById(Number(this.indicatorId)).then(res => {
        if (!res.Error) {
          this.indicator = res.Data;
          this.questionType = this.indicator.QuestionType;
          // this.CreateFormOnEdit();
          if (this.indicator.FormIndicatorOptions.length > 0) {
            this.indicator.FormIndicatorOptions.forEach(obj => {
              this.PushOptions(obj);
            });
          }
          if (this.indicator.ParentIndicatorId > 0) {
            setTimeout(() => {
              this.GetDropDownsDataOfIndicator(this.indicator.ParentIndicatorId);
            }, 3000);
          }
        } else {
          this.toastr.error(res.Message, "Error");
        }
      });
    }
  }
  CreateFormOnAdd() {
    this.indicatorForm = this.formBuilder.group({
      IndicatorId: [0],
      CategoryId: ['', [Validators.required]],
      ParentIndicatorId: [''],
      SubCategoryId: [''],

      // Question: ['', Validators.required],
      QuestionType: ['', Validators.required],
      FormType: [''],
      // ShowInCase: [''],
      // ShowRemarksInCase: [''],
      // IsRemarkShow: [false],
      // IsRemarksMandatory: [false],
      // IsActive: [true],
      // Hf: [''],
      //InputTypeId: [''],
      // IsOptionTotal: [false],
      // IsOptionCalculation: [false],
      // IsOptionTagged: [false],
      // IsOptionEditable: [false],
      // IsRequired:[false],
      // IsCalculation:[false],
      // DefaultValue: [''],
      ApplicationTypeId: ['', [Validators.required]],
      ModuleId: ['', [Validators.required]],
      FormIndicatorOptions: this.formBuilder.array([]),
      IndicatorQuestions: this.formBuilder.array([]),
      SubIndicators: this.formBuilder.array([])
    });
  }
  // CreateFormOnEdit() {
  //   if (this.indicator.ParentIndicatorId == null || this.indicator.ParentIndicatorId == 0)
  //     this.indicator.ParentIndicatorId = "";
  //   if (this.indicator.SubCategoryId == null || this.indicator.SubCategoryId == 0)
  //     this.indicator.SubCategoryId = "";
  //   if (this.indicator.ShowRemarksInCase == null || this.indicator.ShowRemarksInCase == 0)
  //     this.indicator.ShowRemarksInCase = "";
  //   if (this.indicator.ShowInCase == null || this.indicator.ShowInCase == 0)
  //     this.indicator.ShowInCase = "";
  //   this.indicatorForm = this.formBuilder.group({
  //     IndicatorId: [this.indicator.IndicatorId],
  //     CategoryId: [this.indicator.CategoryId, [Validators.required]],
  //     ParentIndicatorId: [this.indicator.ParentIndicatorId],
  //     SequenceNo: [this.indicator.SequenceNo, [Validators.required]],
  //     SubCategoryId: [this.indicator.SubCategoryId],
  //     HfTypes: [this.indicator.HfTypes, [Validators.required]],
  //     Shifts: [this.indicator.Shifts, [Validators.required]],
  //     Question: [this.indicator.Question, Validators.required],
  //     QuestionType: [this.indicator.QuestionType, Validators.required],
  //     FormType: [this.indicator.FormType],
  //     ShowInCase: [this.indicator.ShowInCase],
  //     ShowRemarksInCase: [this.indicator.ShowRemarksInCase],
  //     IsRemarkShow: [this.indicator.IsRemarkShow],
  //     IsRemarksMandatory: [this.indicator.IsRemarksMandatory],
  //     IsActive: [this.indicator.IsActive],
  //     Hf: [this.indicator.Hf],
  //     InputTypeId:[this.indicator.InputTypeId],
  //     IsOptionTotal: [this.indicator.IsOptionTotal],
  //     IsOptionCalculation: [this.indicator.IsOptionCalculation],
  //     IsOptionTagged: [this.indicator.IsOptionTagged],
  //     IsOptionEditable: [this.indicator.IsOptionEditable],
  //     DefaultValue: [this.indicator.DefaultValue],
  //     ApplicationTypeId: [this.indicator.ApplicationTypeId, [Validators.required]],
  //     ModuleId: [this.indicator.ModuleId, [Validators.required]],
  //     FormIndicatorOptions: this.formBuilder.array([])
  //   });
  // }
  createOption() {
    return this.formBuilder.group({
      IndicatorOptionName: ['', Validators.required],
      IndicatorId: [''],
      OptionType: [''],
      IsOptionTotal: [false],
      IsOptionCalculation: [false],
      IsOptionTagged: [false],
      IsOptionEditable: [false],
      ShowRemarksIfSelect: [false],
      ShowSubIndicatorIfSelect: [false],
      DefaultValue: [''],
      IsActive: [true],
      InputTypeId: ['']
    });
  }
  addOption(): void {
    this.FormIndicatorOptions = this.indicatorForm.get('FormIndicatorOptions') as FormArray;
    this.FormIndicatorOptions.push(this.createOption());
  }
  removeOption(i) {
    this.FormIndicatorOptions = this.indicatorForm.get('FormIndicatorOptions') as FormArray;
    this.FormIndicatorOptions.removeAt(i)
  }
  PushOptions(attributeObj) {
    this.FormIndicatorOptions = this.indicatorForm.get('FormIndicatorOptions') as FormArray;
    this.FormIndicatorOptions.push(this.formBuilder.group({
      OptionIndicatorId: [attributeObj.OptionIndicatorId],
      IndicatorOptionName: [attributeObj.IndicatorOptionName, Validators.required],
      IndicatorId: [attributeObj.IndicatorId],
      OptionType: [attributeObj.OptionType],
      IsOptionTotal: [attributeObj.IsOptionTotal],
      IsOptionCalculation: [attributeObj.IsOptionCalculation],
      IsOptionTagged: [attributeObj.IsOptionTagged],
      IsOptionEditable: [attributeObj.IsOptionEditable],
      ShowRemarksIfSelect: [attributeObj.ShowRemarksIfSelect],
      ShowSubIndicatorIfSelect: [attributeObj.ShowSubIndicatorIfSelect],
      DefaultValue: [attributeObj.DefaultValue],
      IsActive: [attributeObj.IsActive],
      InputTypeId: [attributeObj.InputTypeId]
    }));
  }
  save() {
    this.submit = true;
    if (this.indicatorForm.valid) {
      this._indicatorService.AddAllIndicator(this.indicatorForm.value).then((res) => {
        if (!res.Error) {
          this.submit = false;
          this.toastr.success(res.Message, "Success");
          this.router.navigate(['/indicator']);
        } else {
          this.submit = false;
          this.toastr.error(res.Message, "Error");
        }
      }).catch((error) => {
        this.submit = false;
        this.toastr.error(error.message, "Error");
      });
    }
  }

  //#region Add Questions
  addQuestion() {
    this.IndicatorQuestions = this.indicatorForm.get('IndicatorQuestions') as FormArray;
    this.IndicatorQuestions.push(this.createQuestion());
  }
  createQuestion() {
    if (this.indicatorSelected == true) {
      return this.formBuilder.group({
        Question: ['', Validators.required],
        Shifts: [this.parentShifts, [Validators.required]],
        SequenceNo: [, [Validators.required]],
        IsOptionTotal: [false],
        IsOptionCalculation: [false],
        IsOptionTagged: [false],
        IsOptionEditable: [false],
        IsRequired: [false],
        IsCalculation: [false],
        IsRemarkShow: [false],
        IsRemarksMandatory: [false],
        IsActive: [true],
        InputTypeId: [''],
        DefaultValue: [''],
        HfTypes: [this.parentHfTypes, [Validators.required]],
        Hf: [''],
        ShowInCase: [''],
      ShowRemarksInCase: [''],
      });
    } else {
      return this.formBuilder.group({
        Question: ['', Validators.required],
        Shifts: ['', [Validators.required]],
        SequenceNo: [, [Validators.required]],
        IsOptionTotal: [false],
        IsOptionCalculation: [false],
        IsOptionTagged: [false],
        IsOptionEditable: [false],
        IsRequired: [false],
        IsCalculation: [false],
        IsRemarkShow: [false],
        IsRemarksMandatory: [false],
        IsActive: [true],
        InputTypeId: [''],
        DefaultValue: [''],
        HfTypes: ['', [Validators.required]],
        Hf: [''],
        ShowInCase: [''],
      ShowRemarksInCase: [''],
      });
    }
  }
  removeQuestion(i) {
    this.IndicatorQuestions = this.indicatorForm.get('IndicatorQuestions') as FormArray;
    this.IndicatorQuestions.removeAt(i)
  }
  //#endregion

  //#region Add Sub Indicators
  addSubIndicators() {
    this.SubIndicators = this.indicatorForm.get('SubIndicators') as FormArray;
    this.SubIndicators.push(this.createSubIndicators());
  }
  createSubIndicators() {
    return this.formBuilder.group({
      Question: ['', Validators.required],
      SequenceNo: [, [Validators.required]],
      QuestionType: ['', Validators.required],
      InputTypeId: [''],
      IsOptionTotal: [false],
      IsOptionCalculation: [false],
      IsOptionTagged: [false],
      IsOptionEditable: [false],
      DefaultValue: [''],
      IsRequired: [false],
      IsCalculation: [false],
    });
  }
  removeSubIndicators(i) {
    this.SubIndicators = this.indicatorForm.get('SubIndicators') as FormArray;
    this.SubIndicators.removeAt(i)
  }
  //#endregion


  //#region DropDown Functions
  GetDropDownsDataOfIndicator(selectedValue) {
    this.IndicatorOptions = [];
    this.HFTypeListFiltered = [];
    this.SubCategoriesFiltered = [];
    this.indicatorSelected = false;
    let subCat = "";
    if (selectedValue > 0) {
      this.indicatorSelected = true;
      var indicator = this.indicators.filter(x => x.IndicatorId == selectedValue);
      this.HFTypeListFiltered = this.HFTypeList.filter(x => x.CategoryId == indicator[0].CategoryId 
          && indicator[0].HFTypes.includes(x.FacilityTypeId))
      this.HFShiftsFiltered = this.Shifts.filter(x => indicator[0].Shifts.includes(x.ShiftId))
      this.SubCategoriesFiltered = this.SubCategories.filter(x => x.CategoryId == indicator[0].CategoryId);
      this.IndicatorOptions = indicator[0].Options;
      this.indicatorForm.controls.CategoryId.setValue(indicator[0].CategoryId);
      if (indicator[0].SubCategoryId > 0)
        subCat = indicator[0].SubCategoryId
      this.indicatorForm.controls.SubCategoryId.setValue(subCat);
      this.parentShifts = indicator[0].Shifts;
      this.parentHfTypes=indicator[0].HFTypes;
      if (this.indicatorForm.get('IndicatorQuestions')['controls']?.length > 0) {
        this.indicatorForm.get('IndicatorQuestions')['controls'].forEach(element => {
          element.controls.Shifts.setValue(indicator[0].Shifts);
        });
      }
      if (this.indicatorForm.get('IndicatorQuestions')['controls']?.length > 0) {
        this.indicatorForm.get('IndicatorQuestions')['controls'].forEach(element => {
          element.controls.HfTypes.setValue(indicator[0].HFTypes);
        });
      }
    }
    else {
      this.HFTypeListFiltered = [];//this.HFTypeList;
      this.SubCategoriesFiltered = [];// this.SubCategories.filter(x => x.CategoryId == indicator[0].CategoryId);
      this.IndicatorOptions = [];// indicator[0].Options;
      this.indicatorForm.controls.CategoryId.setValue('');
      this.indicatorForm.controls.SubCategoryId.setValue('');
      if (this.indicatorForm.get('IndicatorQuestions')['controls']?.length > 0) {
        this.indicatorForm.get('IndicatorQuestions')['controls'].forEach(element => {
          element.controls.Shifts.setValue('');
        });
      }
      //this.indicatorForm.controls.Shifts.setValue('');
      this.indicatorForm.controls.HfTypes.setValue('');
    }
  }
  GetAllDropDowns() {
    this._profileService.GetIndicatorDropDownData().then((res) => {
      if (!res.Error) {
        this.HFTypeList = res.List.HealthFacilityType;
        this.Shifts = res.List.Shifts;
        this.HFShiftsFiltered = res.List.Shifts;
        this.Categories = res.List.categories;
        this.SubCategories = res.List.subCategories;
        this.OptionTypes = res.List.optionType;
        this.indicators = res.List.indicators;
        this.Modules = res.List.modules;
        this.ApplicationTypes = res.List.applicatioTypes;
        this.HealthFacilities = res.List.healthFacilities;
        this.OptionInputTypes = res.List.inputTypes;
        if (this.indicatorId > 0) {
          this.applicationTypeId = this.indicator.ApplicationTypeId;
          let hfTypeName = this.HealthFacilities.filter(x => this.indicator.Hf.includes(x.HfId)).map(function (a) { return a.HfType });
          this.HfFiltered = this.HealthFacilities.filter(x => hfTypeName.includes(x.HfType));
          this.ModulesSelected = this.Modules.filter(x => x.ApplicationTypeId == this.indicator.ApplicationTypeId);
          this.CategoriesSelected = this.Categories.filter(x => x.ModuleId == this.indicator.ModuleId);
          this.indicatorsFiltered = this.indicators.filter(x => x.CategoryId == this.indicator.CategoryId);
          this.HFTypeListFiltered = this.HFTypeList.filter(x => x.CategoryId == this.indicator.CategoryId);
          this.SubCategoriesFiltered = this.SubCategories.filter(x => x.CategoryId == this.indicator.CategoryId);
        }
      } else {
        this.toastr.error(res.Message, "Error");
      }
    }).catch((error) => {
      this.toastr.error(error.message, "Error");
    });
  }
  GetDropDowns(selectedValue) {
    this.HFTypeListFiltered = [];
    this.SubCategoriesFiltered = [];
    this.indicatorsFiltered = [];
    if (selectedValue > 0) {
      this.HFTypeListFiltered = this.HFTypeList.filter(x => x.CategoryId == selectedValue);
      this.SubCategoriesFiltered = this.SubCategories.filter(x => x.CategoryId == selectedValue);
      this.indicatorsFiltered = this.indicators.filter(x => x.CategoryId == selectedValue);
    }
  }
  GetModules(selectedValue) {
    this.applicationTypeId = selectedValue;
    this.ModulesSelected = [];
    this.CategoriesSelected = [];
    this.indicatorsFiltered = [];
    this.HFTypeListFiltered = [];
    if (selectedValue > 0) {
      this.ModulesSelected = this.Modules.filter(x => x.ApplicationTypeId == selectedValue);
    }
  }
  GetCategories(selectedValue) {
    this.CategoriesSelected = [];
    this.indicatorsFiltered = [];
    this.HFTypeListFiltered = [];
    if (selectedValue > 0) {
      this.CategoriesSelected = this.Categories.filter(x => x.ModuleId == selectedValue);
    }
  }
  GetSubIndicators(selectedValue) {
    this.indicatorsFiltered = [];
    if (selectedValue > 0) {
      this.indicatorsFiltered = this.indicators.filter(x => x.SubCategoryId == selectedValue);
    }
    else {
      this.indicatorsFiltered = this.indicators.filter(x => x.CategoryId == this.indicatorForm.controls['CategoryId'].value);
    }
  }
  GetHF(selectedValue) {
    this.HfFiltered = [];
    if (this.applicationTypeId == 3) {
      var hfTypeName = selectedValue.map(function (a) { return a.FaciltyTypeName }) as Array<any>;
      this.HfFiltered = this.HealthFacilities.filter(x => hfTypeName.includes(x.HfType));
    }
  }
  GetHFF(selectedValue,index) {
    this.HfFiltered = [];
    if (this.applicationTypeId == 3) {
      var hfTypeName = selectedValue.map(function (a) { return a.FaciltyTypeName }) as Array<any>;
      this.HfFiltered = this.HealthFacilities.filter(x => hfTypeName.includes(x.HfType));
    }
  }
  QuestionTypeChange(selectedValue) {
    this.questionType = selectedValue;
  }
  //#endregion
}
