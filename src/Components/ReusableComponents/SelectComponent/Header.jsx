import React from "react";

const HeaderComponent = ({ siteName }) => {
  return (
    <>
      <div className="headerTitle">
        <h5>{siteName}</h5>
      </div>
    </>
  );
};

export default HeaderComponent;
