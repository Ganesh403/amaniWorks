import React, { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import { getApiData2, getMultipleLineChartData } from "../../Helpers/helpers";
import { getDataForLastThirtyDays } from "../../Helpers/utils";
import LineChartWrapper from "./LineChartWrapper";
import FilterPanel from "../FiltersPanel";
import {changeWindowUrl} from "../../Helpers/helpers"

import moment from "moment";
import {
  getXAxisLabels,
  getDatesRange,
  getCustomDatesRange,
  getCustomXAxisLabels,
} from "../../Helpers/utils";
import { getDate } from "../../Helpers/helpers";
import Pagination from "../Pagination"

const RechartsLine = ({ queryParam }) => {
  const [queryParams, setQueryParams] = useState({...queryParam,
    limit: 5, // Initial page size
    offset: 0, // Initial offset
  });
  const [siteContent, setSiteContent] = useState([]);
  const [lineChartData, setLineChartData] = useState({});
  const [loading, setLoading] = useState(true);

  const getDates = (data) => {
    if (data.filterType !== "Custom-Date-Range") {
      const { startDate: sD, endDate: eD } = getDate(data.filterType);
      const fromDate = moment(sD).format("YYYY-MM-DDTHH:mm:ss");
      const toDate = moment(eD).format("YYYY-MM-DDTHH:mm:ss");
      return { fromDate, toDate };
    } else {
      const fromDate = moment(data.startDate).format("YYYY-MM-DDTHH:mm:ss");
      const toDate = moment(data.endDate).format("YYYY-MM-DDTHH:mm:ss");
      return { fromDate, toDate };
    }
  };
  const paloadData = (data, from, to) => {
    let query =""
    switch (data.typeId) {
      case "hdr3e052887f36beb1191050050569c12e3Historical":
        query = `query {
      ${queryParams.typeId}(
        siteIds: ${queryParams.siteId},
        limit: ${queryParams.limit},
        offset: ${queryParams.offset},
        startDate:"${from}",
        endDate:"${to}" 
      ) {
        LegacyID { value }
        SiteId
        Name
        EntityId
        ${queryParams.propKeys.map((key)=>{
          return key + `{ timestamp, value, unit }`
        })}
       
      }
    }`
        break;
      case "baseSiteobjectTemperaturehistorical":
        query = `query {
          baseSiteobjectFlowhistorical(
            siteIds: ${data.siteId},
            limit: 10,
            offset: 0,
            startDate:"${from}",
            endDate:"${to}" 
          ) {
            LegacyID { value }
            SiteId
            Name
            EntityId
            Rate { timestamp, value, unit }
            Grand { timestamp, value, unit }
            Today { timestamp, value, unit }
            Yesterday { timestamp, value, unit }
          }
        }`
        break;
      case "baseSiteobjectGashistorical":
        console.log("baseSiteobjectGashistorical");
        break;
      case "baseSiteobjectLevelhistorical":
        console.log("baseSiteobjectLevelhistorical");
        break;
      case "baseSiteobjectPressurehistorical":
        console.log("baseSiteobjectPressurehistorical");
        break;
      default:
        console.log("Unknown fruit.");
    }
    return query
  };
  console.log(queryParams, "par");
  const fetchData = async () => {
    try {
      setLoading(true);
      const { fromDate, toDate } = getDates(queryParams);
      setLineChartData({})
      const pLoad = paloadData(queryParams, fromDate, toDate);
      console.log(pLoad, "pload");

      const response = await axios.get("../sample.json");

      console.log(response,fromDate,toDate,"response");
      const data = response.data;

      
      if(response){
        changeWindowUrl({...queryParams,show:"true"})
      }
      const data1 = getApiData2(data[queryParams.typeId], queryParams);
      const chartData = getMultipleLineChartData(data1, queryParams);
      setLineChartData(chartData);
      setLoading(false);
    } catch (error) {
      console.error(error,"error");
      changeWindowUrl({...queryParams,show:"false"})
    }
  };
  //   const fetchData = async () => {
  //     try {
  //         // Set the authentication token
  //         const token = await authService.getAccessToken();
  //         console.log(token, "token");

  //         // Set the headers
  //         const  headers = {
  //             Authorization: `Bearer ${token}`,
  //         };
  //         const response = await axios.get("https://graphql.tanklogix.com", {
            // query: `query {
            //   ${data.typeId}(
            //     siteIds: ${data.siteId},
            //     limit: ${data.limit},
            //     offset: ${data.offset},
            //     startDate:"${from}",
            //     endDate:"${to}" 
            //   ) {
            //     LegacyID { value }
            //     SiteId
            //     Name
            //     EntityId
            //     ${data.propKeys.map((key)=>{
            //       return key + `{ timestamp, value, unit }`
            //     })}
               
            //   }
            // }`
  //         },
  //         {
  //             headers
  //         });
  //         const data = response.data;
  //         setSiteContent(data[queryParams.typeId] || []);
  //     } catch (error) {
  //         console.error(error);
  //     }
  // };
  // useEffect(() => {
  //   getDates(queryParams);
  // }, [queryParams]);
  useEffect(() => {
    fetchData();
  }, [queryParams]);
  // useEffect(() => {
  //   const data = getApiData2(siteContent, queryParams);
  //   const chartData = getMultipleLineChartData(data, queryParams);
  //   setLineChartData(chartData);
  // }, [siteContent, queryParams]);

  const handleFilterChange = (updatedQueryParams) => {
    setQueryParams(updatedQueryParams);
  };
  console.log(lineChartData, "line");
  const LazyLineChartWrapper = lazy(() => import("./LineChartWrapper"));
  return (
    <div className="lineChartSite_container">
      {/* <FilterPanel
        onFilterChange={handleFilterChange}
        queryParams={queryParams}
      /> */}
     {loading ? (<div className="lazy-loading">
     <div className="loader"></div>loading....</div>)
     :(
      <Suspense fallback={<div className="lazy-loading">loading....</div>}>
      {Object.keys(lineChartData).map((siteName, index) => (
  
        <div key={index}>

            <LazyLineChartWrapper
              lineChartData={lineChartData[siteName].values}
              completeLineData={lineChartData[siteName]}
              queryParams={queryParams}
              siteName={siteName}
            />
          
        </div>
      ))}
      </Suspense>
     )} 

     {lineChartData && <Pagination
        onFilterChange={handleFilterChange}
        queryParams={queryParams}
      />}
    </div>
  );
};

export default RechartsLine;
