import { useEffect, useRef } from "react";
import { SDGCol, SDGColDescriptions, SDGRow } from "../types";
import * as d3 from "d3";

interface ScatterProps {
  data: SDGRow[];
  cols: SDGCol[];

  /*
   * Leave blank to show all years.
   */
  year?: number;

  /**
   * List of country names to show in the scatter plot.
   */
  selectedCountries?: string[];
}

/**
 * Scatter plot component.
 */
export default function Scatter({
  data,
  cols,
  selectedCountries,
  year,
}: ScatterProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Get the data for the selected columns.
  const filteredData = data
    .map((row) => {
      const newRow: any = {};
      cols.forEach((col: SDGCol, index: number) => {
        if (
          selectedCountries &&
          !selectedCountries.includes(row[SDGCol.COUNTRY])
        ) {
          return;
        }

        newRow[index] = row[col];
        newRow["country"] = row[SDGCol.COUNTRY];
        newRow["year"] = row[SDGCol.YEAR];
      });
      return newRow;
    })
    .filter((row) => row[0] !== undefined && row[1] !== undefined);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = window.innerWidth / 2.5;
    const height = window.innerWidth / 2.5;
    const margin = { top: 20, right: 30, bottom: 40, left: 30 };

    svg
      .attr("width", width)
      .attr("height", height)
      .style("background", "#fff")
      .style("overflow", "visible");

    const xScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([margin.left, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([height - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);

    var color = d3
      .scaleOrdinal()
      .domain(selectedCountries || [])
      .range([
        "#F8766D",
        "#00BA38",
        "#619CFF",
        "#ff00ff",
        "#0fee05",
        "#eeee00",
      ]);

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

    svg
      .selectAll(".dot")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d[0]))
      .attr("cy", (d) => yScale(d[1]))
      .attr("r", (d) =>
        year !== undefined && d["year"] === year.toString() ? 6 : 5
      )
      .attr("opacity", (d) =>
        year === undefined ? 0.9 : d["year"] === year.toString() ? 1 : 0.1
      )
      // @ts-ignore
      .attr("fill", (d) => color(d["country"]))
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(100).style("opacity", 0.9);
        tooltip
          .html(
            `<strong>${d["country"]}</strong><br/>${
              SDGColDescriptions[cols[0]]
            }: ${d[0]}<br/>${SDGColDescriptions[cols[1]]}: ${d[1]}`
          ) // Customize this line to show the data you want
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // Add X axis label:
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width / 2 + margin.left)
      .attr("y", height + margin.top + 20)
      .text(SDGColDescriptions[cols[0]]);

    // Y axis label:
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 10)
      .attr("x", -margin.top - height / 2 + 20)
      .text(SDGColDescriptions[cols[1]]);
  }, [data, window.innerWidth]);

  return (
    <div className="flex items-center justify-center flex-col gap-2 px-[100px]">
      <h2 className="text-2xl font-semibold">
        {SDGColDescriptions[cols[0]]} vs {SDGColDescriptions[cols[1]]}
      </h2>
      <svg ref={svgRef} id="scatter"></svg>
    </div>
  );
}
