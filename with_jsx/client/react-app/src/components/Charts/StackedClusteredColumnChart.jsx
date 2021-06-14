import React, { Component } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

class StackedClusteredColumnChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartId: this.props.chartId,
            chartdata: this.props.data,
            axisNames: this.props.axisNames,
            columnForXAxis: this.props.columnForXAxis,
            columnsForYAxis: this.props.columnsForYAxis,
            legendNames: this.props.legendNames
                ? this.props.legendNames
                : this.props.columnsForYAxis,
            showDummyData: this.props.showDummyData ? true : false,
            isPercentageChart: this.props.isPercentageChart ? true : false,
            isDateAxis: this.props.isDateAxis ? true : false,
        };
    }
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
    getLinearGradientModifier = () => {
        // Adding greadient to create a round bar effect
        let fillModifier = new am4core.LinearGradientModifier();
        fillModifier.brightnesses = [0, 1, 1, 0];
        fillModifier.offsets = [0, 0.45, 0.55, 1];
        fillModifier.gradient.rotation = 0;
        return fillModifier;
    };
    getLinearGradient = (color1, color2) => {
        let gradient = new am4core.LinearGradient();
        gradient.addColor(color1);
        if (typeof color2 !== "undefined") {
            gradient.addColor(color2);
        } else {
            gradient.addColor("#66c9ff");
            gradient.addColor(color1);
        }
        gradient.rotation = 90;
        return gradient;
    };
    createLegend = (chart) => {
        chart.legend = new am4charts.Legend();
        chart.legend.maxWidth = 400;
        chart.legend.markers.template.width = 20;
        chart.legend.markers.template.height = 20;
        chart.legend.itemContainers.template.paddingRight = 2;
        chart.legend.itemContainers.template.paddingLeft = 2;
        chart.legend.labels.template.maxWidth = 100;
        chart.legend.labels.template.truncate = true;
        chart.legend.valueLabels.template.align = "left";
        chart.legend.valueLabels.template.textAlign = "end";
        chart.legend.itemContainers.template.tooltipText = "{name}";

        chart.legend.itemContainers.template.events.on("over", (ev) => {
            let seriesColumn = ev.target.dataItem.dataContext.columns.template;
            seriesColumn.fillOpacity = 1;
        });
        chart.legend.itemContainers.template.events.on("out", function (ev) {
            let seriesColumn = ev.target.dataItem.dataContext.columns.template;
            seriesColumn.fillOpacity = 0.7;
        });
        chart.legend.valueLabels.template.adapter.add("textOutput", function (text, target) {
            if (text === "(Avg: [bold]%[/])" || text === "(Total: [bold][/])") {
                return "N/A";
            } else if (text === "[bold]%[/]" || text === "[bold][/]") {
                return "";
            }
            return text;
        });
    };
    createScrollBar = (chart) => {
        chart.scrollbarX = new am4core.Scrollbar();
        chart.scrollbarX.background.fillOpacity = 0.7;

        let gradient = this.getLinearGradient("#0095e6");
        chart.scrollbarX.thumb.background.fill = gradient;
        chart.scrollbarX.thumb.background.fillOpacity = 0.7;
        chart.scrollbarX.startGrip.background.fill = am4core.color("#0095e6");
        chart.scrollbarX.endGrip.background.fill = am4core.color("#0095e6");
        chart.scrollbarX.stroke = am4core.color("#66c9ff");
        chart.scrollbarX.height = "20";
        chart.scrollbarX.exportable = false;
    };
    createExportMenu = (chart, title) => {
        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.menu.verticalAlign = "bottom";
        chart.exporting.filePrefix = title + " StackedColumnChart";
    };
    createCursor = (chart) => {
        chart.cursor = new am4charts.XYCursor();
    };
    createDateAxis = (chart, xAxisName) => {
        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.title.text = xAxisName;
        dateAxis.cursorTooltipEnabled = true;
        dateAxis.renderer.minGridDistance = 30;
        dateAxis.renderer.cellStartLocation = 0.1;
        dateAxis.renderer.cellEndLocation = 0.9;
        dateAxis.skipEmptyPeriods = true;
        dateAxis.renderer.grid.template.location = 0;
        dateAxis.renderer.axisFills.template.disabled = false;
        dateAxis.renderer.axisFills.template.fill = am4core.color("#b3b3b3");
        dateAxis.renderer.axisFills.template.fillOpacity = 0.2;
        return dateAxis;
    };
    createCategoryAxis = (chart, xAxisName) => {
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = this.state.columnForXAxis;

        categoryAxis.title.text = xAxisName;
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.cellStartLocation = 0.1;
        categoryAxis.renderer.cellEndLocation = 0.9;
        categoryAxis.renderer.axisFills.template.disabled = false;
        categoryAxis.renderer.axisFills.template.fillOpacity = 0.2;
        categoryAxis.renderer.axisFills.template.fill = am4core.color("#b3b3b3");
        return categoryAxis;
    };
    createValueAxis = (chart, yAxisName) => {
        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = yAxisName;
        valueAxis.min = 0;
        valueAxis.ghostLabel.disabled = true;
        valueAxis.extraMax = 0.1;
        valueAxis.renderer.line.strokeOpacity = 1;
        valueAxis.renderer.line.strokeWidth = 2;
        valueAxis.renderer.ticks.template.disabled = false;
        valueAxis.renderer.ticks.template.strokeOpacity = 1;
        valueAxis.renderer.ticks.template.strokeWidth = 2;
        return valueAxis;
    };
    createValueAxisRange = (valueAxis, value, color, guideLabel) => {
        let axisRange = valueAxis.axisRanges.create();
        axisRange.value = value;
        axisRange.grid.stroke = am4core.color(color);
        axisRange.grid.strokeOpacity = 0.7;
        // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray
        axisRange.grid.strokeDasharray = "4 5";
        axisRange.grid.opacity = 0.8;
        axisRange.grid.strokeWidth = 2;
        axisRange.label.inside = true;
        axisRange.label.text = guideLabel;
        axisRange.label.fill = axisRange.grid.stroke;
        axisRange.label.verticalCenter = "bottom";
        axisRange.label.horizontalCenter = "middle";
        return axisRange;
    };

    createAxis = (chart, xAxisName, yAxisName) => {
        // Create x-axes
        let xAxis;
        if (this.state.isDateAxis) {
            xAxis = this.createDateAxis(chart, xAxisName);
        } else {
            xAxis = this.createCategoryAxis(chart, xAxisName);
        }
        // Create y-axes
        let valueAxis = this.createValueAxis(chart, yAxisName);
        if (this.state.isPercentageChart) {
            // This is to create horizontal 'red' (on 80%) and 'green'(on 100%) lines
            this.createValueAxisRange(valueAxis, 80, "#ff0000", "Threshold");
            this.createValueAxisRange(valueAxis, 100, "#00b33c", "Goal");
        }
        return [xAxis, valueAxis];
    };

    createSeries = (chart, field, name, stacked, showDummyData) => {
        // For normal coloums
        let series = chart.series.push(new am4charts.ColumnSeries());
        // For 3D coloums
        //let series = chart.series.push(new am4charts.ColumnSeries3D());
        series.name = name;
        series.dataFields.valueY = field;
        if (this.state.isDateAxis) {
            series.dataFields.dateX = this.state.columnForXAxis;
        } else {
            series.dataFields.categoryX = this.state.columnForXAxis;
        }
        if (showDummyData && !this.state.isPercentageChart) {
            series.columns.template.propertyFields.dummyData = field + "_breakdown";
            series.columns.template.tooltipText =
                "[bold]{name} #{categoryX}\n[bold]Total:[/] {valueY}\n[#00cc44 bold]Pass:[/] {dummyData.pass}\n[#ff0000 bold]Fail:[/] {dummyData.fail}\n[#ff471a bold]Error:[/] {dummyData.error}\n[#ff9900 bold]Terminated:[/] {dummyData.terminated}[/]";
        } else if (this.state.isPercentageChart) {
            series.columns.template.tooltipText = "{name}: [bold]{valueY}%[/]";
        } else {
            series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
        }
        series.strokeWidth = 2;
        series.tooltip.background.fillOpacity = 0.9;
        series.tooltip.exportable = false;
        series.stacked = stacked;
        series.columns.template.width = am4core.percent(90);
        series.columns.template.fillOpacity = 0.7;
        series.tooltip.getFillFromObject = false;
        series.tooltip.background.fill = am4core.color("#ffffff");
        series.tooltip.background.stroke = chart.colors.getIndex(
            chart.colors.currentStep - chart.colors.step
        );
        series.tooltip.background.strokeWidth = 2;
        series.tooltip.label.fill = am4core.color("#000000");

        let fillModifier = this.getLinearGradientModifier();
        series.columns.template.fillModifier = fillModifier;
        if (this.state.isPercentageChart) {
            series.legendSettings.itemValueText = "[bold]{valueY}%[/]";
            series.legendSettings.valueText =
                "(Avg: [bold]{valueY.average.formatNumber('#.##')}%[/])";
        } else {
            series.legendSettings.itemValueText = "[bold]{valueY}[/]";
            series.legendSettings.valueText = "(Total: [bold]{valueY.sum.formatNumber('#.')}[/])";
        }
        series.cursorTooltipEnabled = false;
        this.addEvents(series);
    };

    addChartTitle = (chart, titleText) => {
        let title = chart.titles.create();
        title.text = titleText;
        title.fontSize = 25;
        title.marginBottom = 30;
    };

    addEvents = (series) => {
        let hoverState = series.columns.template.states.create("hover");
        hoverState.properties.fillOpacity = 1;
    };

    preZoomChart = (chart, xAxis) => {
        chart.events.on("ready", (a) => {
            // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToValues
            if (this.state.isDateAxis) {
                xAxis.start = 0.4;
                xAxis.end = 1;
            } else {
                xAxis.zoomToIndexes(chart.data.length - 9, chart.data.length, false, true, true);
            }
        });
    };

    createChart = (chart) => {
        chart.data = this.state.chartdata;
        chart.colors.step = 3;
        if (this.props.isDateAxis) {
            chart.dateFormatter.inputDateFormat = "yyyy-MM-ddThh";
        }
        this.createLegend(chart);
        this.createCursor(chart);
        // Fow now its single axis hence '0'
        let axis = this.createAxis(
            chart,
            this.state.axisNames.xAxis[0],
            this.state.axisNames.yAxis[0]
        );

        this.createScrollBar(chart);
        if (this.props.chartTitle) {
            this.addChartTitle(chart, this.props.chartTitle);
            this.createExportMenu(chart, this.props.chartTitle);
        } else {
            this.createExportMenu(chart, "");
        }
        for (let i = 0; i < this.state.columnsForYAxis.length; i++) {
            this.createSeries(
                chart,
                this.state.columnsForYAxis[i],
                this.state.legendNames[i],
                false,
                this.state.showDummyData
            );
        }

        // Prezoom only one we have some big dataset (equal or more than 10 points on xaxis)
        if (chart.data.length > 9) {
            this.preZoomChart(chart, axis[0]);
        }
        // Extending the axisFills to axis labels
        chart.plotContainer.adapter.add("pixelHeight", function (value, target) {
            return value + 40;
        });
    };
    render() {
        return (
            <div>
                <div id={this.state.chartId} className="chart-display" />
            </div>
        );
    }
}

export default StackedClusteredColumnChart;
