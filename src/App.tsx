import { useEffect, useState } from "react";
import { getCSVFile } from "./utils";
import { SDGRow, Topology } from "./types";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import countriesURL from "./countries-50m.json?url";

type SVGMapProps = {
  topology: Topology;
};

function SvgMap({ topology }: SVGMapProps) {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    function resizeMap() {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    }
    window.addEventListener("resize", resizeMap);
    () => window.removeEventListener("resize", resizeMap);
  }, []);

  const countries = topojson.feature(topology, topology.objects.countries);

  const color = d3.scaleSequential([0, 20], d3.interpolateYlGnBu);

  const projection = d3
    .geoMercator()
    .fitSize([width, height], { type: "Sphere" });
  const path = d3.geoPath(projection);

  return (
    <svg
      className="absolute"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <g>
        {countries.features.map((f) => (
          <path
            d={path(f) ?? undefined}
            fill={color(f.properties?.name.length)}
          ></path>
        ))}
      </g>
    </svg>
  );
}

function App() {
  const [data, setData] = useState<SDGRow[]>([]);
  const [topology, setTopology] = useState<null | Topology>(null);

  console.log(topology);

  const getData = async () => {
    const { data: csvData } = await getCSVFile();
    setData(csvData);
  };

  const getTopology = async () => {
    const resp = await fetch(countriesURL);
    setTopology(await resp.json());
  };

  useEffect(() => {
    getData();
    getTopology();
  }, []);

  return (
    <div className="w-max h-[100svh]">
      {topology && <SvgMap topology={topology} />}
      <h2>CSV Data</h2>

      {data.length === 0 && <h1>Loading data...</h1>}

      {data.length > 0 && (
        <div>
          {data.slice(0, 5).map((row: SDGRow, index) => (
            <div key={index} className="flex flex-row">
              {row.year}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
