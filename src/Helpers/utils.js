import moment from "moment";
import {
  NINETY_MINUTES_VALUE,
  TWELVE_HOURS_VALUE,
  SEVEN_DAYS_VALUE,
  THIRTY_DAYS_VALUE,
  TWENTY4_HOURS_VALUE,
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
  ONE_MINUTE_VALUE,
  CUSTOM_DATE_RANGE_VALUE
} from "./constants";

import {getFormatbasedOnSelectedFilter} from './helpers';

export const getXAxisLabels = (selectedFilter, endDate = moment()) => {
  switch (selectedFilter) {
    case THIRTY_DAYS_VALUE:
      return getDisplayLabelsForDays(endDate, 5, 7, 0);
    case FIFTEEN_DAYS_VALUE:
      return getDisplayLabelsForDays(endDate, 3, 7, 7);
    case SEVEN_DAYS_VALUE:
      return getDisplayLabelsForDays(endDate, 4, 2, 12);
    case THREE_DAYS_VALUE:
      return getDisplayLabelsForDays(endDate, 4, 1, 14);
    case TWO_DAYS_VALUE:
      return getDisplayLabelsForDays(endDate, 2, 1, 15);
    case TWENTY4_HOURS_VALUE: {
      // const endValue = moment(endDate).subtract(15, "days");
      return getDisplayLabelsForHours2(24, 4, 6, 0, endDate);
    }
    case TWELVE_HOURS_VALUE: {
      // const endValue = moment(endDate).subtract(15, "days").subtract(360, "minutes");
      return getDisplayLabelsForHours2(24, 6, 2, 0, endDate);
    }
    case SIX_HOURS_VALUE: {
      // const endValue = moment(endDate).subtract(15, "days").subtract(540, "minutes");
      return getDisplayLabelsForHours2(24, 3, 2, 0, endDate);
    }
    case THREE_HOURS_VALUE: {
      // const endValue = moment(endDate).subtract(15, "days").subtract(630, "minutes");
      return getDisplayLabelsForHours2(24, 3, 2, 0, endDate);
    }
    case NINETY_MINUTES_VALUE: {
      // const endValue = moment(endDate).subtract(15, "days").subtract(675, "minutes");
      return getDisplayLabelsForHour(4, 30, 0, endDate);
    }
    case FORTY_FIVE_MINUTES_VALUE: {
      // const endValue = moment(endDate).subtract(15, "days").subtract(697, "minutes");
      return getDisplayLabelsForHour(3, 15, 0, endDate);
    }
    case TWENTY_TWO_MINUTES_VALUE: {
      const endValue = moment(endDate).subtract(15, "days").subtract(709, "minutes");
      return getDisplayLabelsForHour(2, 10, 0, endValue);
    }
    case ELEVEN_MINUTES_VALUE: {
      const endValue = moment(endDate).subtract(15, "days").subtract(714, "minutes");
      return getDisplayLabelsForHour(3, 5, 0, endValue);
    }
    case SIX_MINUTES_VALUE: {
      const endValue = moment(endDate).subtract(15, "days").subtract(717, "minutes");
      return getDisplayLabelsForHour(3, 2, 0, endValue);
    }
    case THREE_MINUTE_VALUE: {
      const endValue = moment(endDate).subtract(15, "days").subtract(718, "minutes");
      return getDisplayLabelsForHour(3, 1, 0, endValue);
    }
    case ONE_MINUTE_VALUE: {
      const endValue = moment(endDate).subtract(15, "days").subtract(719, "minutes");
      return getDisplayLabelsForSeconds(3, 30, 0, endValue);
    }
    default:
      return [];
  }
};

export const getDatesRange = (filterType, eDate) => {
  console.log(filterType,eDate,"ut");
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

const getDisplayLabelsForHour = (count, minutes, hoursToAdd, endDate) => {
  const dataLabels = [];
  let computedDate = moment(endDate).add(hoursToAdd, "hours");
  while (dataLabels.length < count) {
    dataLabels.push(computedDate.format("hh:mm A"));
    computedDate.subtract(minutes, "minutes");
  }
  return dataLabels.reverse();
};

const getDisplayLabelsForSeconds = (count, seconds, hoursToAdd, endDate) => {
  const dataLabels = [];
  let computedDate = moment(endDate).add(hoursToAdd, "hours");
  while (dataLabels.length < count) {
    dataLabels.push(computedDate.format("hh:mm:ss A"));
    computedDate.subtract(seconds, "seconds");
  }
  return dataLabels.reverse();
};

const getDisplayLabelsForDays = (sD, countOfLabels, daysToAdd, daysToSubtract) => {
  const dataLabels = [];
  let startdate = moment(sD);
  while (dataLabels.length < countOfLabels) {
    dataLabels.push(startdate.format("MMM DD"));
    startdate.subtract(daysToAdd, "days");
  }
  return dataLabels;
};

const getDisplayLabelsForHours2 = (noOfHours, countOfLabels, hoursToSubtract, hoursToAdd, startDate) => {
  const dataLabels = [];
  let computedDate = moment(startDate).add(hoursToAdd, "hours");
  while (dataLabels.length < countOfLabels) {
    // add the formatted time value to the array
    dataLabels.push(computedDate.format("hh A"));
    computedDate.subtract(hoursToSubtract, "hours");
  }
  return dataLabels.reverse();
};

const getthirtyData = () => {
  const currentDate = moment().add(5, "minutes");
  const data = [];
  const startdate = moment().subtract(90, "days");
  while (currentDate >= startdate) {
    data.push({
      timestamp: moment(startdate).format('YYYY-MM-DDTHH:mm:ss'),
      value: Number(Math.random() * 1000),
      unit: "bbl"
    });
    startdate.add(1, "hour");
  }
  return data;
}
const getthirtyData1 = () => {
  const currentDate = moment().add(5, "minutes");
  const data = [];
  const startdate = moment().subtract(90, "days");
  while (currentDate >= startdate) {
    data.push({
      timestamp: moment(startdate).format('YYYY-MM-DDTHH:mm:ss'),
      value: Number(Math.random() * 10),
      unit: "bbl"
    });
    startdate.add(1, "hour");
  }
  return data;
}
const getOneDayData = () => {
  const currentDate = moment().add(5, "minutes");
  const data = [];
  const startdate = moment().subtract(1, "days");
  while (currentDate >= startdate) {
    data.push({
      timestamp: moment(startdate).format('YYYY-MM-DDTHH:mm:ss'),
      value: Number(Math.random() * 1000),
      unit: "bbl"
    });
    startdate.add(1, "seconds");
  }
  return data;
}

export const getDataForLastThirtyDays = () => {

  const completeData = {
    "data": {
      "baseSiteobjectFlowhistorical": [
        {
          "LegacyID": [
            {
              "value": "5054"
            }],
          "SiteId": "31818",
          "Name": "Costanza 4847 WA Meter",
          "EntityId": "05906D40-036C-EB11-9105-0050569C12E3",
          "Rate": getthirtyData(),
          "Grand": getthirtyData1(),
        },
        {
          "LegacyID": [
            {
              "value": "5054"
            }],
          "SiteId": "31818",
          "Name": "Costanza2 4847 WA Water Meter",
          "EntityId": "05906D40-036C-EB11-9105-0050569C12E3",
          "Grand": getthirtyData(),
        }
      ]
    }
  };
  return completeData;
};

export const getDataForEntityLastThirtyDays = () => {

  const completeData = {
    "data": {
      "baseSiteobjectFlowhistorical": [
        {
          "LegacyID": [
            {
              "value": "5054"
            }],
          "SiteId": "31818",
          "Name": "Costanza 4847 WA Water Meter",
          "EntityId": "05906D40-036C-EB11-9105-0050569C12E3",
          "Rate": getthirtyData(),
        }
        // {
        //   "LegacyID": [
        //     {
        //       "value": "5054"
        //     }],
        //   "SiteId": "31818",
        //   "Name": "Costanza2 4847 WA Water Meter",
        //   "EntityId": "05906D40-036C-EB11-9105-0050569C12E3",
        //   "Grand": getthirtyData(),
        // }
      ]
    }
  };
  return completeData;
};



export const getCustomDatesRange = (customStartDate, customEndDate) => {
  console.log(customStartDate,customEndDate,"customEndDate");
  const sd = moment(customStartDate);
  const ed = moment(customEndDate);
  const diff = ed.diff(sd, 'days');
  const oneForth = diff / 4;
  const endDate = ed.subtract(oneForth, 'days');
  const startDate = sd.add(oneForth, 'days');
  const isSameDay =  moment(startDate).format("YYYY-MMM-DD") ===
  moment(endDate).format("YYYY-MMM-DD");
  return {startDate, endDate, isSameDay};
}

export const getCustomXAxisLabels = (customStartDate, customEndDate) => {
  const dataLabels = [];
  const startDate = customStartDate;
  const endDate = customEndDate;
  const format = getFormatbasedOnSelectedFilter({filterType: CUSTOM_DATE_RANGE_VALUE, startDate, endDate});
  const isMoreThanAMonth = moment(startDate).format("YYYY-MMM") === moment(endDate).format("YYYY-MMM")
  ? false
  : true;
  while (startDate < endDate) {
    dataLabels.push(endDate.format(format));
    endDate.subtract(7, "days");
  }
  return dataLabels;
}