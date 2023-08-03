import { select } from 'd3';
import React from 'react'

const pageSize =[1,2,3,4,5,6,7,8,9,10]
const Pagination = ({ onFilterChange, queryParams }) => {
    const handleNextPage = () => {
        const { limit, offset } = queryParams;
        const updatedOffset = offset + limit;
        onFilterChange({ ...queryParams, offset: updatedOffset });
      };
    
      const handlePreviousPage = () => {
        const { limit, offset } = queryParams;
        const updatedOffset = Math.max(offset - limit, 0);
        onFilterChange({ ...queryParams, offset: updatedOffset });
      };
    
      const handlePageSizeChange = (event) => {
        const pageSize = parseInt(event.target.value, 10);
        onFilterChange({ ...queryParams, limit: pageSize, offset: 0 });
      };
  return (
    <div className="filter-panel">
      <button className='page-button' disabled={queryParams.offset == 0 ? true : false} onClick={handlePreviousPage}>{"\u2190"}</button>
      <button className='page-button' disabled={queryParams.offset + queryParams.limit == 10 ? true : false} onClick={handleNextPage}>{'\u2192'}</button>
      <select className='page-selection' value={queryParams.limit} onChange={handlePageSizeChange}>
        {pageSize?.map((option,index)=>{
           return ( <option value={option}  key={index}>{option}</option>)
        })}
      </select>
    </div>
  )
}

export default Pagination
