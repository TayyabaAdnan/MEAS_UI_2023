import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DashboardIndicatorService } from 'src/app/shared/services/dashboard-indicator.service';
import { DatePipe } from '@angular/common';
import { LoaderService } from 'src/app/shared/services/loader.service';
import * as Highcharts from 'highcharts';
import { IndicatordetailService } from 'src/app/shared/services/indicatordetail.service';
import * as XLSX from 'xlsx';

//declare var require: any;
// const More = require('highcharts/highcharts-more');
// More(Highcharts);

import Exporting from 'highcharts/modules/exporting';
// Initialize exporting module.
Exporting(Highcharts);
import Data from 'highcharts/modules/data';
// Initialize Data module.
Data(Highcharts);
import ExportData from 'highcharts/modules/export-data';
// Initialize ExportData module.
ExportData(Highcharts);

// const Accessibility = require('highcharts/modules/accessibility');
// Accessibility(Highcharts);


@Component({
  selector: 'app-indicator-detail',
  templateUrl: './indicator-detail.component.html',
  styleUrls: ['./indicator-detail.component.scss']
})
export class IndicatorDetailComponent implements OnInit {
  @ViewChild('charts') public chartEl: ElementRef;
  @ViewChild('electricitycharts') public electricitycharts: ElementRef;
  @ViewChild('waterSupplycharts') public waterSupplycharts: ElementRef;
  @ViewChild('sweragecharts') public sweragecharts: ElementRef;
  @ViewChild('utilitiesAverage') public utilitiesAverage: ElementRef;
  @ViewChild('supplies') public supplies: ElementRef;
  @ViewChild('moPresence') public moPresence: ElementRef;
  @ViewChild('dispenserPosted') public dispenserPosted: ElementRef;
  @ViewChild('lhvPosted') public lhvPosted: ElementRef;
  @ViewChild('otherStaffPresence') public otherStaffPresence: ElementRef;
  @ViewChild('lhvPresence') public lhvPresence: ElementRef;
  @ViewChild('dispenserPresence') public dispenserPresence: ElementRef;
  @ViewChild('htmtPresence') public htmtPresence: ElementRef;
  @ViewChild('medicines') public medicines: ElementRef;
  @ViewChild('equipment') public equipment: ElementRef;

  //Highcharts: typeof Highcharts = Highcharts;
  searchForm: FormGroup;
  Fromdate: string;
  Todate: string;
  DistrictList: any;
  HfTypeList: any[];
  ShiftList: any[];
  selectedHfShifts: any[];
  MoPostedLabels: any = [];
  MOPostedData: any = [];
  MoPostedAverage: any;
  indicatorType: any;
  indicatorTypeValue: string;
  districtName: string;

  //#region MO Presence
  moPresenceOptions: any;
  moDistricts: any;
  moPresnceData: any;
  moLeavesData: any;
  moUnauthorizedLeaves: any;
  moOfficialDutyData: any;
  MoPresenceAverage: any;
  //#endregion

  //#region OtherStaffPostedData
  LHVPostedOptions: any;
  DispenserPostedOptions: any;
  LHVPostedData: any;
  DispenserPostedData: any;
  OtherStaffPostedDistricts: any;
  LHVPostedAverage: any;
  DispenserPostedAverage: any;
  //#endregion

  //#region OtherStaffPresesnceData
  LHVPresenceOptions: any;
  DispenserPresenceOptions: any;
  HTmTPresenceOptions: any;
  OtherStaffPresenceOptions: any;
  LHVPresenceData: any;
  DispenserPresenceData: any;
  HTmTPresenceData: any;
  OtherStaffPresenceData: any;
  OtherStaffPresenceDistricts: any;
  otherStaffPresenceAverage: any;
  lhvPresenceAverage: any;
  dispenserPresenceAverage: any;
  htMtPresenceAverage: any;
  //#endregion


  //#region MO Posted
  myOptions: any;
  //#endregion

  //#region Utilities
  ElectricityOptions: any;
  WaterSupplyOptions: any;
  UtilitiesAverageOptions: any;
  SwerageOptions: any;
  UtilitiesLabels: any = [];
  ElectricityData: any = [];
  SwerageData: any = [];
  UtilitiesAverageData: any = [];
  WaterSupplyData: any = [];
  ElectricityAverage: any;
  UtilitiesAllAverage: any;
  WaterSupplyAverage: any;
  SwerageAverage: any;
  //#endregion

  //#region Supplies
  SuppliesLabel: any = [];
  SuppliesData: any = [];
  SuppliesOptions: any;
  suppliesAverage: any;
  //#endregion

  //#region Medicines
  MedicnesDistricts: any = [];
  MedicinesData: any = [];
  MedicinesOptions: any;
  MedicinesAverage: any;
  //#endregion

  //#region Medicines
  StockOutMedicinesQuestions: any = [];
  StockoutMedicinesData: any = [];
  //#endregion

  //#region Equipment
  EquipmentDistricts: any = [];
  EquipmentFunctionalData: any = [];
  EquipmentNonFunctionalData: any = [];
  EquipmentNonRepairableData: any = [];
  EquipmentOptions: any;
  EquipmentAverage: any;
  //#endregion

  constructor(private fb: FormBuilder,
    private router: Router, private _toastrService: ToastrService, private _dashboardIndicatorService: DashboardIndicatorService,
    public loaderService: LoaderService, private _indicatordetailService: IndicatordetailService) {
    var date = new Date();
    const datepipe: DatePipe = new DatePipe('en-US')
    this.Fromdate = datepipe.transform(new Date(date.getFullYear(), date.getMonth(), 1), 'yyyy-MM-dd');
    this.Todate = datepipe.transform(new Date(date.getFullYear(), date.getMonth() + 1, 0), 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      DistrictCode: ["0"],
      Designation: ["MEA"],
      HfType: ["1"],
      ShiftId: ["1"],
      IndicatorType: ["MOPosted"],
      fromDate: [this.Fromdate],
      toDate: [this.Todate],
      GraphType: ["All"],
      DistrictName: [""]
    });
    this.Initialization();
    this.GetSearchedValue();
  }

  Initialization() {
    this._dashboardIndicatorService.GetDashboardDropdownData().then((res) => {
      if (!res.Error) {
        this.DistrictList = res.List.districts;
        this.HfTypeList = res.List.hfTypes;
        this.ShiftList = res.List.shiftsHfTypes;
        this.selectedHfShifts = this.ShiftList.filter(x => x.HFTypeId == this.searchForm.controls["HfType"].value);
      } else {
        this._toastrService.error(res.Message, "Error");
      }
    }).catch((error) => {
      this._toastrService.error(error.message, "Error");
    });
  }
  GetHfShifts(hfTypeId) {
    this.selectedHfShifts = this.ShiftList.filter(x => x.HFTypeId == hfTypeId && x.ShiftId != 2 && x.ShiftId != 3);
  }
  search() {
    this.GetSearchedValue();
  }
  GetStockOutMedicines(districtName) {
    this.searchForm.patchValue({
      DistrictName: districtName
    });
    this._indicatordetailService.GetStockOutMedicnes(this.searchForm.value).then((res) => {
      if (!res.Error) {
        this.StockOutMedicinesQuestions = res.List.Questions;
        this.StockoutMedicinesData = res.List.StockoutDataList;
        this.ExportList("tblStockOutMedicnes","Stockout_Medicines",districtName);
      } else {
        this._toastrService.error(res.Message, "Error");
      }
    });
  }
  GetSearchedValue(): void {
    this.indicatorType = this.searchForm.controls["IndicatorType"].value;
    if (this.searchForm.controls["DistrictCode"].value == "0") {
      this.districtName = "Punjab";
    } else {
      this.districtName = this.DistrictList.filter(x => x.DistrictCode == this.searchForm.controls["DistrictCode"].value).map(x => x.DistrictName)[0];
    }

    switch (this.indicatorType) {
      case "MOPosted":
        this._indicatordetailService.GetSearchedValue(this.searchForm.value).then((res) => {
          if (!res.Error) {
            this.MoPostedLabels = res.List.Districts;
            this.MOPostedData = res.List.indicatorDetail;
            this.MoPostedAverage = res.List.MoPostedAverage;
            this.CreateChart();

          } else {
            this._toastrService.error(res.Message, "Error");
          }
        });
        break;
      case "MOPresence":
        this._indicatordetailService.GetMOPresenceData(this.searchForm.value).then((res) => {
          if (!res.Error) {
            this.moDistricts = res.List.Districts;
            this.moLeavesData = res.List.leavesData;
            this.moOfficialDutyData = res.List.officalDutyData;
            this.moPresnceData = res.List.PresenceData;
            this.moUnauthorizedLeaves = res.List.unauthorizedLeaves;
            this.MoPresenceAverage = res.List.MoPresenceAverage;
            this.CreateChart();
          } else {
            this._toastrService.error(res.Message, "Error");
          }
        });
        break;
      case "OtherStaffPosted":
        this._indicatordetailService.GEtOtherStaffPostedData(this.searchForm.value).then((res) => {
          if (!res.Error) {
            this.OtherStaffPostedDistricts = res.List.Districts;
            this.LHVPostedData = res.List.LHVPostedData;
            this.DispenserPostedData = res.List.DispenserPostedData;
            this.LHVPostedAverage = res.List.LhvPostedAverage;
            this.DispenserPostedAverage = res.List.DispenserPostedAverage;
            this.CreateChart();

          } else {
            this._toastrService.error(res.Message, "Error");
          }
        });
        break;
      case "OtherStaffPresence":
        this._indicatordetailService.GetOtherStaffPresenceData(this.searchForm.value).then((res) => {
          if (!res.Error) {
            this.OtherStaffPresenceDistricts = res.List.Districts;
            this.LHVPresenceData = res.List.LHVPresenceData;
            this.HTmTPresenceData = res.List.HtMtPresenceData;
            this.DispenserPresenceData = res.List.DispenserPresenceData;
            this.OtherStaffPresenceData = res.List.otherStaffPresenceData;
            this.otherStaffPresenceAverage = res.List.otherStaffPresenceAverage;
            this.htMtPresenceAverage = res.List.htmtPresenceAverage;
            this.dispenserPresenceAverage = res.List.dispenserAverage;
            this.lhvPresenceAverage = res.List.lhvPresenceAverage;
            this.CreateChart();
          } else {
            this._toastrService.error(res.Message, "Error");
          }
        });
        break;
      case "Utilities":
        this._indicatordetailService.GetUtilitiesData(this.searchForm.value).then((res) => {
          if (!res.Error) {
            this.UtilitiesLabels = res.List.Districts;
            this.ElectricityData = res.List.electricityData;
            this.WaterSupplyData = res.List.waterSupplyData;
            this.SwerageData = res.List.swerageData;
            this.UtilitiesAverageData = res.List.average;
            this.ElectricityAverage = res.List.electricityAverage;
            this.SwerageAverage = res.List.swerageAverage;
            this.WaterSupplyAverage = res.List.waterSupplyAverage;
            this.UtilitiesAllAverage = res.List.utilitiesallAverage;
            this.CreateChart();
          } else {
            this._toastrService.error(res.Message, "Error");
          }
        });
        break;
      case "Supplies":
        this._indicatordetailService.GetSuppliesData(this.searchForm.value).then((res) => {
          if (!res.Error) {
            this.SuppliesLabel = res.List.suppliesDistricts;
            this.SuppliesData = res.List.suppliesData;
            this.suppliesAverage = res.List.suppliesAverage;
            this.CreateChart();
          } else {
            this._toastrService.error(res.Message, "Error");
          }
        });
        break;
      case "Medicines":
        this._indicatordetailService.GetMedicinesData(this.searchForm.value).then((res) => {
          if (!res.Error) {
            this.MedicinesData = res.List.medicinesData;
            this.MedicnesDistricts = res.List.medicinesDistricts;
            this.MedicinesAverage = res.List.medicinesAverage;
            this.CreateChart();
          } else {
            this._toastrService.error(res.Message, "Error");
          }
        });
        break;
      case "Equipment":
        this._indicatordetailService.GetEquipmentData(this.searchForm.value).then((res) => {
          if (!res.Error) {
            this.EquipmentFunctionalData = res.List.EquipmentFunctionalData;
            this.EquipmentNonFunctionalData = res.List.EquipmentNonFunctionalData;
            this.EquipmentNonRepairableData = res.List.EquipmentNonRepairableData;
            this.EquipmentDistricts = res.List.EquipmentDistricts;
            this.EquipmentAverage = res.List.EquipmentAverage;
            this.CreateChart();
          } else {
            this._toastrService.error(res.Message, "Error");
          }
        });
        break;

    }
  }

  CreateChart() {
    switch (this.indicatorType) {
      case "MOPosted":
        this.myOptions = {
          chart: {
            type: 'bar'
          },
          //   accessibility: {
          //     description: '',
          // },
          title: {
            text: 'MO Posted'
          },
          xAxis: {
            categories: this.MoPostedLabels,
            //     tickmarkPlacement: 'on',
            // title: {
            //     enabled: false
            // }
          },
          yAxis: {
            min: 0,
            title: {
              text: ''
            },
            stackLabels: {
              style: {
                color: 'black',
                fontWeight: 'bold'
              },
              enabled: true,
              verticalAlign: 'top',
              crop: false,
              overflow: 'none'
            },
            labels: {
              overflow: 'justify'
            }
          },
          legend: {
            reversed: true
          },
          //   legend: {
          //     layout: 'vertical',
          //     align: 'right',
          //     verticalAlign: 'top',
          //     x: -40,
          //     y: 80,
          //     floating: true,
          //     borderWidth: 1,
          //     backgroundColor:
          //         Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
          //     shadow: true
          // },
          credits: {
            enabled: false
          },
          plotOptions: {
            series: {
              stacking: 'normal',
              pointWidth: 15,
              dataLabels: {
                enabled: false
              }
            }
          },
          tooltip: { valueSuffix: '%' },
          layout: 'vertical',
          series: [{
            name: 'MO Posted',
            data: this.MOPostedData,
            type: 'bar'
          }]
        };
        var chart = Highcharts.chart(this.chartEl.nativeElement, this.myOptions);
        chart.redraw();
        break;
      case "MOPresence":
        this.moPresenceOptions = {
          chart: {
            type: 'bar'
          },
          title: {
            text: 'MO Presence'
          },
          xAxis: {
            categories: this.moDistricts,
          },
          yAxis: {
            min: 0,
            title: {
              text: ''
            },
            stackLabels: {
              style: {
                color: 'black',
                fontWeight: 'bold'
              },
              enabled: true,
              // verticalAlign: 'top',
              crop: false,
              overflow: 'none'
            },
            labels: {
              overflow: 'justify'
            }
          },
          legend: {
            reversed: true
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            series: {
              stacking: 'normal',
              pointWidth: 15,
              dataLabels: {
                enabled: false
              }
            }
          },
          tooltip: { valueSuffix: '%' },
          layout: 'vertical',
          series: [{
            name: 'MO Presence',
            data: this.moPresnceData,
            type: 'bar'
          }, {
            name: 'Unauthorized Absence',
            data: this.moUnauthorizedLeaves,
            type: 'bar'
          }, {
            name: 'Official Duties',
            data: this.moOfficialDutyData,
            type: 'bar'
          }, {
            name: 'Leaves',
            data: this.moLeavesData,
            type: 'bar'
          }]
        };
        var chart = Highcharts.chart(this.moPresence.nativeElement, this.moPresenceOptions);
        chart.redraw();
        break;
      case "OtherStaffPosted":
        //#region  LHV
        this.LHVPostedOptions = {
          chart: {
            type: 'bar'
          },
          title: {
            text: 'LHV Posted'
          },
          xAxis: {
            categories: this.OtherStaffPostedDistricts,
          },
          yAxis: {
            min: 0,
            title: {
              text: ''
            },
            stackLabels: {
              style: {
                color: 'black',
                fontWeight: 'bold'
              },
              enabled: true,
              verticalAlign: 'top',
              crop: false,
              overflow: 'none'
            },
            labels: {
              overflow: 'justify'
            }
          },
          legend: {
            reversed: true
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            series: {
              stacking: 'normal',
              pointWidth: 15,
              dataLabels: {
                enabled: false
              }
            }
          },
          tooltip: { valueSuffix: '%' },
          layout: 'vertical',
          series: [{
            name: 'LHV Posted',
            data: this.LHVPostedData,
            type: 'bar'
          }]
        };
        var chart = Highcharts.chart(this.lhvPosted.nativeElement, this.LHVPostedOptions);
        chart.redraw();
        //#endregion
        //#region Dispenser
        this.DispenserPostedOptions = {
          chart: {
            type: 'bar'
          },
          title: {
            text: 'Dispenser Posted'
          },
          xAxis: {
            categories: this.OtherStaffPostedDistricts,
          },
          yAxis: {
            min: 0,
            title: {
              text: ''
            },
            stackLabels: {
              style: {
                color: 'black',
                fontWeight: 'bold'
              },
              enabled: true,
              verticalAlign: 'top',
              crop: false,
              overflow: 'none'
            },
            labels: {
              overflow: 'justify'
            }
          },
          legend: {
            reversed: true
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            series: {
              stacking: 'normal',
              pointWidth: 15,
              dataLabels: {
                enabled: false
              }
            }
          },
          tooltip: { valueSuffix: '%' },
          layout: 'vertical',
          series: [{
            name: 'Dispenser Posted',
            data: this.DispenserPostedData,
            type: 'bar'
          }]
        };
        var chart = Highcharts.chart(this.dispenserPosted.nativeElement, this.DispenserPostedOptions);
        chart.redraw();
        //#endregion
        break;
      case "OtherStaffPresence":
        //#region  LHV
        this.LHVPresenceOptions = {
          chart: {
            type: 'bar'
          },
          title: {
            text: 'LHV'
          },
          xAxis: {
            categories: this.OtherStaffPresenceDistricts,
          },
          yAxis: {
            min: 0,
            title: {
              text: ''
            },
            stackLabels: {
              style: {
                color: 'black',
                fontWeight: 'bold'
              },
              enabled: true,
              verticalAlign: 'top',
              crop: false,
              overflow: 'none'
            },
            labels: {
              overflow: 'justify'
            }
          },
          legend: {
            reversed: true
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            series: {
              stacking: 'normal',
              pointWidth: 15,
              dataLabels: {
                enabled: false
              }
            }
          },
          tooltip: { valueSuffix: '%' },
          layout: 'vertical',
          series: [{
            name: 'LHV ',
            data: this.LHVPresenceData,
            type: 'bar'
          }]
        };
        var chart = Highcharts.chart(this.lhvPresence.nativeElement, this.LHVPresenceOptions);
        chart.redraw();
        //#endregion
        //#region Dispenser
        this.DispenserPresenceOptions = {
          chart: {
            type: 'bar'
          },
          title: {
            text: 'Dispenser'
          },
          xAxis: {
            categories: this.OtherStaffPresenceDistricts,
          },
          yAxis: {
            min: 0,
            title: {
              text: ''
            },
            stackLabels: {
              style: {
                color: 'black',
                fontWeight: 'bold'
              },
              enabled: true,
              verticalAlign: 'top',
              crop: false,
              overflow: 'none'
            },
            labels: {
              overflow: 'justify'
            }
          },
          legend: {
            reversed: true
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            series: {
              stacking: 'normal',
              pointWidth: 15,
              dataLabels: {
                enabled: false
              }
            }
          },
          tooltip: { valueSuffix: '%' },
          layout: 'vertical',
          series: [{
            name: 'Dispenser',
            data: this.DispenserPresenceData,
            type: 'bar'
          }]
        };
        var chart = Highcharts.chart(this.dispenserPresence.nativeElement, this.DispenserPresenceOptions);
        chart.redraw();
        //#endregion
        //#region HT/MT
        this.HTmTPresenceOptions = {
          chart: {
            type: 'bar'
          },
          title: {
            text: 'HT/MT'
          },
          xAxis: {
            categories: this.OtherStaffPresenceDistricts,
          },
          yAxis: {
            min: 0,
            title: {
              text: ''
            },
            stackLabels: {
              style: {
                color: 'black',
                fontWeight: 'bold'
              },
              enabled: true,
              verticalAlign: 'top',
              crop: false,
              overflow: 'none'
            },
            labels: {
              overflow: 'justify'
            }
          },
          legend: {
            reversed: true
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            series: {
              stacking: 'normal',
              pointWidth: 15,
              dataLabels: {
                enabled: false
              }
            }
          },
          tooltip: { valueSuffix: '%' },
          layout: 'vertical',
          series: [{
            name: 'HT / MT',
            data: this.HTmTPresenceData,
            type: 'bar'
          }]
        };
        var chart = Highcharts.chart(this.htmtPresence.nativeElement, this.HTmTPresenceOptions);
        chart.redraw();
        //#endregion
        //#region Other Staff
        this.OtherStaffPresenceOptions = {
          chart: {
            type: 'bar'
          },
          title: {
            text: 'Other Staff Presence'
          },
          xAxis: {
            categories: this.OtherStaffPresenceDistricts,
          },
          yAxis: {
            min: 0,
            title: {
              text: ''
            },
            stackLabels: {
              style: {
                color: 'black',
                fontWeight: 'bold'
              },
              enabled: true,
              verticalAlign: 'top',
              crop: false,
              overflow: 'none'
            },
            labels: {
              overflow: 'justify'
            }
          },
          legend: {
            reversed: true
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            series: {
              stacking: 'normal',
              pointWidth: 15,
              dataLabels: {
                enabled: false
              }
            }
          },
          tooltip: { valueSuffix: '%' },
          layout: 'vertical',
          series: [{
            name: 'Other Staff Presence',
            data: this.OtherStaffPresenceData,
            type: 'bar'
          }]
        };
        var chart = Highcharts.chart(this.otherStaffPresence.nativeElement, this.OtherStaffPresenceOptions);
        chart.redraw();
        //#endregion
        break;
      case "Utilities":
        //#region Electricity
        this.ElectricityOptions = {
          chart: {
            type: 'bar'
          },
          title: {
            text: 'Electricity'
          },
          xAxis: {
            categories: this.UtilitiesLabels,

          },
          yAxis: {
            min: 0,
            title: {
              text: ''
            },
            stackLabels: {
              style: {
                color: 'black',
                fontWeight: 'bold'
              },
              enabled: true,
              verticalAlign: 'top',
              crop: false,
              overflow: 'none'
            },
            labels: {
              overflow: 'justify'
            }
          },
          legend: {
            reversed: true
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            series: {
              stacking: 'normal',
              pointWidth: 15,
              dataLabels: {
                enabled: false
              }
            }
          },
          tooltip: { valueSuffix: '%' },
          layout: 'vertical',
          series: [{
            name: 'Electricity',
            data: this.ElectricityData,
            type: 'bar'
          }]
        };
        var chart = Highcharts.chart(this.electricitycharts.nativeElement, this.ElectricityOptions);
        //#endregion

        //#region  Swerage
        this.SwerageOptions = {
          chart: {
            type: 'bar'
          },
          title: {
            text: 'Swerage System'
          },
          xAxis: {
            categories: this.UtilitiesLabels,

          },
          yAxis: {
            min: 0,
            title: {
              text: ''
            },
            stackLabels: {
              style: {
                color: 'black',
                fontWeight: 'bold'
              },
              enabled: true,
              verticalAlign: 'top',
              crop: false,
              overflow: 'none'
            },
            labels: {
              overflow: 'justify'
            }
          },
          legend: {
            reversed: true
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            series: {
              stacking: 'normal',
              pointWidth: 15,
              dataLabels: {
                enabled: false
              }
            }
          },
          tooltip: { valueSuffix: '%' },
          layout: 'vertical',
          series: [{
            name: 'Swerage System',
            data: this.SwerageData,
            type: 'bar'
          }]
        };
        Highcharts.chart(this.sweragecharts.nativeElement, this.SwerageOptions);
        //#endregion

        //#region  Water Supply
        this.WaterSupplyOptions = {
          chart: {
            type: 'bar'
          },
          title: {
            text: 'Water Supply System'
          },
          xAxis: {
            categories: this.UtilitiesLabels,

          },
          yAxis: {
            min: 0,
            title: {
              text: ''
            },
            stackLabels: {
              style: {
                color: 'black',
                fontWeight: 'bold'
              },
              enabled: true,
              verticalAlign: 'top',
              crop: false,
              overflow: 'none'
            },
            labels: {
              overflow: 'justify'
            }
          },
          legend: {
            reversed: true
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            series: {
              stacking: 'normal',
              pointWidth: 15,
              dataLabels: {
                enabled: false
              }
            }
          },
          tooltip: { valueSuffix: '%' },
          layout: 'vertical',
          series: [{
            name: 'Water Supply System',
            data: this.WaterSupplyData,
            type: 'bar'
          }]
        };
        Highcharts.chart(this.waterSupplycharts.nativeElement, this.WaterSupplyOptions);
        //#endregion

        //#region  Utlities Average
        this.UtilitiesAverageOptions = {
          chart: {
            type: 'bar'
          },
          title: {
            text: 'Utilities Average'
          },
          xAxis: {
            categories: this.UtilitiesLabels,

          },
          yAxis: {
            min: 0,
            title: {
              text: ''
            },
            stackLabels: {
              style: {
                color: 'black',
                fontWeight: 'bold'
              },
              enabled: true,
              verticalAlign: 'top',
              crop: false,
              overflow: 'none'
            },
            labels: {
              overflow: 'justify'
            }
          },
          legend: {
            reversed: true
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            series: {
              stacking: 'normal',
              pointWidth: 15,
              dataLabels: {
                enabled: false
              }
            }
          },
          tooltip: { valueSuffix: '%' },
          layout: 'vertical',
          series: [{
            name: 'Utilities Average',
            data: this.UtilitiesAverageData,
            type: 'bar'
          }]
        };
        Highcharts.chart(this.utilitiesAverage.nativeElement, this.UtilitiesAverageOptions);
        //#endregion
        break;
      case "Supplies":
        this.SuppliesOptions = {
          chart: {
            type: 'bar'
          },
          title: {
            text: 'Supplies Availability'
          },
          xAxis: {
            categories: this.SuppliesLabel,
          },
          yAxis: {
            min: 0,
            title: {
              text: ''
            },
            stackLabels: {
              style: {
                color: 'black',
                fontWeight: 'bold'
              },
              enabled: true,
              verticalAlign: 'top',
              crop: false,
              overflow: 'none'
            },
            labels: {
              overflow: 'justify'
            }
          },
          legend: {
            reversed: true
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            series: {
              stacking: 'normal',
              pointWidth: 15,
              dataLabels: {
                enabled: false
              }
            }
          },
          tooltip: { valueSuffix: '%' },
          layout: 'vertical',
          series: [{
            name: 'Supplies Availability',
            data: this.SuppliesData,
            type: 'bar'
          }]
        };
        var chart = Highcharts.chart(this.supplies.nativeElement, this.SuppliesOptions);
        chart.redraw();
        break;
      case "Medicines":
        let that = this;
        this.MedicinesOptions = {
          chart: {
            type: 'bar'
          },
          title: {
            text: 'Medicine Availability'
          },
          xAxis: {
            categories: this.MedicnesDistricts,
          },
          yAxis: {
            min: 0,
            title: {
              text: ''
            },
            stackLabels: {
              style: {
                color: 'black',
                fontWeight: 'bold'
              },
              enabled: true,
              verticalAlign: 'top',
              crop: false,
              overflow: 'none'
            },
            labels: {
              overflow: 'justify'
            }
          },
          legend: {
            reversed: true
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            series: {
              point: {
                events: {
                  click: function (e) {
                    debugger;
                    var districtName = e.point.category;
                    that.GetStockOutMedicines(districtName);
                    console.log("e : ", e);
                  }
                }
              },
              stacking: 'normal',
              pointWidth: 15,
              dataLabels: {
                enabled: false
              }
            }
          },
          tooltip: { valueSuffix: '%' },
          layout: 'vertical',
          series: [{
            name: 'Medicnines Availability',
            data: this.MedicinesData,
            type: 'bar'
          }]
        };
        var chart = Highcharts.chart(this.medicines.nativeElement, this.MedicinesOptions);
        chart.redraw();
        break;
      case "Equipment":
        this.EquipmentOptions = {
          chart: {
            type: 'bar'
          },
          title: {
            text: 'Equipment Analysis'
          },
          xAxis: {
            categories: this.EquipmentDistricts,
          },
          yAxis: {
            min: 0,
            title: {
              text: ''
            },
            stackLabels: {
              style: {
                color: 'black',
                fontWeight: 'bold'
              },
              enabled: true,
              // verticalAlign: 'top',
              crop: false,
              overflow: 'none'
            },
            labels: {
              overflow: 'justify'
            }
          },
          legend: {
            reversed: true
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            series: {
              stacking: 'normal',
              pointWidth: 15,
              dataLabels: {
                enabled: false
              }
            }
          },
          tooltip: { valueSuffix: '%' },
          layout: 'vertical',
          series: [{
            name: 'Functional',
            data: this.EquipmentFunctionalData,
            type: 'bar'
          }, {
            name: 'Repairable',
            data: this.EquipmentNonFunctionalData,
            type: 'bar'
          }, {
            name: 'Not Repairable',
            data: this.EquipmentNonRepairableData,
            type: 'bar'
          }]
        };
        var chart = Highcharts.chart(this.equipment.nativeElement, this.EquipmentOptions);
        chart.redraw();
        break;
    }
  }

  GetGraphTypeDropDownVisible(indicatorValue) {
    this.indicatorTypeValue = indicatorValue;
  }
  ExportList(tblName,fileType,districtName) {

    var shitname = "";
    var HFTypeName = "";
    var filename = "";
    var date = new Date();
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();

    var currentdate = yyyy + '' + mm + '' + dd;
    var shiftId = this.searchForm.controls["HfType"].value;
    var hfTypeId = this.searchForm.controls["ShiftId"].value;
    var HFT = this.HfTypeList.find(x => x.HfTypeId == hfTypeId);
    HFTypeName = HFT.FaciltyTypeName;

    var shift = this.ShiftList.find(x => x.ShiftId == shiftId);
    shitname = shift.ShiftName;
    shitname = shitname.split(" ", 1)[0];
    filename = currentdate + "_" + fileType+ "_" + HFTypeName + "_" + shitname+ "_" + districtName;

    setTimeout(() => this.ExportExcel(tblName, filename), 1000);
  }
  ExportExcel(tableName, filename) {
    let element = document.getElementById(tableName);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, filename + ".xlsx");
  }
}
