/* 
This Component has the ability to create single-line/multi-line/multi-axle chart.
Just pass the props properly and it will do the work.
*/
import React, { Component } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

class LineChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartId: this.props.chartId,
            chartdata: this.props.data,
            axisNames: this.props.axisNames,
            lineForXAxis: this.props.lineForXAxis,
            linesForFirstAxis: this.props.linesForFirstAxis,
            linesForSecondAxis: this.props.linesForSecondAxis
                ? this.props.linesForSecondAxis
                : null,
            legendNames: this.props.legendNames
                ? this.props.legendNames
                : this.props.linesForFirstAxis.concat(this.props.linesForSecondAxis),
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

    createDateAxis = (chart, xAxisName) => {
        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.title.text = xAxisName;
        dateAxis.baseInterval.timeUnit = "minute";
        dateAxis.baseInterval.count = 1;
        let axisTooltip = dateAxis.tooltip;
        axisTooltip.background.strokeWidth = 0;
        axisTooltip.background.cornerRadius = 3;
        axisTooltip.background.pointerLength = 0;
        axisTooltip.dy = 5;
        dateAxis.tooltipDateFormat = "MMM dd HH:mm:ss";
        dateAxis.cursorTooltipEnabled = true;
        //dateAxis.renderer.minGridDistance = 50;
        //dateAxis.renderer.grid.template.disabled = true;
        dateAxis.renderer.line.strokeOpacity = 1;
        dateAxis.renderer.line.strokeWidth = 2;
        dateAxis.skipEmptyPeriods = true;
        return dateAxis;
    };
    createCategoryAxis = (chart, xAxisName) => {
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = this.state.lineForXAxis;
        categoryAxis.title.text = xAxisName;

        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.cellStartLocation = 0.1;
        categoryAxis.renderer.cellEndLocation = 0.9;
        return categoryAxis;
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
    createValueAxis = (chart, yAxisName, opposite) => {
        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = yAxisName;
        valueAxis.min = 0;
        valueAxis.ghostLabel.disabled = true;
        valueAxis.extraMax = 0.1;
        valueAxis.numberFormatter = new am4core.NumberFormatter();
        valueAxis.numberFormatter.numberFormat = "# a";
        if (typeof opposite !== "undefined") {
            valueAxis.renderer.opposite = opposite;
        }
        if (this.state.linesForSecondAxis) {
            valueAxis.renderer.grid.template.disabled = true;
        }
        valueAxis.renderer.line.strokeOpacity = 1;
        valueAxis.renderer.line.strokeWidth = 2;
        valueAxis.renderer.ticks.template.disabled = false;
        valueAxis.renderer.ticks.template.strokeOpacity = 1;
        valueAxis.renderer.ticks.template.strokeWidth = 2;
        return valueAxis;
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

    createTrendLine = (chart, value, name, yAxisId, bulletType, fillOpacity) => {
        let series = chart.series.push(new am4charts.LineSeries());
        series.name = name;
        series.dataFields.valueY = value;
        if (this.state.isDateAxis) {
            series.dataFields.dateX = this.state.lineForXAxis;
        } else {
            series.dataFields.categoryX = this.state.lineForXAxis;
        }
        series.strokeWidth = 2;
        series.strokeOpacity = 0.8;
        series.tensionX = 0.7;
        series.yAxis = yAxisId;
        series.fillOpacity = fillOpacity;
        if (this.state.isPercentageChart) {
            series.tooltipText = "{name}: [bold]{valueY}%[/]";
        } else {
            series.tooltipText = "{name}: [bold]{valueY}[/]";
        }
        series.tooltip.background.cornerRadius = 13;
        series.tooltip.background.fillOpacity = 0.8;
        series.tooltip.exportable = false;
        series.minBulletDistance = 15;
        // Enable the number in the legend on hovering over the graph
        if (this.state.isPercentageChart) {
            series.legendSettings.itemValueText = "[bold]{valueY}%[/]";
            series.legendSettings.valueText =
                "(Avg: [bold]{valueY.average.formatNumber('#.##')}%[/])";
        } else {
            series.legendSettings.itemValueText = "[bold]{valueY}[/]";
        }
        // Add a drop shadow filter on columns
        //let shadow = series.filters.push(new am4core.DropShadowFilter());
        //shadow.dx = 10;
        //shadow.dy = 10;
        //shadow.blur = 5;
        let bullet;
        let hoverState;
        switch (bulletType) {
            case "rectangle":
                bullet = series.bullets.push(new am4charts.Bullet());
                let square = bullet.createChild(am4core.Rectangle);
                square.strokeWidth = 1;
                square.width = 7;
                square.height = 7;
                square.stroke = am4core.color("#fff");
                square.horizontalCenter = "middle";
                square.verticalCenter = "middle";
                hoverState = square.states.create("hover");
                hoverState.properties.scale = 1.7;
                break;
            case "triangledown":
            case "triangleup":
                bullet = series.bullets.push(new am4charts.Bullet());
                let triangle = bullet.createChild(am4core.Triangle);
                triangle.strokeWidth = 1;
                triangle.width = 7;
                triangle.height = 7;
                if (bulletType === "triangleup") {
                    triangle.direction = "top";
                } else {
                    triangle.direction = "bottom";
                }
                triangle.stroke = am4core.color("#fff");
                triangle.horizontalCenter = "middle";
                triangle.verticalCenter = "middle";
                hoverState = triangle.states.create("hover");
                hoverState.properties.scale = 1.7;
                break;
            case "circle":
            case "hollowcircle":
                bullet = series.bullets.push(new am4charts.CircleBullet());
                bullet.strokeWidth = 1;
                bullet.circle.radius = 3.5;
                bullet.fillOpacity = 1;
                if (bulletType === "circle") {
                    bullet.stroke = am4core.color("#fff");
                    bullet.circle.fill = series.stroke;
                } else {
                    bullet.stroke = series.stroke;
                    bullet.circle.fill = am4core.color("#fff");
                }
                hoverState = bullet.states.create("hover");
                hoverState.properties.scale = 1.7;
                break;
            default:
                break;
        }
        this.addEvents(series);
        return series;
    };
    addEvents = (series) => {
        // Enable interactions on series segments
        let segment = series.segments.template;
        segment.interactionsEnabled = true;

        // Create hover state
        let hoverState = segment.states.create("hover");
        hoverState.properties.strokeWidth = 4;
        hoverState.properties.strokeOpacity = 1;
    };
    createLegend = (chart) => {
        chart.legend = new am4charts.Legend();
        chart.legend.maxWidth = 400;
        chart.legend.markers.template.width = 40;
        chart.legend.markers.template.height = 10;
        // Use this to change the color of the legend label
        //chart.legend.markers.template.disabled = true;
        //chart.legend.labels.template.text = "[bold {color}]{name}[/]";
        chart.legend.itemContainers.template.paddingTop = 2;
        chart.legend.itemContainers.template.paddingBottom = 2;
        chart.legend.labels.template.maxWidth = 130;
        chart.legend.labels.template.truncate = true;
        chart.legend.itemContainers.template.tooltipText = "{name}";
        chart.legend.numberFormatter = new am4core.NumberFormatter();
        chart.legend.numberFormatter.numberFormat = "#.## a";
        chart.legend.itemContainers.template.events.on("over", (ev) => {
            let lineSeries = ev.target.dataItem.dataContext.segments.template;
            lineSeries.strokeOpacity = 1;
            lineSeries.strokeWidth = 4;
        });
        chart.legend.itemContainers.template.events.on("out", function (ev) {
            let lineSeries = ev.target.dataItem.dataContext.segments.template;
            lineSeries.strokeOpacity = 0.8;
            lineSeries.strokeWidth = 2;
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

    createExportMenu = (chart, title) => {
        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.menu.verticalAlign = "bottom";
        chart.exporting.filePrefix = title + " LineChart";
    };

    createCursor = (chart) => {
        chart.cursor = new am4charts.XYCursor();
    };

    createScrollBar = (chart, series) => {
        chart.scrollbarX = new am4core.Scrollbar();
        chart.scrollbarX.thumb.background.fill = am4core.color("#66c9ff");
        chart.scrollbarX.startGrip.background.fill = am4core.color("#0095e6");
        chart.scrollbarX.endGrip.background.fill = am4core.color("#0095e6");
        chart.scrollbarX.stroke = am4core.color("#66c9ff");
        chart.scrollbarX.height = "20";
        chart.scrollbarX.exportable = false;
        // Add simple vertical scrollbar
        // chart.scrollbarY = new am4core.Scrollbar();
        // chart.scrollbarY.thumb.background.fill = am4core.color("#66c9ff");
        // chart.scrollbarY.startGrip.background.fill = am4core.color("#0095e6");
        // chart.scrollbarY.endGrip.background.fill = am4core.color("#0095e6");
        // chart.scrollbarY.stroke = am4core.color("#66c9ff");
        // chart.scrollbarY.width = "20";
        // chart.scrollbarY.exportable = false;
    };

    addChartTitle = (chart, titleText) => {
        let title = chart.titles.create();
        title.text = titleText;
        title.fontSize = 25;
        title.marginBottom = 30;
    };

    createChart = (chart) => {
        chart.data = this.state.chartdata;
        chart.colors.step = 4;
        // This will change the background color of chart
        //chart.background.fill = "#fff";
        //chart.background.opacity = 0.5;
        this.createLegend(chart);

        this.createCursor(chart);

        // Use this to change bullet type in lines if needed
        //let bulletsType = ["circle", "triangleup", "triangledown", "hollowcircle", "rectangle"];
        let axis = this.createAxis(
            chart,
            this.state.axisNames.xAxis[0],
            this.state.axisNames.yAxis[0]
        );
        for (let i = 0; i < this.state.linesForFirstAxis.length; i++) {
            //if (typeof bulletsType[i] !== "undefined") {
            this.createTrendLine(
                chart,
                this.state.linesForFirstAxis[i],
                this.state.legendNames[i],
                axis[1],
                "circle"
            );
            //} else {
            //    this.createTrendLine(chart, this.state.linesForFirstAxis[i], axis[1]);
            //}
        }

        if (this.state.linesForSecondAxis) {
            let yAxis = this.createValueAxis(chart, this.state.axisNames.yAxis[1], "true");
            for (let i = 0; i < this.state.linesForSecondAxis.length; i++) {
                let series;
                let fillOpacity = 0.2;
                //if (typeof bulletsType[this.state.linesForSecondAxis.length - i] !== "undefined") {
                series = this.createTrendLine(
                    chart,
                    this.state.linesForSecondAxis[i],
                    this.state.legendNames[this.state.linesForFirstAxis.length + i],
                    yAxis,
                    "circle",
                    fillOpacity
                );
                //} else {
                //    series = this.createTrendLine(chart, this.state.linesForSecondAxis[i], yAxis);
                //}
                if (this.state.linesForSecondAxis.length === 1) {
                    yAxis.renderer.line.stroke = series.stroke;
                    yAxis.renderer.ticks.template.stroke = series.stroke;
                }
            }
        }
        this.createScrollBar(chart);
        if (this.props.chartTitle) {
            this.addChartTitle(chart, this.props.chartTitle);
            this.createExportMenu(chart, this.props.chartTitle);
        } else {
            this.createExportMenu(chart, "");
        }
    };

    componentDidUpdate(prevProps) {
        if (this.chart !== null) {
            if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
                this.chart.data = this.props.data;
            }
        }
    }

    render() {
        return (
            <div>
                <div id={this.state.chartId} className="chart-display" />
            </div>
        );
    }
}

export default LineChart;
