import React, { Component } from "react";
import LineChart from "./Charts/LineChart";

class Chart1 extends Component {
    constructor(props) {
        super();
        this.state = {
            error: null,
            isLoaded: false,
            chartData: [],
        };
    }
    getChartData = () => {
        fetch("/api/v1/multi-line-chart")
            .then((response) => response.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        chartData: result.chart_data,
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error,
                    });
                }
            );
    };

    componentDidMount() {
        this.getChartData();
    }
    render() {
        if (this.state.error) {
            return <div>Error: {this.state.error.message}</div>;
        } else if (!this.state.isLoaded) {
            return (
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            );
        } else {
            return (
                <React.Fragment>
                    <LineChart
                        chartId="chart1"
                        data={this.state.chartData.data}
                        axisNames={{
                            xAxis: [this.state.chartData.label.domainAxis],
                            yAxis: [this.state.chartData.label.rangeAxis],
                        }}
                        lineForXAxis="Date"
                        linesForFirstAxis={["Ford", "Honda", "Renault", "Toyota"]}
                        chartTitle={this.state.chartData.title}
                    />
                </React.Fragment>
            );
        }
    }
}

export default Chart1;
