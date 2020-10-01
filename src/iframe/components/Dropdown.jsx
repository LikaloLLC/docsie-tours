import React, { useState, useEffect } from "react";

const Dropdown = ({ subject, setId, subjectName }) => {
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    !subject ? setIsLocked(true) : null;
  }, [subject]);

  return (
    <>
      <select
        class="custom-select"
        disabled={`${!subject ? "true" : ""}`}
        onChange={(e) => {
          console.log("value", e.target.value);
          setIsLocked(false);
          setId(e.target.value);
        }}>
        <option value="" selected={isLocked} disabled hidden>
          {subject ? `Choose ${subjectName}` : null}
        </option>
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
