import React, { useState, useEffect } from "react";

const Dropdown = ({ subject, setId, subjectName }) => {
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    !subject && setIsLocked(true);
  }, [subject]);

  return (
    <>
      <select
        class="custom-select"
        disabled={!subject}
        onChange={(e) => {
          setIsLocked(false);
          setId(e.target.value);
        }}>
        <option value="" selected={isLocked} disabled hidden>
          {subject && `Choose ${subjectName}`}
        </option>
        {subject
          && subject.map((el) => {
              return (
                <option
                  value={el.language && el.language.id ? el.language.id : el.id}
                  //value={el.language ? el.language.id : el.id}
                  key={el.id}>
                  {el.name}
                </option>
              );
            })}
      </select>
    </>
  );
};

export default Dropdown;
