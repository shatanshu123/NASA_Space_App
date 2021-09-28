import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default class Chart extends React.PureComponent {
  render() {
    let data = this.props.data.map((record, index) => {
      return {
        Year: record[0],
        Launches: record[1],
      };
    });

    return (
      <LineChart width={800} height={200} data={data} >
        <YAxis tickLine={false} domain={[0, "auto"]} />
        <XAxis hide={false} dataKey="Year" />
        <Tooltip contentStyle={{backgroundColor: "none"}}/>
        <Line
          type="monotone"
          dataKey="Launches"
          stroke="#ffffaa"
          strokeWidth={1}
          dot={false}
          animationDuration={6000}
        />
      </LineChart>
    );
  }
}
