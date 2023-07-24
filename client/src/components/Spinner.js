import React from "react";
import ScaleLoader from "react-spinners/ScaleLoader";

const Spinner = () => {
  return (
    <div class="d-flex justify-content-center spinner">
      <ScaleLoader color="black" />
      {/* <div class="spinner-border" role="status">
        
        <span class="visually-hidden">Loading...</span> 
      </div> */}
    </div>
  );
};

export default Spinner;
