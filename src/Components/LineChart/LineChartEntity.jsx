import React, { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import { getApiData, getLineChartData } from "../../Helpers/helpers";
import { getApiData2, getMultipleLineChartData } from "../../Helpers/helpers";
import LineChartWrapper from "./LineChartWrapper";
import {getDataForEntityLastThirtyDays} from '../../Helpers/utils';
import { getDate } from "../../Helpers/helpers";
import moment from "moment";
import Pagination from "../Pagination"

const RechartsLine = ({queryParam}) => {
  const [queryParams, setQueryParams] = useState({...queryParam,
    limit: 5, // Initial page size
    offset: 0, // Initial offset
  });
  const [lineChartData, setLineChartData] = useState({});

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
    switch (data.typeId) {
        case "baseSiteobjectFlowhistorical":
            const query = ` query {
  baseSiteobjectFlowhistorical(
    entityId: "${data.entityId}",
    limit: ${data.limit},
        offset: ${data.offset},
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
            return query

            break;
        case "baseSiteobjectTemperaturehistorical":
            const query1 = ` query {
  baseSiteobjectTemperaturehistorical(
    entityId: ${data.entityId},
    limit: ${data.limit},
        offset: ${data.offset},
    startDate:"${from}",
    endDate:"${to}" 
  ) {
    LegacyID { value }
    SiteId
    Name
    EntityId
    Temperature { timestamp, value, unit }
  }
}`
            return query1
            break;
        case "baseSiteobjectGashistorical":
            const query2 = ` query {
  baseSiteobjectGashistorical(
    entityId: ${data.entityId},
    limit: ${data.limit},
    offset: ${data.offset},
    startDate:"${from}",
    endDate:"${to}" 
  ) {
    LegacyID { value }
    SiteId
    Name
    EntityId
    Gas { timestamp, value, unit }
  }
}`
            return query2
            break;
        case "baseSiteobjectLevelhistorical":
            const query3 = ` query {
  baseSiteobjectLevelhistorical(
    entityId: ${data.entityId},
    limit: ${data.limit},
        offset: ${data.offset},
    startDate:"${from}",
    endDate:"${to}" 
  ) {
    LegacyID { value }
    SiteId
    Name
    EntityId
    TopLevel { timestamp, value, unit }
    BottomLevel { timestamp, value, unit }
    TopVolume { timestamp, value, unit }
    BottomVolume { timestamp, value, unit }
  }
}`
            return query3
            break;
        case "baseSiteobjectPressurehistorical":
            const query4 = ` query {
  baseSiteobjectPressurehistorical(
    entityId: ${data.entityId},
    limit: ${data.limit},
    offset: ${data.offset},
    startDate:"${from}",
    endDate:"${to}" 
  ) {
    LegacyID { value }
    SiteId
    Name
    EntityId
    Pressure { timestamp, value, unit }
  }
}`
            return query4
            break;
        case "baseSiteobjectDiscretevalvehistorical":
            const query5 = ` query {
  baseSiteobjectDiscretevalvehistorical(
    entityId: ${data.entityId},
    limit: ${data.limit},
    offset: ${data.offset},
    startDate:"${from}",
    endDate:"${to}" 
  ) {
    LegacyID { value }
    SiteId
    Name
    EntityId
    Manual { timestamp, value, unit }
    Open { timestamp, value, unit }
    Opened { timestamp, value, unit }
    Closed { timestamp, value, unit }
  }
}`
            return query5

            break;
        case "baseSiteobjectProportionatevalvehistorical":
            const query6 = ` query {
  baseSiteobjectProportionatevalvehistorical(
    entityId: "${data.entityId}",
    limit: ${data.limit},
    offset: ${data.offset},
    startDate:"${from}",
    endDate:"${to}" 
  ) {
    LegacyID { value }
    SiteId
    Name
    EntityId
    Command { timestamp, value, unit }
    Feedback { timestamp, value, unit }
    Manual { timestamp, value, unit }
  }
}`
            return query6

            break;
        case "baseSiteobjectPumphistorical":
            const query7 = ` query {
  baseSiteobjectPumphistorical(
    entityId: ${data.entityId},
    limit: ${data.limit},
    offset: ${data.offset},
    startDate:"${from}",
    endDate:"${to}" 
  ) {
    LegacyID { value }
    SiteId
    Name
    EntityId
    Run { timestamp, value, unit }
    Running { timestamp, value, unit }
    Manual { timestamp, value, unit }
    RunPercent { timestamp, value, unit }
    StartLevel { timestamp, value, unit }
    StopLevel { timestamp, value, unit }
    IntakePressure { timestamp, value, unit }
    DischargePressure { timestamp, value, unit }
  }
}`
            return query7
        case "baseSiteobjectWellhistorical":
            const query8 = ` query {
  baseSiteobjectWellhistorical(
    entityId: ${data.entityId},
    limit: ${data.limit},
    offset: ${data.offset},
    startDate:"${from}",
    endDate:"${to}" 
  ) {
    LegacyID { value }
    SiteId
    Name
    EntityId
    CasingPressure { timestamp, value, unit }
    TubingPressure { timestamp, value, unit }
    DownholePressure { timestamp, value, unit }
    DownholeTemperature { timestamp, value, unit }
  }
}`
            return query8
            break;
        default:
            console.log("Unknown Page.");
    }
};
//  const fetchData = async () => {
//         try {
//             // Set the authentication token
//             const { fromDate, toDate } = getDates(queryParams);
//             setLineChartData({})
//             const query = paloadData(queryParams, fromDate, toDate);
//             const token = await authService.getAccessToken();
//             // Set the headers
//             const headers = {
//                 Authorization: `Bearer ${token}`,
//             };
//             const response = await axios.post(
//                 "https://graphql.tanklogix.com",
//                 {
//                     query
//                 },
//                 {
//                     headers,
//                 }
//             );
//             const data = response.data.data;
//             setSiteContent(data);
//             const siteContentData = getApiData2(
//                 data[queryParams.typeId],
//                 queryParams
//             );
//             const chartData = getMultipleLineChartData(siteContentData, queryParams);
//             setLineChartData(chartData);
//         } catch (error) {
//             console.error(error);
//         }
//     };
  const fetchData = async () => {
    try {
      const { fromDate, toDate } = getDates(queryParams);
      setLineChartData({})
      const pLoad = paloadData(queryParams, fromDate, toDate);
      console.log(pLoad, "pload");
      const response = await axios.get("../sample.json");
      const data = response.data;
      console.log(queryParams, "par");
      const data1 = getApiData2(data[queryParams.typeId], queryParams);
      const chartData = getMultipleLineChartData(data1, queryParams);
      setLineChartData(chartData);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [queryParams]);
  // const siteContent = queryParams.typeId
  // ? getDataForEntityLastThirtyDays().data[queryParams.typeId] 
  // : [];
  // const data = getApiData(siteContent, queryParams);
  // const arr = data.arr;
  // const { values = [] } = getLineChartData(arr, queryParams);
  // console.log(values,"val");
  const handleFilterChange = (updatedQueryParams) => {
    setQueryParams(updatedQueryParams);
  };
  const LazyLineChartWrapper = lazy(() => import("./LineChartWrapper"));
  return (
    <div className="lineChartSite_container">
      <div >
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
      <Pagination
        onFilterChange={handleFilterChange}
        queryParams={queryParams}
      />
        {/* <LineChartWrapper
        // lineChartData={lineChartData[siteName].values}
        // completeLineData={lineChartData[siteName]}
          siteName={data.Name}
          lineChartData={values}
          queryParams={queryParams}
        /> */}
      </div>
    </div>
  );
};

export default RechartsLine;
