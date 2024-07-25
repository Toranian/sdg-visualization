import { useEffect, useMemo, useRef, useState } from "react";
import { SDGRow, Topology } from "../types";
import * as d3 from "d3";
import * as topojson from "topojson-client";

type SVGMapProps = {
  topology: Topology;
  sdgRows: SDGRow[];
  year: number;
  goal: keyof SDGScores;
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

function partition<T>(array: T[], isValid: (x: T) => boolean): [T[], T[]] {
  return array.reduce<[T[], T[]]>(
    ([pass, fail], elem) => {
      return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
    },
    [[], []],
  );
}

export function SvgMap({ topology, year, goal, sdgRows }: SVGMapProps) {
  const sdg = useMemo(() => {
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

  const [hovered, setHovered] = useState<string | undefined>(undefined);

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

  const countries = useMemo(
    () => topojson.feature(topology, topology.objects.countries),
    [topology],
  );

  const land = useMemo(
    // @ts-ignore
    () => topojson.feature(topology, topology.objects.land),
    [topology],
  );

  const color = useMemo(
    () => d3.scaleSequential([0, 100], d3.interpolateYlGn),
    [],
  );

  const path = useMemo(() => {
    const projection = d3
      .geoNaturalEarth1()
      .rotate([-10, 0]) // don't let Russia wrap
      .fitSize([width, height], { type: "Sphere" });
    return d3.geoPath(projection);
  }, [width, height]);

  const countryPaths = useMemo(() => {
    const d: { [key: string]: string | undefined } = {};
    for (const f of countries.features) {
      const name =
        sdg[year][f.properties!.name] !== undefined
          ? f.properties!.name
          : translateName(f.properties!.name);
      const pathString = path(f);
      if (name && pathString) {
        d[name] = pathString;
      }
    }
    return d;
  }, [path, sdg, countries]);

  const landPath = useMemo(() => path(land) ?? undefined, [path, land]);

  const features = useMemo(() => {
    const fs = partition(countries.features, (f) => {
      const name =
        sdg[year][f.properties!.name] !== undefined
          ? f.properties!.name
          : translateName(f.properties!.name);
      return name !== undefined && name === hovered;
    });
    fs.reverse();
    return fs.flat(1);
  }, [countries, sdg, hovered]);

  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateCoords(e: MouseEvent) {
      const tooltip = tooltipRef.current;
      if (!tooltip) return;
      tooltip.style.left = `${e.x}px`;
      tooltip.style.top = `${e.y}px`;

      for (const element of document.elementsFromPoint(e.x, e.y)) {
        const name = element.getAttribute("data-country-name");
        if (name) {
          setHovered(name);
          tooltip.style.opacity = "1";
          return;
        }
      }
      setHovered(undefined);
      tooltip.style.opacity = "0";
    }
    window.addEventListener("mousemove", updateCoords);
    return () => window.removeEventListener("mousemove", updateCoords);
  }, [hovered, tooltipRef]);

  const mapPaths = (
    <g>
      {features.map((f) => {
        const name =
          sdg[year][f.properties!.name] !== undefined
            ? f.properties!.name
            : translateName(f.properties!.name);
        const fillColor =
          name === undefined ? "#828282" : color(sdg[year][name][goal]);

        const isHovered = name !== undefined && name === hovered;

        return (
          <path
            data-country-name={name}
            d={countryPaths[name]}
            paintOrder={"stroke"}
            stroke={isHovered ? "#FFFFFF" : "#000000"}
            strokeWidth={isHovered ? "2px" : "1px"}
            fill={fillColor}
            onClick={() => console.log("clicked on", name)}
          ></path>
        );
      })}
    </g>
  );

  return (
    <>
      <div
        className="z-20 absolute opacity-0 bg-black bg-opacity-80 text-white select-none pointer-events-none text-sm p-1 rounded-md"
        ref={tooltipRef}
      >
        {hovered && (
          <>
            <p className="font-bold">{hovered}</p>
            <p>{sdg[year][hovered][goal]}</p>
          </>
        )}
      </div>
      <svg
        className="absolute"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <rect
          width={"100%"}
          height={"100%"}
          fill={"#b5e2ff"}
          onMouseOver={() => setHovered(undefined)}
        />
        <path
          d={landPath}
          fill={"#BBBBBB"}
          onMouseOver={() => setHovered(undefined)}
        ></path>
        {mapPaths}
      </svg>
    </>
  );
}
