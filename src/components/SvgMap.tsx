import { useEffect, useMemo, useRef, useState } from "react";
import { SDGRow, Topology } from "../types";
import * as d3 from "d3";
import * as topojson from "topojson-client";

type SVGMapProps = {
  topology: Topology;
  sdgRows: SDGRow[];
  year: number;
  secondYear: number | null;
  goal: keyof SDGScores;
  onClickHandler: (country: string) => void;
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

export function SvgMap({
  topology,
  year,
  secondYear,
  goal,
  sdgRows,
  onClickHandler,
}: SVGMapProps) {
  console.log(secondYear);
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
  const hoveredRef = useRef<SVGPathElement | null>(null);

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

  const color = useMemo(
    () =>
      secondYear !== null
        ? d3.scaleSequential([-50, 50], d3.interpolateRdYlGn)
        : (d3.scaleSequential([0, 100], d3.interpolateYlGn) as any),
    [secondYear !== null],
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
      const name = f.properties!.name;
      const pathString = path(f);
      if (name && pathString) {
        d[name] = pathString;
      }
    }
    return d;
  }, [path, sdg, countries]);

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

  const gRef = useRef<SVGGElement>(null);

  const mapPaths = useMemo(
    () => (
      <g ref={gRef} width="100%" height="100%">
        <rect
          width={"100%"}
          height={"100%"}
          fillOpacity={0}
          onMouseOver={() => setHovered(undefined)}
        />
        {features.map((f) => {
          const name =
            sdg[year][f.properties!.name] !== undefined
              ? f.properties!.name
              : translateName(f.properties!.name);
          const fillColor =
            name === undefined
              ? "#BBBBBB"
              : color(
                  secondYear !== null
                    ? sdg[secondYear][name][goal] - sdg[year][name][goal]
                    : sdg[year][name][goal],
                );

          return (
            <path
              key={f.properties!.name}
              data-country-name={name ?? f.properties!.name}
              d={countryPaths[f.properties!.name]}
              paintOrder="stroke"
              stroke="#000000"
              strokeWidth="1px"
              fill={fillColor}
              onClick={() => onClickHandler(name)}
            ></path>
          );
        })}
      </g>
    ),
    [height, width, secondYear !== null],
  );

  useEffect(() => {
    if (!gRef.current) return;

    const pathGroup = d3.select(gRef.current);
    const zoom = d3
      .zoom<SVGGElement, unknown>()
      .scaleExtent([1, 8])
      .on("zoom", ({ transform }) => {
        pathGroup.attr("transform", transform);
        setHovered(undefined);
      });
    // @ts-ignore
    pathGroup.call(zoom);
  }, [gRef.current, width, height]);

  let svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let svg = svgRef.current;
    if (!svg) return;
    for (const element of svg.querySelectorAll("path[data-country-name]")) {
      const path = element as SVGPathElement;
      const name = element.getAttribute("data-country-name");
      if (!name) continue;

      const fillColor = sdg[year][name]
        ? color(
            secondYear !== null
              ? sdg[secondYear][name][goal] - sdg[year][name][goal]
              : sdg[year][name][goal],
          )
        : "#BBBBBB";

      // if (secondYear !== null) {
      //   console.log(name, sdg[secondYear][name][goal] - sdg[year][name][goal]);
      // }

      path.style.fill = fillColor;
    }
  }, [year, secondYear, goal, color, sdg]);

  // update map styling imperatively for performance reasons
  useEffect(() => {
    function updateHover(e: MouseEvent) {
      const tooltip = tooltipRef.current;
      if (!tooltip) return;

      let rect = tooltip.getBoundingClientRect();
      tooltip.style.left = `${e.x - rect.width / 2}px`;
      tooltip.style.top = `${e.y - rect.height}px`;

      for (const element of document.elementsFromPoint(e.x, e.y)) {
        const svg = element as SVGPathElement;
        const name = element.getAttribute("data-country-name");

        if (name) {
          d3.select(svg).raise();
          setHovered(name);
          tooltip.style.opacity = "1";
          svg.style.stroke = "#FFFFFF";
          svg.style.strokeWidth = "2px";
          const oldSvg = hoveredRef.current;
          if (oldSvg && svg != oldSvg) {
            // @ts-ignore
            oldSvg.style.stroke = null;
            // @ts-ignore
            oldSvg.style.strokeWidth = null;
          }
          hoveredRef.current = svg;
          return;
        }
      }
      setHovered(undefined);
      tooltip.style.opacity = "0";

      const oldSvg = hoveredRef.current;
      if (oldSvg) {
        // @ts-ignore
        oldSvg.style.stroke = null;
        // @ts-ignore
        oldSvg.style.strokeWidth = null;
      }
    }
    window.addEventListener("mousemove", updateHover);
    return () => window.removeEventListener("mousemove", updateHover);
  }, [hovered, tooltipRef, mapPaths]);

  return (
    <>
      <div
        className="z-20 absolute opacity-0 bg-black bg-opacity-80 text-white select-none pointer-events-none text-sm p-1 rounded-md"
        ref={tooltipRef}
      >
        {hovered && (
          <>
            <p className="font-bold">{hovered}</p>
            <p>
              {sdg[year][hovered]
                ? secondYear !== null
                  ? (
                      sdg[secondYear][hovered][goal] - sdg[year][hovered][goal]
                    ).toFixed(1)
                  : sdg[year][hovered][goal]
                : "N/A"}
            </p>
          </>
        )}
      </div>
      <svg
        className="absolute"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        ref={svgRef}
      >
        <rect width={"100%"} height={"100%"} fill={"#b5e2ff"} />
        {mapPaths}
      </svg>
    </>
  );
}
