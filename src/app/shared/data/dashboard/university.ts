import * as Chartist from 'chartist';
import { ChartEvent, ChartType } from 'ng-chartist';

var primary = localStorage.getItem('primary_color') || '#08319b';
var secondary = localStorage.getItem('secondary_color') || '#1ea6ec';

export interface Chart {
	type: ChartType;
	data: Chartist.IChartistData;
	options?: any;
	responsiveOptions?: any;
	events?: ChartEvent;
}

//Count chart
export var chartType = 'line';
export var chartLabels: Array<any> = ["BARA SAJWAR KHAN", "AMEER KOT", "DUNGA BUNGA", "GANGA"];
export var chartData: Array<any> = [1,2, 4, 6];
export var chartOptions: any = {
	responsive: true,
	animation: false,
	maintainAspectRatio: false,
	scales: {
		xAxes: [{
			display: true,
			gridLines: {
				color: "#fff",
				drawTicks: true,
			}
		}],
		yAxes: [{
			display: true,
		}]
	}
};
export var chartColors: Array<any> = [{
	fill: true,
	backgroundColor: "rgba(68, 102, 242,0.1)",
	borderColor: primary,
	borderWidth: 2.5,
	pointBackgroundColor: primary,
	pointBorderColor: primary,
	lineTension: 0,
}];
export var chartLegend = false;

//Polar Chart
export var PolarOptions: any = {
  animation: false,
  responsive: true,
  maintainAspectRatio: false
};

export var pieChart4: any = {
	chartType: 'PieChart',
	dataTable:[] ,
	options: {
	  title: '',//App Modules Count
	  legend: 'none',
	  width: '100%',
	  height: 400,
	  pieSliceText: 'label',
	  slices: {
		0: { offset: 0.2 },
		2: { offset: 0.3 },
		//14: { offset: 0.4 },
		//15: { offset: 0.5 },
	  },
	  colors: ["#4466f2", "#1ea6ec", "#22af47", "#FEE370", "#ff9f40","#FF5370", "#44E6f2", "#1ea6ec", "#22Ef47", "#007bff", "#fE9f40"],
	  backgroundColor:'transparent'
	},
  };