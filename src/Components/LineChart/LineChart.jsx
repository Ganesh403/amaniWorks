import { useState,useEffect } from "react";
import LineChartEntity from './LineChartEntity';
import LineChartSite from './LineChartSite';

const RechartsLine = () => {
  const [queryParams] = useState(
    window.location.search
      ? window.location.search
          .slice(1)
          .split("&")
          .map((p) => p.split("="))
          .reduce(
            (obj, pair) => {
              const [key, value] = pair.map(decodeURIComponent);
              if (key === "propKeys") obj[key] = value.split(",");
              else obj[key] = value;
              return obj;
            },
            { propKeys: [] }
          )
      : {}
  );
  
  
  return (<>
  {
    !!queryParams.entityId ? <LineChartEntity queryParam={queryParams} /> : <LineChartSite queryParam={queryParams}/>
  }</>
  );
};

export default RechartsLine;
