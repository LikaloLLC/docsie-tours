import React from "react";

const Dropdown = ({ subject, setId, disabled }) => {
  return (
    <>
      <select
        class="custom-select"
        disabled={`${!subject ? "true" : ""}`}
        onChange={(e) => {
          console.log(e.target.value);
          setId(e.target.value);
        }}>
        {subject
          ? subject.map((el) => {
              return (
                <option
                  value={el.language ? el.language.id : el.id}
                  key={el.id}>
                  {el.name}
                </option>
              );
            })
          : null}
      </select>
    </>
  );
};

export default Dropdown;
