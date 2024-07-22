import { useEffect, useMemo, useState } from "react";
import { getCSVFile } from "./utils";
import { SDGRow, Topology } from "./types";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import countriesURL from "./countries-50m.json?url";

type SVGMapProps = {
  topology: Topology;
  sdgRows: SDGRow[];
};

function translateName(geoName: string): string | undefined {
  const countryTranslations: { [key: string]: string | undefined } = {
    Bahamas: "Bahamas, The",
    "Bosnia and Herz.": "Bosnia and Herzegovina",
    Brunei: "Brunei Darussalam",
    "Central African Rep.": "Central African Republic",
    "Dem. Rep. Congo": "Congo, Dem. Rep.",
    Congo: "Congo, Rep.",
    "Côte d'Ivoire": "Cote d'Ivoire",
    "Dominican Rep.": "Dominican Republic",
    Egypt: "Egypt, Arab Rep.",
    eSwatini: "Eswatini",
    Gambia: "Gambia, The",
    Iran: "Iran, Islamic Rep.",
    "South Korea": "Korea, Rep.",
    Kyrgyzstan: "Kyrgyz Republic",
    Laos: "Lao PDR",
    Macedonia: "North Macedonia",
    Russia: "Russian Federation",
    "São Tomé and Principe": "Sao Tome and Principe",
    Slovakia: "Slovak Republic",
    "S. Sudan": "South Sudan",
    Syria: "Syrian Arab Republic",
    Turkey: "Türkiye",
    "United States of America": "United States",
    Venezuela: "Venezuela, RB",
    Yemen: "Yemen, Rep.",
  };
  return countryTranslations[geoName];
}

type SDGScores = Omit<SDGRow, "year" | "country" | "country_code">;

function SvgMap({ topology, sdgRows }: SVGMapProps) {
  const sdg = useMemo(() => {
    // const names = new Set<string>();
    const perYear: {
      [year: number]: { [country: string]: SDGScores };
    } = {};
    for (const { year, country, country_code, ...scores } of sdgRows) {
      let perCountry = perYear[year];
      if (!perCountry) {
        perCountry = {};
        perYear[year] = perCountry;
      }
      perCountry[country] = scores;
    }
    return perYear;
  }, [sdgRows]);

  // range 2000-2022
  // TODO: set year via slider
  const [year, _setYear] = useState(2022);

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

  const color = d3.scaleSequential([0, 100], d3.interpolateYlGnBu);

  const projection = d3
    .geoNaturalEarth1()
    .rotate([-10, 0]) // don't let Russia wrap
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
        {countries.features.map((f) => {
          const name =
            sdg[year][f.properties!.name] !== undefined
              ? f.properties!.name
              : translateName(f.properties!.name);
          const fillColor =
            name === undefined
              ? "#828282"
              : color(sdg[year][name].sdg_index_score);
          return <path d={path(f) ?? undefined} fill={fillColor}></path>;
        })}
      </g>
    </svg>
  );
}

function App() {
  const [data, setData] = useState<SDGRow[]>([]);
  const [topology, setTopology] = useState<null | Topology>(null);

  console.log("data", data);
  console.log("countries", topology);

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
      {topology && <SvgMap sdgRows={data} topology={topology} />}
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
