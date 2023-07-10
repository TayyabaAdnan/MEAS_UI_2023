// Monthly Chart
export var MonthlyReport: any = {
  chartType: 'AreaChart',
  dataTable: [
    ['','EPI Store Monitoring', 'EPI Fixed Site Monitoring', 'EPI Outreach Vaccination Session', 'Clusters', 'Zero Dose Validation'],
    ['Jan', 100, 400, 2000, 400,500],
    ['Feb', 500, 700, 530, 800,800],
    ['March', 2000, 1000, 620, 120,782],
    ['April', 120, 201, 2501, 540,5623],
    ['May', 120, 201, 7501, 540,3000],
    ['Jun', 120, 201, 4501, 540,4500],
    ['July', 120, 201, 3601, 540,4523],
    ['Aug', 120, 201, 2801, 540,1235],
    ['Sept', 120, 201, 2101, 540,7551],
    ['Oct', 120, 201, 201, 785,1235],
    ['Nov', 120, 201, 2001, 152,1235],
    ['Dec', 120, 201, 2401, 475,1200]
  ],
  options: {
    title: 'Monthly Report',
    hAxis: { title: 'Month', titleTextStyle: { color: '#333' } },
    vAxis: { minValue: 0 },
    width: '100%',
    height: 400,
    colors: ["#4466f2", "#1ea6ec", "#22af47", "#cc3333","#e2ac7c"],
    backgroundColor:'transparent'
  },
};

// WeeklyChart
// for(var i =0; i< 8;i++)
// {
//   for(var j=0;j < 6;j++){
// ModuleData[i][j]=
//   }
// }
//var appModules : string[]=["App Modules", "EPI Store Monitoring", "EPI Fixed Site Monitoring", "EPI Outreach Vaccination Session","Clusters","Zero Dose Validation"]
export var weeklyReport: any = {
  chartType: 'ColumnChart',
  dataTable: [],
  options: {
    chart: {
      title: "Monthly Report",
      //subtitle: "Sales, Expenses, and Profit: 2014-2017"
    },
    bars: "vertical",
    vAxis: {
      format: "decimal"
    },
    height: 400,
    width: '100%',
    colors: ["#4466f2", "#1ea6ec", "#22af47","#85a5db","#dfa5db"],
    backgroundColor:'transparent'
  },
};

export var zeroDose: any = {
  chartType: 'ColumnChart',
  dataTable: [],
  options: {
    chart: {
      title: "SIA wise Report",
    },
    bars: "vertical",
    vAxis: {
      format: "decimal"
    },
    height: 400,
    width: '100%',
    colors: ["#4466f2", "#6E1C1C", "#22af47"],
    backgroundColor:'transparent'
  },
};


export var EOAInPractice: any = {
  chartType: 'ColumnChart',
  dataTable: [],
  options: {
    chart: {
      title: "Vaccinator Presence",
      //subtitle: "Sales, Expenses, and Profit: 2014-2017"
    },
    bars: "vertical",
    vAxis: {
      format: "decimal"
    },
    responsive:true,
    height: 400,
    width: '100%',
    colors: ["#4466f2", "#1ea6ec", "#22af47","#85a5db","#dfa5db"],
    backgroundColor:'transparent'
  },
};