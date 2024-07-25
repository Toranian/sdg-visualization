import * as d3 from "d3";
import { useEffect, useRef } from "react";

interface ColorLegendProps {
  width: number;
  height: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  color: d3.ScaleSequential<number, string>;
  ticks?: number;
  tickValues?: number[];
  tickFormat?: string | ((domainValue: number, index: number) => string);
  tickSize?: number;
  title?: string;
}

// Copyright 2021, Observable Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/color-legend
export function Legend({
  color,
  title = undefined,
  tickSize = 6,
  width = 320,
  height = 44 + tickSize,
  marginTop = 18,
  marginRight = 0,
  marginBottom = 16 + tickSize,
  marginLeft = 0,
  ticks = width / 64,
  tickFormat = undefined,
  tickValues = undefined,
}: ColorLegendProps) {
  function ramp(color: any, n = 256) {
    const canvas = document.createElement("canvas");
    canvas.width = n;
    canvas.height = 1;
    const context = canvas.getContext("2d");
    for (let i = 0; i < n; ++i) {
      context!.fillStyle = color(i / (n - 1));
      context!.fillRect(i, 0, 1, 1);
    }
    return canvas;
  }
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Clear previous content
    svg.selectAll("*").remove();

    const tickAdjust = (g: any) =>
      g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);

    const x = Object.assign(
      color
        .copy()
        .interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
      {
        range() {
          return [marginLeft, width - marginRight];
        },
      },
    );

    // Add image
    svg
      .append("image")
      .attr("x", marginLeft)
      .attr("y", marginTop)
      .attr("width", width - marginLeft - marginRight)
      .attr("height", height - marginTop - marginBottom)
      .attr("preserveAspectRatio", "none")
      .attr("href", ramp(color.interpolator()).toDataURL());

    // Handle ticks
    // @ts-ignore
    if (!x.ticks) {
      if (tickValues === undefined) {
        const n = Math.round(ticks + 1);
        // @ts-ignore
        tickValues = d3
          .range(n)
          .map((i) => d3.quantile(color.domain(), i / (n - 1)));
      }
      if (typeof tickFormat !== "function") {
        tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
      }
    }

    // Add axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      // @ts-ignore
      .call(
        d3
          // @ts-ignore
          .axisBottom(x)
          .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
          // @ts-ignore
          .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
          .tickSize(tickSize)
          // @ts-ignore
          .tickValues(tickValues),
      )
      .call(tickAdjust)
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .append("text")
          .attr("x", marginLeft)
          .attr("y", marginTop + marginBottom - height - 6)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .attr("class", "title")
          // @ts-ignore
          .text(title),
      );
  }, [
    width,
    height,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    color,
    ticks,
    tickValues,
    tickFormat,
    tickSize,
    title,
  ]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: "visible", display: "block" }}
    />
  );
  // function ramp(color: any, n = 256) {
  //   const canvas = document.createElement("canvas");
  //   canvas.width = n;
  //   canvas.height = 1;
  //   const context = canvas.getContext("2d");
  //   for (let i = 0; i < n; ++i) {
  //     context!.fillStyle = color(i / (n - 1));
  //     context!.fillRect(i, 0, 1, 1);
  //   }
  //   return canvas;
  // }
  //
  // const svg = d3
  //   .create("svg")
  //   .attr("width", width)
  //   .attr("height", height)
  //   .attr("viewBox", [0, 0, width, height])
  //   .style("overflow", "visible")
  //   .style("display", "block");
  //
  // let tickAdjust = (g: any) =>
  //   g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
  // let x: any;
  //
  // x = Object.assign(
  //   color
  //     .copy()
  //     .interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
  //   {
  //     range() {
  //       return [marginLeft, width - marginRight];
  //     },
  //   },
  // );
  //
  // svg
  //   .append("image")
  //   .attr("x", marginLeft)
  //   .attr("y", marginTop)
  //   .attr("width", width - marginLeft - marginRight)
  //   .attr("height", height - marginTop - marginBottom)
  //   .attr("preserveAspectRatio", "none")
  //   .attr("xlink:href", ramp(color.interpolator()).toDataURL());
  //
  // if (!x.ticks) {
  //   if (tickValues === undefined) {
  //     const n = Math.round(ticks + 1);
  //     tickValues = d3
  //       .range(n)
  //       .map((i) => d3.quantile(color.domain(), i / (n - 1)));
  //   }
  //   if (typeof tickFormat !== "function") {
  //     tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
  //   }
  // }
  // svg
  //   .append("g")
  //   .attr("transform", `translate(0,${height - marginBottom})`)
  //   .call(
  //     d3
  //       .axisBottom(x)
  //       .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
  //       .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
  //       .tickSize(tickSize)
  //       .tickValues(tickValues),
  //   )
  //   .call(tickAdjust)
  //   .call((g) => g.select(".domain").remove())
  //   .call((g) =>
  //     g
  //       .append("text")
  //       .attr("x", marginLeft)
  //       .attr("y", marginTop + marginBottom - height - 6)
  //       .attr("fill", "currentColor")
  //       .attr("text-anchor", "start")
  //       .attr("font-weight", "bold")
  //       .attr("class", "title")
  //       .text(title),
  //   );
  //
  // // // return svg.node();
  // // svg
  // //   .append("image")
  // //   .attr("x", marginLeft)
  // //   .attr("y", marginTop)
  // //   .attr("width", width - marginLeft - marginRight)
  // //   .attr("height", height - marginTop - marginBottom)
  // //   .attr("preserveAspectRatio", "none")
  // //   .attr("xlink:href", ramp(color.interpolator()).toDataURL());
  //
  // return (
  //   <svg
  //     width={width}
  //     height={height}
  //     viewBox={`0 0 ${width} ${height}`}
  //     className="overflow-visible block"
  //   >
  //     <image
  //       x={marginLeft}
  //       y={marginTop}
  //       width={width - marginLeft - marginRight}
  //       height={height - marginTop - marginBottom}
  //       preserveAspectRatio="none"
  //       xlinkHref={ramp(color.interpolator()).toDataURL()}
  //     ></image>
  //   </svg>
  // );
}
