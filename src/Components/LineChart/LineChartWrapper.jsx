import { createRef, useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
  Brush,
} from "recharts";

import moment from "moment/moment";
import toImg from "../convertToDownload";
import {
  displayDate,
  getToolTipFormatDate,
  getFormatbasedOnSelectedFilter,
  getZoomInData,
  getCustomZoomInData,
} from "../../Helpers/helpers";
import {
  getXAxisLabels,
  getDatesRange,
  getCustomDatesRange,
  getCustomXAxisLabels,
} from "../../Helpers/utils";

import LineChartInfoComponent from "./BiaxialLineChart/LineChartInfoComponent";
import {
  CUSTOM_DATE_RANGE_VALUE,
  strokeColors,
  zoomLevels,
} from "../../Helpers/constants";
import "./LineChartStyles.css";
import { zoomTypes } from "../../Helpers/constants";
import HeaderComponent from "../ReusableComponents/SelectComponent/Header";
import ContextMenus from "../ContextMenu/ContextMenu";
const LineChartWrapper = ({
  siteName,
  lineChartData,
  queryParams,
  completeLineData,
}) => {
  const { filterType, endDate, startDate, propKeys = [] } = queryParams;
  const [zoomLevel, setZoomLevel] = useState(zoomLevels.indexOf(filterType));
  const [fromDate, setFromDate] = useState(startDate);
  const [toDate, setToDate] = useState(endDate);
  const [internalChartData, setInternalChartData] = useState(
    completeLineData.arr
  );
  const [chartValue, setChartValue] = useState(completeLineData.arr);
  const [screen, setScreen] = useState(false);
  const [background, setBackground] = useState("#fff");
  const updatedName = siteName.replaceAll(" ", "-");
  const [filteredCheckBox, setFilteredCheckBox] = useState(
    propKeys.map((key) => ({
      key: `${key}${siteName.replaceAll(" ", "")}`,
      checked: completeLineData[`${key}`]?.length == 0 ? false : true,
      name: key,
    }))
  );
  const [customStartDate, setCustomStartDate] = useState(
    startDate ? moment(startDate) : moment()
  );

  const [customEndDate, setCustomEndDate] = useState(
    moment(endDate ? moment(endDate) : moment())
  );
  const [xTraceValue, setXTraceValue] = useState(null);
  const [
    updatedLabelToDisplayFilteredDates,
    setUpdatedLabelToDisplayFilteredDates,
  ] = useState(getXAxisLabels(zoomLevels[zoomLevel], customEndDate));
  const [domainEd, setDomainEd] = useState(
    moment(endDate ? moment(endDate) : moment())
  );

  const [filteredDataStack, setFilteredDataStack] = useState({});
  const [filteredDataDomain, setFilteredDataDomain] = useState([]);
  const [zoomDomain, setZoomDomain] = useState(zoomLevels.indexOf(filterType));

  const [reset, setReset] = useState(false);
  const [rectCoordinates, setRectCoordinates] = useState({
    startX: null,
    startY: null,
    endX: null,
    endY: null,
  });
  //nwe

  const [refAreaLeft, setRefAreaLeft] = useState("");
  const [refAreaRight, setRefAreaRight] = useState("");
  const [mode, setMode] = useState("X-Trace");
  const [refLine, setRefLine] = useState([]);
  const [refLineY, setRefLineY] = useState({ x: null, y: null });
  const [modeIndex, setModeIndex] = useState({ x: "", y: "" });
  const [zoomedValue, setZoomedValue] = useState([]);
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  const [dropDownPosition, setDropDownPosition] = useState({ x: "", y: "" });
  const [drag, setDrag] = useState(false);
  const [hoveredLine, setHoveredLine] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [rangeMax, setRangeMax] = useState();
  const [rangeMin, setRangeMin] = useState();
  const [new1, setNew1] = useState({});
  const [chartWidth, setChartWidth] = useState(window.innerWidth);

  //new
  const displayLabelArr = [];
  let tickCount = -1000;
  let repeatCount = -1;
  const containerRefs = useRef(propKeys.map(() => createRef()));
  const divRef = useRef(null);
  const lineChartDivRef = useRef(null);
  displayLabelArr.length = 0;
  const dateFormatBasedOnFilter = getFormatbasedOnSelectedFilter({
    filterType,
    startDate,
    endDate,
  });
  useEffect(() => {
    setZoomLevel(zoomLevels.indexOf(filterType));
    setInternalChartData(completeLineData.arr);
    setChartValue(completeLineData.arr);
    setZoomDomain(zoomLevels.indexOf(filterType));
    setFilteredDataDomain([completeLineData.arr]);
    // const firstPropkey = filteredCheckBox.filter(
    //   (check) => check.checked == true
    // );
    // setHoveredLine(firstPropkey[0].name);
    const domainValues = () => {
      let domainMax = [];
      let domainMin = [];
      propKeys.map((key) => {
        let data = completeLineData.arr;
        const maxValue = Math.max(...data.map((item) => item[`${key}-value`]));
        domainMax.push(maxValue);
        const minValue = Math.min(...data.map((item) => item[`${key}-value`]));
        domainMin.push(minValue);
      });
      const domainMaxarr = domainMax.filter((value) => !isNaN(value));
      const domainMinarr = domainMin.filter((value) => !isNaN(value));
      setRangeMax(domainMaxarr);
      setRangeMin(domainMinarr);
      return { domainMinarr, domainMaxarr };
    };
    domainValues();
    const arr = domainValues().domainMaxarr;
    const arr1 = domainValues().domainMinarr;
    const objectArray = arr.map((item, index) => {
      return { id: index, max: [item], min: [arr1[index]] };
    });
    setFilteredDataStack(objectArray);
  }, [filterType, queryParams, reset, mode, completeLineData]);
  useEffect(() => {
    setMode("X-Trace");
  }, [reset, completeLineData]);
  useEffect(() => {
    const handleResize = () => {
      setChartWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleReset = () => {
    setReset(!reset);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return;
    }
    return null;
  };

  const handleMouseMove = (e) => {
    const payloadContent = e?.activePayload;
    if (!payloadContent) return;
    const name = e?.activePayload?.[0].payload?.timestamp;

    payloadContent?.forEach(({ name, value }) => {
      const nameKey = name.split("-")?.[0] || "";
      const index = propKeys.indexOf(nameKey);
      if (containerRefs.current[index].current == null) return;
      containerRefs.current[index].current.innerText = value || "--";
    });

    const toolTipText =
      getToolTipFormatDate({
        filterType: filterType,
        endDate,
        startDate,
        date: name,
      }) || "";
    divRef.current.innerText = toolTipText;
    const currentDiv = divRef.current;
    currentDiv.style.left = Number(e?.chartX) + "px";
    currentDiv.style.top =(chartWidth > 900
    ? chartWidth > 1600
      ? 600
      : (chartWidth * (3 / 4)) / 2
    : 300)- 100 + "px";
      // window.screen.height - (window.screen.height * 40) / 100 - 120 + "px";
    currentDiv.style.visibility = !!toolTipText ? "visible" : "hidden";
  };

  const toggleCheckBox = (currentKey, isChecked) => {
    const foundIndex = filteredCheckBox.findIndex(
      ({ key }) => key === currentKey
    );
    if (foundIndex > -1) {
      const updatedList = filteredCheckBox;
      updatedList[foundIndex] = {
        ...updatedList[foundIndex],
        checked: isChecked,
      };
      setFilteredCheckBox([...updatedList]);
    }
  };
  const toggleCheckBox1 = (prop) => {
    setHoveredLine(prop);
  };
  const svgSave = () => {
    toImg(`svg[name='${updatedName}']`, background, updatedName, {
      quality: 1,
    });
    setIsDropDownVisible(false);
  };

  const handleBackgoundChange = (color) => {
    setIsDropDownVisible(false);
    setBackground(color);
  };

  const onZoomOut = (type) => {
    containerRefs.current.forEach((ref) => {
      ref.current.innerText = "--";
    });
    setIsDropDownVisible(false);
    if (type == "Range") {
      const updatedDataArray = filteredDataStack?.map((data, index) => {
        if (data == undefined) return;

        const newMax = data.max.slice(0, -1);
        const newMin = data.min.slice(0, -1);

        return {
          ...data,
          max: newMax,
          min: newMin,
        };
      });

      setFilteredDataStack(updatedDataArray);
    }
    if (type == "Domain") {
      if (filteredDataDomain.length == 1) return;
      setZoomDomain(zoomDomain - 1);

      setFilteredDataDomain((prevSt) => prevSt.slice(0, prevSt.length - 1));

      setInternalChartData(filteredDataDomain[filteredDataDomain.length - 2]);
    }
    if (type == "All") {
      //Range
      const updatedDataArray = filteredDataStack?.map((data, index) => {
        if (data == undefined) return;

        const newMax = data.max.slice(0, -1);
        const newMin = data.min.slice(0, -1);

        return {
          ...data,
          max: newMax,
          min: newMin,
        };
      });

      setFilteredDataStack(updatedDataArray);

      //Domain
      if (filteredDataDomain.length == 1) return;
      setZoomDomain(zoomDomain - 1);

      setFilteredDataDomain((prevSt) => prevSt.slice(0, prevSt.length - 1));

      setInternalChartData(filteredDataDomain[filteredDataDomain.length - 2]);
    }
  };

  const onZoomIn = (type) => {
    containerRefs.current.forEach((ref) => {
      ref.current.innerText = "--";
    });
    setIsDropDownVisible(false);
    if (type == "Range") {
      if (zoomLevel === zoomLevels.length - 1) return;
      const updatedArray = filteredDataStack.map((obj, index) => {
        if (rangeMax[index] == rangeMin[index]) return;
        const range = obj.max[obj.max.length - 1] - obj.min[obj.min.length - 1];
        const newRange = range * 0.8; // Zoom factor (adjust as desired)
        const mid =
          (obj.max[obj.max.length - 1] + obj.min[obj.min.length - 1]) / 2;
        const updatedValue = mid + newRange / 2;
        const updateMin = mid - newRange / 2;
        return {
          id: obj.id,
          max: [...obj.max, Math.floor(updatedValue)],
          min: [...obj.min, Math.floor(updateMin)],
        };
      });

      setFilteredDataStack(updatedArray);
    }
    if (type == "Domain") {
      let filteredDataDo = internalChartData;

      filteredDataDo = domainAxis(filteredDataDo);
      setInternalChartData(filteredDataDo);
      setFilteredDataDomain([...filteredDataDomain, filteredDataDo]);
    }
    if (type == "All") {
      //Range
      const updatedArray = filteredDataStack.map((obj, index) => {
        if (rangeMax[index] == rangeMin[index]) return;
        const range = obj.max[obj.max.length - 1] - obj.min[obj.min.length - 1];
        const newRange = range * 0.8; // Zoom factor (adjust as desired)
        const mid =
          (obj.max[obj.max.length - 1] + obj.min[obj.min.length - 1]) / 2;
        const updatedValue = mid + newRange / 2;
        const updateMin = mid - newRange / 2;
        return {
          id: obj.id,
          max: [...obj.max, Math.floor(updatedValue)],
          min: [...obj.min, Math.floor(updateMin)],
        };
      });

      setFilteredDataStack(updatedArray);

      //Domain
      let filteredDataDo = internalChartData;

      filteredDataDo = domainAxis(filteredDataDo);

      setInternalChartData(filteredDataDo);
      setFilteredDataDomain([...filteredDataDomain, filteredDataDo]);
    }
  };

  const domainAxis = (data) => {
    if (filterType !== "Custom-Date-Range") {
      setZoomDomain(zoomDomain + 1);
      const { startDate: sD, endDate: eD } = getDatesRange(
        zoomLevels[zoomDomain + 1],
        domainEd
      );
      const fill = data.filter((obj, i) => {
        const date = moment(obj.timestamp).toDate();
        return date >= sD && date <= eD;
      });
      const sortedData = fill.sort((a, b) => {
        const dateA = moment(a.timestamp).toDate();
        const dateB = moment(b.timestamp).toDate();
        return dateA - dateB;
      });

      setCustomStartDate(sD);
      setDomainEd(eD);
      return sortedData;
    } else {
      const { startDate: sD, endDate: eD } = getCustomDatesRange(
        fromDate,
        toDate
      );
      const fill = data.filter((obj, i) => {
        const date = moment(obj.timestamp).toDate();
        return date >= sD && date <= eD;
      });
      const sortedData = fill.sort((a, b) => {
        const dateA = moment(a.timestamp).toDate();
        const dateB = moment(b.timestamp).toDate();
        return dateA - dateB;
      });

      setFromDate(sD);
      setToDate(eD);
      return sortedData;
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Hide tooltip or tooltip-related elements
    if (divRef.current) {
      divRef.current.style.visibility = "hidden";
    }

    // Reset label values
    containerRefs.current.forEach((ref, index) => {
      if (ref.current == null) return;
     
        ref.current.innerText = "--";
     
    });
  };

  const CustomYAxisTick = (props) => {
    const { x, y, payload, index, orientation, propKey } = props;
    const textX = orientation === "left" ? x - 20 : x;
    let formattedValue = payload.value;
    const min = Math.min(
      ...internalChartData.map((entry) => entry[`${propKey}-value`])
    );

    if (payload.value === min && min < 20) {
      formattedValue = payload.value; // Show minimum value with 1 decimal place
    } else {
      formattedValue = Math.floor(payload.value); // Remove decimals for other ticks
    }

    return (
      <text
        x={textX}
        y={y}
        dy={5}
        textAnchor="start"
        fill="#666"
        style={{ fontFamily: "Arial", fontSize: "12px" }}
      >
        {formattedValue}
      </text>
    );
  };

  const handleMouseDown = (event) => {
    if (mode == "Zoom") {
      const startX = event.clientX + window.scrollX;
      const startY = event.clientY + window.scrollY;

      setRectCoordinates({
        startX,
        startY,
        endX: startX,
        endY: startY,
      });
    }
  };

  const handlezoom = (e) => {
    if (mode == "Zoom" && drag) {
      setRefAreaRight(e?.activeLabel);
      if (e?.activeLabel == undefined) return;
      if (refAreaLeft == e?.activeLabel) return;

      let [newRefAreaLeft, newRefAreaRight] = [refAreaLeft, e?.activeLabel];
      var indexLeft = chartValue.findIndex(function (obj) {
        return obj.timestamp === newRefAreaLeft;
      });
      var indexRight = chartValue.findIndex(function (obj) {
        return obj.timestamp === newRefAreaRight;
      });
      setModeIndex({ x: indexLeft, y: indexRight });
      const fm = moment(newRefAreaLeft).toDate();
      const tw = moment(newRefAreaRight).toDate();

      const refData = internalChartData.filter((obj) => {
        const date = moment(obj.timestamp).toDate();
        return date >= fm && date <= tw;
      });

      if (refData.length == 0) return;
      setInternalChartData(refData);
      setDrag(false);
    }
  };

  const handleMouseMov = (event) => {
    if (mode == "Zoom") {
      if (!rectCoordinates.startX || !rectCoordinates.startY) return;

      const endX = event.clientX + window.scrollX;
      const endY = event.clientY + window.scrollY;

      setRectCoordinates((prevCoordinates) => ({
        ...prevCoordinates,
        endX,
        endY,
      }));
    }
  };
  const handleMouseUp = (e) => {
    if (mode == "Zoom") {
      if (!rectCoordinates.startX || !rectCoordinates.startY) return;

      setRectCoordinates({
        startX: null,
        startY: null,
        endX: null,
        endY: null,
      });
    }
  };
  const down = (e) => {
    if (mode == "Zoom") {
      if (e?.activeLabel == undefined) return;
      setDrag(true);
      setRefAreaLeft(e?.activeLabel);
    }
  };

  const modeSelection = (value) => {
    setIsDropDownVisible(false);
    setMode(value);
  };
  const CustomTick = (props) => {
    const { x, y, payload } = props;

    const date = new Date(payload.value);

    const minutes = date.getMinutes();

    const currentDate = new Date().getDate();
    // if (minutes % 5 !== 0) {
    //   return; // Skip ticks that are not rounded to the nearest 5 minutes
    // }
    let formattedTick;
    if (date.getDate() === currentDate) {
      formattedTick = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
      });
    } else {
      formattedTick = `${date.toLocaleString("default", {
        month: "short",
      })} ${date.getDate()} ${date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
      })}`;
    }

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
          {formattedTick}
        </text>
      </g>
    );
  };

  const startValue = internalChartData[0]?.timestamp;
  // const middleValue1 = internalChartData[Math.floor(internalChartData.length *(3/4))].timestamp;
  const middleValue =
    internalChartData[Math.floor(internalChartData.length * (1 / 2))]?.timestamp;
  // const middleValue2 = internalChartData[Math.floor(internalChartData.length *(1/4))].timestamp;
  const lastValue = internalChartData[internalChartData.length - 1]?.timestamp;
  const tickValues = [startValue, middleValue, lastValue];
  const filteredTimestamps = internalChartData
    .map((data) => data.timestamp) // Extract timestamp values
    .filter((timestamp) => {
      const minutes = new Date(timestamp).getMinutes();
      const first = new Date(startValue).getMinutes();
      return first === minutes; // Filter based on minutes modulo 5 condition
    });

  const handleClick = (e) => {
    setIsDropDownVisible(false);
    setRefLineY({
      x: e?.activeCoordinate?.x + window.scrollX,
      y: e?.activeCoordinate.y + window.scrollY,
    });

    if (mode == "Mark") {
      setRefLine(e?.activePayload);
    }
  };

  const handleRefresh = () => {
    setIsDropDownVisible(false);
    setReset(!reset);
  };
  const handleScreen = () => {
    setIsDropDownVisible(false);
    setScreen(!screen);
  };
  const handleRightClick = (e) => {
    const tooltipX = e.clientX + window.scrollX;
    const tooltipY = e.clientY + window.scrollY;
    setIsDropDownVisible(true);
    setDropDownPosition({ x: tooltipX, y: tooltipY });
  };
  const handleRightClickset = () => {
    setIsDropDownVisible(false);
  };
  const handleLineMouseEnterProp = (e, dataKey) => {
    setHoveredLine(dataKey);
  };

  return (
    <>
      <HeaderComponent siteName={siteName} />
      {isDropDownVisible && (
        <div
          style={{
            position: "absolute",
            top: dropDownPosition.y,
            left: dropDownPosition.x,
            zIndex: "9999999",
          }}
        >
          <ContextMenus
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
            handlePngSave={svgSave}
            handleBackgoundChange={handleBackgoundChange}
            handleModeSelection={modeSelection}
            handleRefresh={handleRefresh}
            handleScreen={handleScreen}
            screen={screen}
            internalChartData={internalChartData}
            handleRightClickset={handleRightClickset}
            mode={mode}
          />
        </div>
      )}
      <div className="lineChartWrapper_container">
        {!screen && (
          <LineChartInfoComponent
            containerRefs={containerRefs}
            propKeys={propKeys}
            siteName={siteName}
            toggleCheckBox={toggleCheckBox}
            toggleCheckBox1={toggleCheckBox1}
            filteredCheckBox={filteredCheckBox}
            internalChartData={internalChartData}
            strokeColors={strokeColors}
            handleReset={handleReset}
          />
        )}
        <div
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMov}
          onContextMenu={(event) => {
            event.preventDefault(); // Prevent the default context menu from appearing
            handleRightClick(event); // Call the right-click handler function
          }}
        >
          <div
            className="contextMenuTri"
            ref={lineChartDivRef}
            onMouseEnter={() => {
              setIsHovered(true);
            }}
          >
            <LineChart
              style={{ background: background }}
              name={updatedName}
              data={internalChartData}
              margin={{
                top: 30,
                right: 30,
                left: 30,
                bottom: 100,
              }}
              width={
                chartWidth > 900
                  ? chartWidth > 1600
                    ? 1200
                    : chartWidth * (3 / 4)
                  : 500
              }
              height={
                chartWidth > 900
                  ? chartWidth > 1600
                    ? 600
                    : (chartWidth * (3 / 4)) / 2
                  : 300
              }
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseDown={down}
              onMouseUp={handlezoom}
              onClick={handleClick}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                xAxisId={0}
                label={{
                  value: displayDate(filterType, startDate, endDate),
                  position: "insideBottom",
                  offset: -70,
                }}
                dataKey="timestamp"
                tick={<CustomTick />}
                ticks={tickValues}
              />

              {filteredCheckBox
                .filter((checkItem) => checkItem.checked)
                .map((keyItem, index) => {
                  const propKey = keyItem.name;
                  return (
                    <YAxis
                      domain={[
                        filteredDataStack[index]?.min?.length > 1
                          ? filteredDataStack[index]?.min[
                              filteredDataStack[index]?.min?.length - 1
                            ]
                          : "dataMin",
                        filteredDataStack[index]?.max?.length > 1
                          ? filteredDataStack[index]?.max[
                              filteredDataStack[index]?.max?.length - 1
                            ]
                          : "dataMax",
                      ]}
                      key={`${index}${siteName.replaceAll(" ")}`}
                      yAxisId={propKey}
                      orientation={index === 0 ? "left" : "right"}
                      allowDataOverflow={true}
                      interval="preserveStartEnd"
                      // interval={2}
                      tick={<CustomYAxisTick propKey={propKey} />}
                      label={{
                        value: `${propKey} ${
                          (internalChartData || []).find(
                            (i) => i?.[propKey + "-unit"] !== undefined
                          )?.[propKey + "-unit"] || ""
                        }`,
                        angle: index === 0 ? 270 : 90,
                        offset: index === 0 ? 10 : 50,
                        fontSize: "14px",
                      }}
                    />
                  );
                })}
              {internalChartData?.length > 0 && (
                <Tooltip
                  position={{ y: 20 }}
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: "#000",
                    strokeWidth: 1,
                    strokeDasharray: "3 3",
                  }}
                />
              )}

              {mode == "Mark" &&
                filteredCheckBox
                  .filter((checkItem) => checkItem.checked)
                  .map((keyItem, index) => {
                    const propKey = keyItem.name;
                    return (
                      <ReferenceLine
                        y={refLine?.length > 0 ? refLine[index].value : null}
                        yAxisId={propKey}
                        stroke="red"
                        ifOverflow="extendDomain"
                      />
                    );
                  })}
              {mode == "Mark" &&
                filteredCheckBox
                  .filter((checkItem) => checkItem.checked)
                  .map((keyItem, index) => {
                    const propKey = keyItem.name;
                    return (
                      <ReferenceLine
                        x={
                          refLine?.length > 0
                            ? refLine[index]?.payload?.name
                            : null
                        }
                        yAxisId={propKey}
                        stroke="red"
                        ifOverflow="extendDomain"
                      />
                    );
                  })}

              {filteredCheckBox
                .filter((checkItem) => checkItem.checked)
                .map((keyItem, index) => {
                  const propKey = keyItem.name;
                  const initialIndex = propKeys.indexOf(propKey);
                  return (
                    <Line
                      key={`${index}${siteName.replaceAll(" ")}`}
                      type="monotone"
                      dataKey={propKey + "-value"}
                      strokeOpacity={
                        hoveredLine[index]?.name === propKey
                          ? hoveredLine[index]?.checked
                            ? 1
                            : 0.2
                          : 1
                      }
                      stroke={strokeColors[initialIndex].stroke}
                      fill={strokeColors[initialIndex].fill}
                      connectNulls
                      yAxisId={propKey}
                      strokeWidth={1.5}
                      dot={false}
                      unit={1}
                      isAnimationActive={false}
                      animationDuration={5000}
                     
                    />
                  );
                })}
              {refAreaLeft && refAreaRight ? (
                <ReferenceArea
                  yAxisId="1"
                  x1={refAreaLeft}
                  x2={refAreaRight}
                  strokeOpacity={0.3}
                />
              ) : null}
              {mode == "Pan" && modeIndex.x !== "" && (
                <Brush
                  startIndex={modeIndex.x}
                  endIndex={modeIndex.y}
                  dataKey="name"
                />
              )}
            </LineChart>

            {internalChartData?.length > 0 ? (
              <div
                ref={divRef}
                style={{
                  position: "absolute",
                  backgroundColor: "black",
                  color: "white",
                  fontWeight: "500",
                  padding: "0.25rem",
                  visibility: "hidden",
                }}
              ></div>
            ) : (
              <></>
            )}
          </div>
          {rectCoordinates.startX && rectCoordinates.startY && (
            <div
              className="rectangle"
              style={{
                position: "absolute",
                top: rectCoordinates.startY,
                left: rectCoordinates.startX,
                width: rectCoordinates.endX - rectCoordinates.startX,
                height: rectCoordinates.endY - rectCoordinates.startY,
                border: "2px solid red",
                pointerEvents: "none",
              }}
            />
          )}
          {mode == "Mark" && refLine.length > 0 && (
            <div
              className="tooltip-refLine"
              style={{
                top: refLineY.y,
                left: refLineY.x,
              }}
            >
              <>
                <div className="tooltip-data">{refLine[0].payload.name}</div>
                {refLine.map((obj, i) => {
                  return (
                    <div className="tooltip-data">
                      {obj?.dataKey}:<span>{obj?.value}</span>
                    </div>
                  );
                })}
              </>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LineChartWrapper;
