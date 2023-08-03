import React, { useState, useEffect, useRef } from "react";
import { ChromePicker } from "react-color";
import "./info-content.css";
import { Accordion, Card, Button } from "react-bootstrap";

function LineChartInfoComponent({
  containerRefs,
  propKeys,
  siteName,
  toggleCheckBox,
  toggleCheckBox1,
  filteredCheckBox,
  internalChartData,
  strokeColors,
  handleReset,
}) {
  const options = ["Standard", "Selective"];
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [max, setMax] = useState("");
  const [min, setMin] = useState("");
  const [avg, setAvg] = useState("");
  const [showPalette, setShowPalette] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [accodian, setAccodian] = useState(true);
  // const filteredValue = filteredCheckBox.filter((iteam)=>{
  //   return iteam.checked == true
  // })
  const [selected, setSelected] = useState(filteredCheckBox);
  const tooltipRef = useRef(null);
  let isLongPressTimer = null;
  const handleRightClick = (event, key, name) => {
    const maxValue = Math.max(
      ...internalChartData.map((item) => item[`${name}-value`])
    );
    setMax(maxValue);
    // Finding the minimum value
    const minValue = Math.min(
      ...internalChartData.map((item) => item[`${name}-value`])
    );
    setMin(minValue);
    // Calculating the average value
    const sum = internalChartData.reduce(
      (acc, item) => acc + item[`${name}-value`],
      0
    );
    const averageValue = sum / internalChartData.length;
    const tooltipX = event.clientX + window.scrollX;
    const tooltipY = event.clientY + window.scrollY;
    setAvg(Math.floor(averageValue));
    setIsTooltipVisible(true);
    setTooltipPosition({ x: tooltipX, y: tooltipY });
    // Additional logic for handling right-click event
  };
  const handleColorChange = (color) => {
    strokeColors[selectedItem].stroke = color.hex;
    strokeColors[selectedItem].fill = color.hex;
    setTimeout(() => {
      handleReset();
    }, 500);
  };

  const handleBoxClick = (stroke) => {
    setSelectedItem(stroke);
    setShowPalette(!showPalette);
  };

  const handlePaletteClose = () => {
    setShowPalette(false);
  };
  const handleOutsideClick = (event) => {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
      setIsTooltipVisible(false);
    }
  };
  const handleTouchStart = (event) => {
    // Capture touch coordinates
    const { clientX, clientY } = event.touches[0];
    setTooltipPosition({ x: clientX, y: clientY });
    // Start a timer to detect long press
    isLongPressTimer = setTimeout(() => {
      setIsTooltipVisible(true);
    }, 500); // Adjust the duration for long press as needed
  };

  const handleTouchEnd = () => {
    // Clear the timer
    clearTimeout(isLongPressTimer);

    // Reset the long press state
    setIsTooltipVisible(false);
  };
  useEffect(() => {
    const filteredValue = filteredCheckBox.filter((iteam) => {
      return iteam.checked == true;
    });
    setSelected(filteredValue);
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  const handleAccordianClick = (value) => {
    setAccodian(!accodian);
  };
  const handleCheckBox1 = (currentKey, isChecked, name) => {
    const foundIndex = selected.findIndex(({ key }) => key === currentKey);
    if (foundIndex > -1) {
      const updatedList = selected;
      updatedList[foundIndex] = {
        ...updatedList[foundIndex],
        checked: isChecked,
      };
      setSelected([...updatedList]);
    }
    toggleCheckBox1(selected);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <div className="lineChartComponent-container">
      

      

      
        <div className="lineChartComponent-data">
          <div className="linechartOpttion">
           {options.map((option) => (
        <label key={option} className="linechartOpttionLable">
          <input
            type="radio"
            value={option}
            checked={selectedOption === option}
            onChange={handleOptionChange}
          />
          {option}
        </label>
      ))}
      </div>
          <div className="lineChart-descriptionValue">
            <span>DESCRIPTION</span>
            <span>VALUE</span>
          </div>
         
          {selectedOption == "Standard" && filteredCheckBox.map(({ key, checked, name }, index) => {
            return (
              <div className="dynamic-label" key={index}>
                <span
                  className="dynamic-span"
                  onContextMenu={(event) => {
                    event.preventDefault(); // Prevent the default context menu from appearing
                    handleRightClick(event, key, name); // Call the right-click handler function
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={handleTouchStart}
                  onMouseUp={handleTouchEnd}
                >
                  <input
                    key={index}
                    onChange={() => {
                      toggleCheckBox(key, !checked);
                    }}
                    type="checkbox"
                    id={`${key}${siteName.replaceAll(" ", "")}`}
                    checked={checked}
                    className="checkbox-item"
                  />
                  <div
                    style={{
                      backgroundColor: strokeColors[index].fill,
                    }}
                    className="dynamic-colorPicker"
                    onClick={() => handleBoxClick(index)}
                  ></div>
                  <span
                  className="dynamic-name"
                    onClick={() => {
                      toggleCheckBox(key, !checked);
                    }}
                  >
                    {name}
                  </span>
                </span>
                <span
                  style={{ marginLeft: "30px" }}
                  ref={containerRefs.current[index]}
                >
                  {"--"}
                </span>
              </div>
            );
          })}


          {selectedOption == "Selective" && selected.map(({ key, checked, name }, index) => {

            return (
              <div className="dynamic-label" key={index}>
                <span
                  className="dynamic-span"
                  onContextMenu={(event) => {
                    event.preventDefault(); // Prevent the default context menu from appearing
                    handleRightClick(event, key, name); // Call the right-click handler function
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={handleTouchStart}
                  onMouseUp={handleTouchEnd}
                >
                  <input
                    key={index}
                    onChange={() => {
                      handleCheckBox1(key, !checked, name);
                    }}
                    type="checkbox"
                    id={`${key}${siteName.replaceAll(" ", "")}`}
                    checked={checked ? true : false}
                    className="checkbox-item"
                  />
                  <div
                    style={{
                      backgroundColor: strokeColors[propKeys?.indexOf(name)].fill,
                    }}
                    className="dynamic-colorPicker"
                    onClick={() => handleBoxClick(propKeys?.indexOf(name))}
                  ></div>
                  <span
                  className="dynamic-name"
                    onClick={() => {
                      handleCheckBox1(key, !checked, name);
                    }}
                  >
                    {name}
                  </span>
                </span>
                <span
      style={{ marginLeft: "30px" }}
      ref={containerRefs.current[propKeys?.indexOf(name)]}
    >
      {"--"}
    </span>
              </div>
            );
          })}
       
       </div>
      {isTooltipVisible && (
        <div
          className="tooltip"
          style={{ top: tooltipPosition.y + 15, left: tooltipPosition.x - 10 }}
          ref={tooltipRef}
        >
          {/* Render tooltip content here */}
          <div className="tooltip-data">
            Max:<span>{max ? max : 0}</span>
          </div>
          <hr />
          <div className="tooltip-data">
            Min:<span>{min ? min : 0}</span>
          </div>
          <hr />
          <div className="tooltip-data">
            Avg:<span>{avg ? avg : 0}</span>
          </div>
        </div>
      )}
      {showPalette && (
        <div
          style={{
            position: "absolute",
            top: "150px",
            zIndex: "999",
            left: "150px",
          }}
        >
          <ChromePicker
            color={strokeColors[selectedItem].stroke}
            onChange={handleColorChange}
          />
          <button onClick={handlePaletteClose}>Close Palette</button>
        </div>
      )}
    </div>
  );
}

export default LineChartInfoComponent;
