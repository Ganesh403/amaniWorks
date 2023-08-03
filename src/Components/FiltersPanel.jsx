import { useState } from "react";
import SelectComponent from "./ReusableComponents/SelectComponent/select-component";
import DatePickerComponent from "./ReusableComponents/DatePickerComponent/date-picker";
import { changeWindowUrl } from "../Helpers/helpers";
import {
  ONE_HOUR,
  TWELVE_HOURS,
  TWENTY4_HOURS,
  SEVEN_DAYS,
  THIRTY_DAYS,
  CUSTOM_DATE_RANGE,
  ONE_HOURS_VALUE,
  NINETY_MINUTES_VALUE,
  TWELVE_HOURS_VALUE,
  TWENTY4_HOURS_VALUE,
  SEVEN_DAYS_VALUE,
  THIRTY_DAYS_VALUE,
  CUSTOM_DATE_RANGE_VALUE,
} from "../Helpers/constants";
const siteIdOptionsList = [
  {
    name: "31818",
    value: "31818",
  },
];

const typeIdOptionsList = [
  {
    name: "baseSiteobjectTemperaturehistorical",
    value: "baseSiteobjectTemperaturehistorical",
  },
  {
    name: "baseSiteobjectFlowhistorical",
    value: "baseSiteobjectFlowhistorical",
  },
  {
    name: "baseSiteobjectGashistorical",
    value: "baseSiteobjectGashistorical",
  },
  {
    name: "baseSiteobjectLevelhistorical",
    value: "baseSiteobjectLevelhistorical",
  },
  {
    name: "baseSiteobjectPressurehistorical",
    value: "baseSiteobjectPressurehistorical",
  },
];

const filterTypeOptionsList = [
  {
    name: ONE_HOUR,
    value: ONE_HOURS_VALUE,
  },
  {
    name: TWELVE_HOURS,
    value: TWELVE_HOURS_VALUE,
  },
  {
    name: TWENTY4_HOURS,
    value: TWENTY4_HOURS_VALUE,
  },
  {
    name: SEVEN_DAYS,
    value: SEVEN_DAYS_VALUE,
  },
  {
    name: THIRTY_DAYS,
    value: THIRTY_DAYS_VALUE,
  },
  {
    name: CUSTOM_DATE_RANGE,
    value: CUSTOM_DATE_RANGE_VALUE,
  },
];
const FilterPanel = ({ onFilterChange, queryParams }) => {
  const handleChange = (key, value) => {
    const SLUG_NAME = value.replace(/\s/g, "-");
    const updatedValue = {
      ...queryParams,
      ...{ [key]: SLUG_NAME },
    };
    if(updatedValue.filterType !== "Custom-Date-Range"){
      updatedValue.startDate = '';
      updatedValue.endDate = '';
    }
    changeWindowUrl(updatedValue);
    onFilterChange(updatedValue);
  };

  return !!queryParams.entityId ? null : (
    <div className="lineChart-inputData">
      <SelectComponent
        value={queryParams.siteId}
        onChange={(e) => handleChange("siteId", e.target.value)}
        options={siteIdOptionsList}
      />
      <SelectComponent
        value={queryParams.typeId}
        onChange={(e) => handleChange("typeId", e.target.value)}
        options={typeIdOptionsList}
      />
      <SelectComponent
        value={queryParams.filterType}
        onChange={(e) => handleChange("filterType", e.target.value)}
        options={filterTypeOptionsList}
      />
      <div className="lineChart-inputdate">
      <DatePickerComponent
        type={"date"}
        name="startDate"
        onChange={(e) => handleChange("startDate", e.target.value)}
        value={queryParams.startDate}
        disabled={queryParams.filterType !== CUSTOM_DATE_RANGE_VALUE}
        maxDate={new Date()}
      />
      <DatePickerComponent
        type={"date"}
        name="endDate"
        onChange={(e) => handleChange("endDate", e.target.value)}
        value={queryParams.endDate}
        disabled={queryParams.filterType !== CUSTOM_DATE_RANGE_VALUE}
        maxDate={new Date()}
      />
      </div>
    </div>
  );
};

export default FilterPanel;
