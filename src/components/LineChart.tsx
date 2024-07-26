import { useEffect, useRef } from "react";
import { SDGCol, SDGColDescriptions, SDGRow } from "../types";
import * as d3 from "d3";

interface LineChartProps {
  cols: SDGCol[];
  data: SDGRow[];
  country: string;
}

interface LineData {
  year: Date;
  value: number;
}

export default function LineChart({ cols, data, country }: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Filter and format the data
  const filteredData = data
    .filter((row) => country.includes(row[SDGCol.COUNTRY]))
    .map((row) => {
      const year = row[SDGCol.YEAR];
      const values = cols.reduce((acc: any, col: SDGCol) => {
        acc[col] = +row[col]; // Ensure numerical values
        return acc;
      }, {});

      return { year, ...values };
    });

  useEffect(() => {
    if (!svgRef.current || filteredData.length === 0) return;

    const width = window.innerWidth / 2.5;
    const height = window.innerWidth / 2.5;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    // Clear previous svg content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up x and y scales
    const x = d3
      .scaleTime()
      .domain(
        d3.extent(filteredData, (d) => new Date(d.year, 0, 1)) as [Date, Date],
      )
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, 100]) // Fixed max value for the Y-axis
      .range([height, 0]);

    // Add x and y axes
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      // FIXME: ISAAAAC
      // @ts-ignore
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")));

    svg.append("g").call(d3.axisLeft(y));

    // Define the color scale
    const color = d3
      .scaleOrdinal<string>()
      .domain(cols.map((col) => col.toString()))
      .range([
        "#F8766D80",
        "#00BA3880",
        "#619CFF80",
        "#e2e200",
        "#ff00ff80",
        "#0fee0580",
      ]);

    // Define the line generator
    const line = d3
      .line<LineData>()
      .x((d) => x(d.year))
      .y((d) => y(d.value));

    // Define the tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip") // Add relevant classes for styling
      .style("opacity", 0) // Initially hide the tooltip
      .style("position", "absolute")
      .style("padding", "10px")
      .style("background", "white")
      .style("border", "1px solid #ddd")
      .style("border-radius", "5px")
      .style("pointer-events", "none");

    // X axis label
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width / 2 + margin.left)
      .attr("y", height + margin.top + 20)
      .text("Time");

    // Y axis label:
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 10)
      .attr("x", -margin.top - height / 2)
      .text("SDG Scores");

    // Draw a line for each column
    cols.forEach((col) => {
      const lineData: LineData[] = filteredData.map((d) => ({
        year: new Date(d.year, 0, 1),
        value: d[col],
      }));
      const lastPoint = lineData[lineData.length - 1];

      svg
        .append("path")
        .data([lineData])
        .attr("fill", "none")

        .attr("stroke", color(col.toString())) // Use the color scale

        .attr("stroke-width", 2)
        .attr("d", line as any); // Cast line to any to avoid TypeScript error

      svg
        .append("path")
        .data([lineData])
        .attr("fill", "none")
        .attr("stroke", "transparent")
        .attr("stroke-width", 12)
        .attr("d", line as any) // Cast line to any to avoid TypeScript error

        .on("mouseover", function (event) {
          const [xPos, _] = d3.pointer(event);
          const x0 = x.invert(xPos);

          // Find the closest data point within the buffer
          const bisectDate = d3.bisector((d: LineData) => d.year).left;
          const i = bisectDate(lineData, x0, 1);
          const d0 = lineData[i - 1];
          const d1 = lineData[i];
          // @ts-ignore
          const d = x0 - d0.year > d1.year - x0 ? d1 : d0;

          tooltip.transition().duration(100).style("opacity", 0.9);

          // Show tooltip with formatted data
          tooltip
            .html(
              `<strong>${SDGColDescriptions[col] || "No description"}</strong><br/>
                ${d.year.getFullYear()}: ${d.value}`,
            )
            .style("left", `${event.pageX + 5}px`)
            .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => {
          tooltip.transition().duration(500).style("opacity", 0);
        });

      // Add label to the last point of the line
      svg
        .append("text")
        .attr("x", x(lastPoint.year))
        .attr("y", y(lastPoint.value) - 10) // Adjust position if needed
        .attr("fill", color(col.toString())) // Match the line color
        .attr("font-size", "14px")
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .text(`${SDGColDescriptions[col]}`); // Adjust the label text as needed
    });

    // Debugging
    console.log("Filtered Data:", filteredData);
    console.log("X Scale Domain:", x.domain());
    console.log("Y Scale Domain:", y.domain());
  }, [filteredData, country, cols, data]);

  return <svg ref={svgRef} id="scatter"></svg>;
}
