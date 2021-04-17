"use strict";

// React without JSX

const e = React.createElement;

class MultiLineChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chartId: this.props.chartId,
            chartData: this.props.data,
        };
    }

    createSeries = (chart, axis, field, name) => {
        // Create series
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "Date";
        series.dataFields.valueY = field;
        //series.dataFields.categoryX = "Date";
        series.strokeWidth = 2;
        series.xAxis = axis;
        series.name = name;
        series.tooltipText = "{name}: [bold]{valueY}[/]";
        //series.fillOpacity = 0.8;

        // For curvey lines
        series.tensionX = 0.8;
        series.tensionY = 1;

        // Multiple bullet options - circle, triangle, rectangle etc.
        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.fill = new am4core.InterfaceColorSet().getFor("background");
        bullet.fillOpacity = 1;
        bullet.strokeWidth = 2;
        bullet.circle.radius = 4;

        return series;
    };

    createChart = (chart) => {
        // Increase contrast by taking evey fouth color
        chart.colors.step = 4;
        //chart.hiddenState.properties.opacity = 0;             // this creates initial fade-in

        // Add title to chart
        var title = chart.titles.create();
        title.text = this.state.chartData["title"];
        title.fontSize = 25;
        title.marginBottom = 15;

        chart.data = this.state.chartData["data"];

        // Create axes - for normal Axis
        // var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        // categoryAxis.dataFields.category = "Date";
        // categoryAxis.renderer.grid.template.location = 0;

        // Create axes - for Date Axis
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        //dateAxis.dataFields.category = "Date";
        dateAxis.renderer.grid.template.location = 0;
        dateAxis.renderer.minGridDistance = 50;
        dateAxis.title.text = this.state.chartData["label"]["domainAxis"];

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        //valueAxis.renderer.line.strokeOpacity = 1;
        //valueAxis.renderer.line.strokeWidth = 2;
        valueAxis.title.text = this.state.chartData["label"]["rangeAxis"];

        //var single_data_item = this.state.chartData["data"][0];
        var series1 = this.createSeries(chart, dateAxis, "Toyota", "Toyota");
        var series2 = this.createSeries(chart, dateAxis, "Ford", "Ford");
        var series3 = this.createSeries(chart, dateAxis, "Honda", "Honda");
        var series4 = this.createSeries(chart, dateAxis, "Renault", "Renault");

        // Add legend
        chart.legend = new am4charts.Legend();

        // Add cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;

        // Add scrollbar
        chart.scrollbarX = new am4core.Scrollbar();

        // Add export menu
        chart.exporting.menu = new am4core.ExportMenu();
    };

    componentDidMount() {
        am4core.useTheme(am4themes_animated);
        const chart = am4core.create(this.state.chartId, am4charts.XYChart);
        this.createChart(chart);
        this.chart = chart;
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }

    render() {
        return e("div", { id: this.state.chartId }, null);
    }
}

function createMultiLineChart(domContainer, chartData) {
    ReactDOM.render(
        e(MultiLineChart, { chartId: "chartdiv", data: chartData }, null),
        domContainer
    );
}
