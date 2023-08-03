import React, { useState,useEffect } from 'react';
import './context-menu.css';

function DropdownButton({handlePngSave, handleBackgoundChange, onZoomIn, onZoomOut, handleModeSelection, handleRefresh, handleScreen, screen, internalChartData, mode ,handleRightClickset}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");
  const handleItemClick = (e, data) => {
  };
  const handlePrint =()=>{
    handleRightClickset()
    setTimeout(()=>{
      window.print();
    },2000)
  }
  const handleChange = (value) => {
    setSelectedValue(value);
    handleModeSelection(value)
  };
  useEffect(()=>{
    setSelectedValue('X-Trace')
  },[])

  const downloadCsvFile = () => {
    handleRightClickset()
    const csvContent = convertToCsv(internalChartData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'data.csv');
  };

  const convertToCsv = (data) => {
    const header = Object.keys(data[0]).join(',') + '\n';
    const rows = data.map((item) => Object.values(item).join(','));
    return header + rows.join('\n');
  };
  

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    // Perform any necessary actions based on the selected option
  };

  const handleOptionMouseEnter = (option) => {
    if (!isOpen) {
      setIsOpen(true);
    }
    setSelectedOption(option);
  };

  const handleOptionMouseLeave = () => {
    setSelectedOption(null);
  };
  return (
    <div>
        <div className="dropdown">
        <span className='menuIteams' 
        onClick={handleRefresh}
        onMouseLeave={handleOptionMouseLeave}
        >Refresh
        </span>
          <span
            className='menuIteams'
            onClick={() => handleOptionClick('Mode')}
            onMouseEnter={() => handleOptionMouseEnter('Mode')}
          >
            Mode
          </span>
          <span
          className='menuIteams'
            onClick={() => handleOptionClick('Background')}
            onMouseEnter={() => handleOptionMouseEnter('Background')}
          >
            Background
          </span>
          <span
          className='menuIteams'
            onClick={() => handleOptionClick('Expand')}
            onMouseEnter={() => handleOptionMouseEnter('Expand')}
             
          >
            Expand
          </span>
          <span
          className='menuIteams'
          onMouseLeave={handleOptionMouseLeave}
          onClick={handlePngSave}
          >
            Save as...
          </span>
          <hr/>
          <span
          className='menuIteams'
          onMouseLeave={handleOptionMouseLeave}
          onClick={handlePrint}
          >
            Print...
          </span>
          <hr/>
          <span
           onMouseEnter={() => handleOptionMouseEnter('ZoomIn')}
          className='menuIteams'
          >
            ZoomIn
          </span>
          <span
           onMouseEnter={() => handleOptionMouseEnter('ZoomOut')}
          className='menuIteams'
          >
            ZoomOut
          </span>
          <span
          onMouseEnter={() => handleOptionMouseEnter('Auto Range')}
          className='menuIteams'
          >
            Auto Range
          </span>
          <span
          onMouseLeave={handleOptionMouseLeave}
          className='menuIteams'
          
          >
            Rest Axes
          </span>
          {/* Add more main options as needed */}
          {selectedOption && (
            <div >
              {selectedOption === 'Mode' && (
                <div className="sub-options1" onMouseLeave={handleOptionMouseLeave}>
                  <span className='subIteams'><label>
        <input type="radio" name="option" value="Zoom" checked={mode == 'Zoom' ? true : false} onChange={(e) => handleChange(e.target.value)}/>
        Zoom</label></span>
                  <span className='subIteams'><label>
        <input type="radio" name="option" value="Pan" checked={mode == 'Pan' ? true : false} onChange={(e) => handleChange(e.target.value)}/>
        Pan</label></span>
        <span className='subIteams'><label>
        <input type="radio" name="option" value="Mark" checked={mode == 'Mark' ? true : false} onChange={(e) => handleChange(e.target.value)}/>
        Mark</label></span>
        <span className='subIteams'><label>
        <input type="radio" name="option" value="X-Trace" checked={mode == 'X-Trace' ? true : false} onChange={(e) => handleChange(e.target.value)}/>
        X-Trace</label></span>
                  {/* Add more sub options for Option 1 */}
                </div>
              )}
              {selectedOption === 'Background' && (
                <div className="sub-options2" onMouseLeave={handleOptionMouseLeave}>
                  <span className='subIteams' onClick={() => handleBackgoundChange('#fff')}>White</span>
                  <span className='subIteams' onClick={() => handleBackgoundChange('#000')}>Black</span>
                  {/* Add more sub options for Option 2 */}
                </div>
              )}
              {selectedOption === 'Expand' && (
                <div className="sub-options3" onMouseLeave={handleOptionMouseLeave}>
                  
                  <span className='subIteams' onClick={handleScreen}>{screen ? "ZoomOut" : "Zoom"}</span>
                  <span className='subIteams'>Setting</span>
                  <span className='subIteams' onClick={downloadCsvFile}>Download</span>
                  {/* Add more sub options for Option 3 */}
                </div>
              )}
              {selectedOption === 'ZoomIn' && (
                <div className="sub-options4" onMouseLeave={handleOptionMouseLeave}>
                  <span className='subIteams' onClick={() => onZoomIn('All')}>All Axis</span>
                  <hr/>
                  <span className='subIteams' onClick={() => onZoomIn('Domain')}>Domain axis</span>
                  <span className='subIteams' onClick={() => onZoomIn('Range')}>Range axis</span>
                  {/* Add more sub options for Option 3 */}
                </div>
              )}
              {selectedOption === 'ZoomOut' && (
                <div className="sub-options5" onMouseLeave={handleOptionMouseLeave}>
                  <span className='subIteams' onClick={() => onZoomOut('All')}>All Axis</span>
                  <hr/>
                  <span className='subIteams' onClick={() => onZoomOut('Domain')}>Domain axis</span>
                  <span className='subIteams'onClick={() => onZoomOut('Range')}>Range axis</span>
                  {/* Add more sub options for Option 3 */}
                </div>
              )}
              {selectedOption === 'Auto Range' && (
                <div className="sub-options6" onMouseLeave={handleOptionMouseLeave}>
                  <span className='subIteams'>1</span>
                  <span className='subIteams'>2</span>
                <span className='subIteams'>Range axis</span>
                  {/* Add more sub options for Option 3 */}
                </div>
              )}
            </div>
          )}
        </div>
    </div>
  );
}

export default DropdownButton