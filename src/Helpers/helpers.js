import moment from "moment";

import {
  NINETY_MINUTES_VALUE,
  TWELVE_HOURS_VALUE,
  TWENTY4_HOURS_VALUE,
  SEVEN_DAYS_VALUE,
  THIRTY_DAYS_VALUE,
  CUSTOM_DATE_RANGE_VALUE,
  zoomLevels,
  SIX_HOURS_VALUE,
  THREE_HOURS_VALUE,
  FIFTEEN_DAYS_VALUE,
  FORTY_FIVE_MINUTES_VALUE,
  TWENTY_TWO_MINUTES_VALUE,
  ELEVEN_MINUTES_VALUE,
  SIX_MINUTES_VALUE,
  THREE_MINUTE_VALUE,
  THREE_DAYS_VALUE,
  TWO_DAYS_VALUE,
  ONE_MINUTE_VALUE
} from "./constants";
import { filter } from "d3";


export const getDatesRange = (filterType, eDate) => {
  switch (filterType) {
    case THIRTY_DAYS_VALUE:
      return { startDate: moment(eDate).subtract(30, "days"), endDate: moment(eDate) };
    case FIFTEEN_DAYS_VALUE:
      return { startDate: moment(eDate).subtract(22, "days"), endDate:  moment(eDate).subtract(7, "days") };
    case SEVEN_DAYS_VALUE:
      return { startDate: moment(eDate).subtract(10, "days"), endDate: moment(eDate).subtract(3, "days") };
    case THREE_DAYS_VALUE:
      return { startDate: moment(eDate).subtract(5, "days"), endDate: moment(eDate).subtract(2, "days") };
    case TWO_DAYS_VALUE:
      return { startDate: moment(eDate).subtract(2, "days"), endDate: moment(eDate).subtract(1, "days") };
    case TWENTY4_HOURS_VALUE:{
      const endDate = moment(eDate).subtract(12, "hours");
      const startDate = moment(eDate).subtract(36, "hours");
      return { startDate, endDate };
    }
    case TWELVE_HOURS_VALUE: {
      const endDate = moment(eDate).subtract(360, "minutes");
      // const endDate = moment(eDate).subtract(15, "days");
      const startDate = moment(eDate).subtract(1080, "minutes");//.subtract(12, "hours");
      return { startDate, endDate };
    }
    case SIX_HOURS_VALUE:
      const endDate = moment(eDate).subtract(180, "minutes");
      const startDate = moment(eDate).subtract(540, "minutes");
      return { startDate, endDate };
    case THREE_HOURS_VALUE: {
      const endDate = moment(eDate).subtract(90, "minutes");
      const startDate = moment(eDate).subtract(270, "minutes");
      return { startDate, endDate };
    }
    case NINETY_MINUTES_VALUE:
      {
        const endDate = moment(eDate).subtract(45, "minutes");
      const startDate = moment(eDate).subtract(135, "minutes");
      return { startDate, endDate };
      }
    case FORTY_FIVE_MINUTES_VALUE:{
      const endDate = moment(eDate).subtract(22, "minutes");
    const startDate = moment(eDate).subtract(67, "minutes");
    return { startDate, endDate };
    }
    case TWENTY_TWO_MINUTES_VALUE:{
      const endDate = moment(eDate).subtract(12, "minutes");
    const startDate = moment(eDate).subtract(34, "minutes");
    return { startDate, endDate };
    }
    case ELEVEN_MINUTES_VALUE: {
      const endDate = moment(eDate).subtract(5, "minutes");
    const startDate = moment(eDate).subtract(16, "minutes");
    return { startDate, endDate };
    }
    case SIX_MINUTES_VALUE:{
      const endDate = moment(eDate).subtract(3, "minutes");
    const startDate = moment(eDate).subtract(9, "minutes");
    return { startDate, endDate };
    }
    case THREE_MINUTE_VALUE:{
      const endDate = moment(eDate).subtract(1, "minutes");
    const startDate = moment(eDate).subtract(4, "minutes");
    return { startDate, endDate };
    }
    case ONE_MINUTE_VALUE: {
      const endDate = moment(eDate).subtract(2, "minutes");
      return { startDate: moment(eDate).subtract(3, "minutes"), endDate};
    }
    default:
      return [];
  }
}

export const getMissingDaysArray = (startDate, stopDate) => {
  var dateArray = [];
  var currentDate = moment(startDate);
  var endDate = moment(stopDate);
  while (currentDate <= endDate) {
    dateArray.push({
      timestamp: moment(currentDate).format("YYYY-MM-DD") + "T00:00:00",
      displayLabel: moment(currentDate).format("MMM YY"),
    });
    currentDate = moment(currentDate).add(1, "days");
  }
  return dateArray;
};

export const getModifiedDataforBiaxialLineChart = (
  totalData,
  isMoreThanAMonth
) => {
  return (totalData || []).map((item) => {
    const date = moment(item.timestamp).toDate();
    item.name = item.timestamp;
    item.displayLabel = isMoreThanAMonth
      ? moment(date).format("MMM YYYY")
      : moment(date).format("MMM-DD");
    return item;
  });
};

export const getfilterData = ({ startDate, endDate, data, format ,filterType }) => {
    const start = moment(startDate).toDate();
    const end = moment(endDate).toDate();
    const values = (data || []).reduce(function (filtered, item) {
        const date = moment(item.timestamp).toDate();
        if (date >= start && date <= end) {
          const sample = {
            ...item,
            timestamp: date,
            name: moment(item.timestamp).format(format),
            displayLabel: moment(item.timestamp).format(format),
          };
          filtered.push(sample);
        }
        return filtered;
      }, []);
     return values;
  
};
export const displayDate = (
  selectedFilter,
  startDate,
  endDate,
  filterStartDate,
  filterEndDate
) => {
  if (!selectedFilter) return "Date";
  if (selectedFilter === CUSTOM_DATE_RANGE_VALUE && startDate && endDate) {
    return `Date [${moment(startDate).format("MMM")} ${moment(
      startDate
    ).date()}${
      !moment(moment(startDate).format("YYYY-MM-DD")).isSame(
        moment(endDate).format("YYYY-MM-DD")
      )
        ? `-${moment(endDate).date()}`
        : ""
    } , ${moment(startDate).year()}]`;
  }
  if (selectedFilter === NINETY_MINUTES_VALUE) {
    return `Date [${moment(filterStartDate).format("MMM")} ${moment(
      filterStartDate
    ).date()}  , ${moment(filterStartDate || filterEndDate).year()}]`;
  }
  if (selectedFilter === THIRTY_DAYS_VALUE) {
    return `Date [${moment().subtract(30, 'days').format('MMM-DD')} -${moment().format('MMM-DD')}  , ${moment().year()}]`;
  }
  if (selectedFilter === SEVEN_DAYS_VALUE) {
    return `Date [${moment().subtract(7, 'days').format('MMM-DD')} -${moment().format('MMM-DD')}  , ${moment().year()}]`;
  }
  if (
    selectedFilter === TWENTY4_HOURS_VALUE ||
    selectedFilter === TWELVE_HOURS_VALUE
  ) {
    return `Date [${moment(filterStartDate).format("MMM")} ${moment(
      filterEndDate
    ).date()}${
      !moment(moment(filterStartDate).format("YYYY-MM-DD")).isSame(
        moment(filterEndDate).format("YYYY-MM-DD")
      )
        ? `-${moment(filterStartDate).date()}`
        : ""
    } , ${moment(filterEndDate).year()}]`;
  } else return `Date [${moment(filterStartDate).format("MMM")} ${moment(
    filterEndDate
  ).date()}${
    !moment(moment(filterStartDate).format("YYYY-MM-DD")).isSame(
      moment(filterEndDate).format("YYYY-MM-DD")
    )
      ? `-${moment(filterStartDate).date()}`
      : ""
  } , ${moment(filterEndDate).year()}]`;
};

export const getApiData = (siteContent, queryParams) => {
  const { propKeys = [] } = queryParams;
  const siteNames = {};
  let Name = "";
  siteContent.forEach((site) => {
    propKeys.forEach((prop) => {
      siteNames[prop] = site[prop] || [];
    });
    Name = site.Name;
  });

  const values = siteNames;
  const lists = Object.keys(siteNames);
  const listItems = {};
  const arr = [];
  const timeStampObj = {};
  const timeStampArr = [];
  lists.forEach((listItem) => {
    listItems[listItem] = {};
    values[listItem].forEach((i) => {
      if (timeStampObj[i.timestamp]) {
        const index = timeStampArr.indexOf(i.timestamp);
        const item = arr[index];
        item[listItem + "-value"] = +Number(i.value)?.toFixed(2);
        item[listItem + "-unit"] = i?.unit || "";
        arr[index] = item;
      } else {
        arr.push({
          timestamp: i.timestamp,
          [listItem + "-value"]: +Number(i.value)?.toFixed(2),
          [listItem + "-unit"]: i?.unit || "",
          displayLabel: "jan",
        });
        timeStampArr.push(i.timestamp);
        timeStampObj[i.timestamp] = i.timestamp;
      }
    });
  });
  siteNames.arr = arr;
  siteNames.Name = Name;
  return siteNames;
};

export const getApiData2 = (siteContent, queryParams) => {
  const { propKeys = [] } = queryParams;
  const siteNames = {};
  siteContent.forEach((site) => {
    siteNames[site.Name] = {};
    propKeys.forEach((prop) => {
      siteNames[site.Name][prop] = site[prop] || [];
    });
  });
  Object.keys(siteNames).forEach((siteName) => {
    const values = siteNames[siteName];
    const lists = Object.keys(values);
    const listItems = {};
    const arr = [];
    const timeStampObj = {};
    const timeStampArr = [];
    lists.forEach((listItem) => {
      listItems[listItem] = {};
      values[listItem].forEach((i) => {
        if (timeStampObj[i.timestamp]) {
          const index = timeStampArr.indexOf(i.timestamp);
          const item = arr[index];
          item[listItem + "-value"] = +Number(i.value)?.toFixed(2);
          item[listItem + "-unit"] = i?.unit || "";
          arr[index] = item;
        } else {
          arr.push({
            timestamp: i.timestamp,
            [listItem + "-value"]: +Number(i.value)?.toFixed(2),
            [listItem + "-unit"]: i?.unit || "",
            displayLabel: "jan",
          });
          timeStampArr.push(i.timestamp);
          timeStampObj[i.timestamp] = i.timestamp;
        }
      });
    });
    siteNames[siteName] = { ...siteNames[siteName], arr };
  });
  return siteNames;
};

export const getLineChartData = (siteData, queryParams) => {
  const { startDate, endDate, entityId, filterType, siteId } = queryParams;
  let values = [];
  const totalData = [];
  let filterStartDate = null;
  let filterEndDate = null;
  if (!(entityId && filterType) && !(siteId && filterType))
    return { values, filterStartDate, filterEndDate };

  if (filterType === CUSTOM_DATE_RANGE_VALUE && startDate && endDate) {
    siteData.forEach((siteItem) => {
      totalData.push(siteItem);
    });
    const isMoreThanAMonth =
      moment(startDate).format("YYYY-MMM") ===
      moment(endDate).format("YYYY-MMM")
        ? false
        : true;
    const updatedData = getModifiedDataforBiaxialLineChart(
      totalData,
      isMoreThanAMonth
    );
    values = [...updatedData];
  } else if (
    filterType === SEVEN_DAYS_VALUE ||
    filterType === THIRTY_DAYS_VALUE
  ) {
    const startTime = moment()
      .subtract(filterType === THIRTY_DAYS_VALUE ? 30 : 7, "days")
      .toDate();
    const endTime = moment().toDate();
    filterStartDate = startTime;
    filterEndDate = endTime;
    values = getfilterData({
      startDate: startTime,
      endDate: endTime,
      data: siteData || [],
      format: "yyyy-MM-DDTHH:mm:ss",
    });
  } else if (filterType === TWELVE_HOURS_VALUE) {
    const startTime = moment().subtract(12, "hours").toDate();
    const endTime = moment().toDate();
    filterStartDate = startTime;
    filterEndDate = endTime;

    values = getfilterData({
      startDate: startTime,
      endDate: endTime,
      data: siteData || [],
      format: "yyyy-MM-DDTHH:mm:ss",
    });
  } else if (filterType === NINETY_MINUTES_VALUE) {
    const currentTime = moment().toDate();
    const endTime = currentTime;
    const startTime = moment(currentTime).subtract(61, "minutes").toDate();

    filterStartDate = startTime;
    filterEndDate = endTime;
    values = getfilterData({
      startDate: startTime,
      endDate: endTime,
      data: siteData || [],
      format: "yyyy-MM-DDTHH:mm:ss",
    });
  } else if (filterType === TWENTY4_HOURS_VALUE) {
    const startTime = moment().subtract(24, "hours").toDate();
    const endTime = moment().toDate();
    filterStartDate = startTime;
    filterEndDate = endTime;

    values = getfilterData({
      startDate: startTime,
      endDate: endTime,
      data: siteData || [],
      format: "yyyy-MM-DDTHH:mm:ss",
    });
  }
  return { values, filterStartDate, filterEndDate };
};

export const getZoomInData = (startDate, endDate, data, zoomLevel, filterType) => {
  let sD = startDate;
  let eD = endDate;
  if(!startDate && !endDate) {
    const {startDate, endDate} = getDate(filterType);
    sD = startDate;
    eD = endDate;
  }
  return getfilterData({
    startDate: sD,
    endDate: eD,
    data,
        filterType
  });
};
export const getDate = (selectedFilter) => {
    if (selectedFilter === THIRTY_DAYS_VALUE) {
      const startDate = moment().subtract(30, 'days').format('yyyy-MM-DDTHH:mm:ss');
      const endDate = moment().format('yyyy-MM-DDTHH:mm:ss');
      return { startDate, endDate };
    }else if (selectedFilter === SEVEN_DAYS_VALUE) {
      const startDate = moment().subtract(7, 'days').format('yyyy-MM-DDTHH:mm:ss');
      const endDate = moment().format('yyyy-MM-DDTHH:mm:ss');
      return { startDate, endDate };
    }else if (selectedFilter === TWENTY4_HOURS_VALUE) {
      const startDate = moment().subtract(24, 'hours').format('yyyy-MM-DDTHH:mm:ss');
      const endDate = moment().format('yyyy-MM-DDTHH:mm:ss');
      return { startDate, endDate };
    }else if (selectedFilter === TWELVE_HOURS_VALUE) {
      const startDate = moment().subtract(12, 'hours').format('yyyy-MM-DDTHH:mm:ss');
      const endDate = moment().format('yyyy-MM-DDTHH:mm:ss');
      return { startDate, endDate };
    }else if (selectedFilter === TWELVE_HOURS_VALUE) {
      const startDate = moment().subtract(12, 'hours').format('yyyy-MM-DDTHH:mm:ss');
      const endDate = moment().format('yyyy-MM-DDTHH:mm:ss');
      return { startDate, endDate };
    }else{
      const startDate = moment().subtract(1, 'hours').format('yyyy-MM-DDTHH:mm:ss');
      const endDate = moment().format('yyyy-MM-DDTHH:mm:ss');
      return { startDate, endDate };
    }
  
  };

export const getCustomZoomInData = (startDate, endDate, data) => {
  const format = getFormatbasedOnSelectedFilter({
    filterType: CUSTOM_DATE_RANGE_VALUE,
    startDate,
    endDate,
  });
  return getfilterData({ startDate, endDate, data, format: format });
};

export const getMultipleLineChartData = (siteData, queryParams) => {
  Object.keys(siteData).forEach((siteName) => {
    const { values } = getLineChartData(siteData[siteName].arr, queryParams);
    siteData[siteName]["values"] = values;
  });
  return siteData;
};

export const getToolTipFormatDate = ({
  selectedFilter,
  endDate,
  startDate,
  date,
}) => {
  if (
    selectedFilter === CUSTOM_DATE_RANGE_VALUE &&
    moment(startDate).format("MMM YY") === moment(endDate).format("MMM YY")
  )
    return moment(date).format("MM/DD/YYYY");
  if (
    selectedFilter === CUSTOM_DATE_RANGE_VALUE &&
    moment(startDate).format("MMM YY") !== moment(endDate).format("MMM YY")
  )
    return moment(date).format("MM/DD/YYYY");
  else return date;
};

export const getFormatbasedOnSelectedFilter = ({
  filterType,
  startDate,
  endDate,
}) => {
  if (
    filterType === CUSTOM_DATE_RANGE_VALUE &&
    moment(startDate).format("MMM YY") === moment(endDate).format("MMM YY")
  )
    return "MMM DD";
  if (
    filterType === CUSTOM_DATE_RANGE_VALUE &&
    moment(startDate).format("MMM YY") !== moment(endDate).format("MMM YY")
  )
    return "MMM YY";
  else return null;
};

export const changeWindowUrl = (options) => {
  console.log(options,"datttt");
  if (options.filterType !== "Custom-Date-Range") {
    const url = new URL(window.location);
  Object.keys(options).forEach(function (key) {
    url.searchParams.set(key, options[key]);
  });

  window.history.pushState({}, document.title, url);
    const paramNames = ['startDate', 'endDate'];
    const searchParams = new URLSearchParams(window.location.search);

    paramNames.forEach((paramName) => {
      searchParams.delete(paramName);
    });

    const newSearch = searchParams.toString();

    const newUrl = `${window.location.origin}${window.location.pathname}${newSearch ? `?${newSearch}` : ''}`;
    window.history.replaceState(null, '', newUrl);
  }else{
  const url = new URL(window.location);
  
  Object.keys(options).forEach(function (key) {
    url.searchParams.set(key, options[key]);
  });
  window.history.pushState({}, document.title, url);
}
};
