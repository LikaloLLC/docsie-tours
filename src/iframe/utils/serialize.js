function formDataEntries(form) {
  let entries = [];
  const elements = form.elements;
  for (let i = 0; i < elements.length; i++) {
    let el = elements[i];
    if (!el.dataset["hidden"]) {
      let tagName = el.tagName.toUpperCase();
      if (tagName === "SELECT" || tagName === "TEXTAREA" || tagName === "INPUT") {
        let type = el.type,
          name = el.name;
        if (
          name &&
          !el.disabled &&
          type !== "submit" &&
          type !== "reset" &&
          type !== "button" &&
          ((type !== "radio" && type !== "checkbox") || el.checked)
        ) {
          if (tagName === "SELECT") {
            const options = el.getElementsByTagName("option");
            for (let j = 0; j < options.length; j++) {
              let option = options[j];
              if (option.selected) {
                entries.push([name, option.value]);
              }
            }
          } else if (type === "file") {
            entries.push([name, ""]);
          } else {
            if (Boolean(el.value)) entries.push([name, el.value]);
            else if (el.checked) entries.push([name, true]);
            else entries.push([name, el.value]);
          }
        }
      }
    }
  }
  return entries
}

const Serialize = (form) => {
  let json = {}, entries;
  // if (typeof FormData === "function" && "entries" in FormData.prototype) {
  // const formData = new FormData(form);
  //   entries = formData.entries();
  // } else {
    entries = formDataEntries(form);
  // }
  for (var pair of entries) {
    const key = pair[0];
    let value = pair[1];
    if (value === "on") value = true;
    if (json[key]) json[key] += value;
    else json[key] = value;
  }
  return json;
};

export default Serialize