export const menuBarClass = ["lm-menubar", "small"];
export const extraMenuClass = ["ml-ctxmenu"];

import { FileHandler } from "../tools/file.js";

const fileHandler = new FileHandler();

export const config = {
  showLoadingIcon: true,
};

function parseProps(props) {
  const {
    boxShadowX = 0,
    boxShadowY = 0,
    boxShadowBlur = 0,
    boxShadowSpread = 0,
    boxShadowColor = "#000000",
    boxShadowInset = "none",
  } = props.styleX;

  let boxShadow = `${boxShadowX} ${boxShadowY} ${boxShadowBlur} ${boxShadowSpread} ${boxShadowColor}`;

  if (boxShadowInset === "inset") {
    boxShadow = `inset ${boxShadow}`;
  }

  props.style.boxShadow = boxShadow;
  // console.log(boxShadow);
}

const configs = [
  {
    isText: true,
    target: "#lsp-editabletext",
    labelText: "Text Content",
    textValue: "Hello, World!",
    placeholder: "Enter a text.",
  },
  {
    labelText: "Font Size",
    property: "fontSize",
    numberValue: 16,
  },
  {
    select: true,
    labelText: "Font Type",
    property: "font-family",
    options: [
      "Arial, sans-serif",
      "Verdana, sans-serif",
      "Tahoma, sans-serif",
      "Trebuchet MS, sans-serif",
      "Georgia, serif",
      "Times New Roman, serif",
      "Courier New, monospace",
      "Lucida Console, monospace",
      "Brush Script MT, cursive",
      "Comic Sans MS, cursive",
      "Impact, fantasy",
      // "Product Sans, sans-serif",
    ],
  },
  {
    isColor: true,
    labelText: "Font Color",
    property: "color",
    initialColor: "#000000",
  },
  {
    select: true,
    labelText: "Font Weight",
    property: "font-weight",
    options: [
      "100", // Thin
      "200", // Extra Light
      "300", // Light
      "400", // Normal
      "500", // Medium
      "600", // Semi-Bold
      "700", // Bold
      "800", // Extra Bold
      "900", // Black
      "normal", // Keyword
      "bold", // Keyword
      "lighter", // Keyword
      "bolder", // Keyword
      "inherit", // Keyword
      "unset", // Keyword
      "initial", // Keyword
    ],
  },

  {
    labelText: "Corner Radius",
    property: "borderRadius",
    numberValue: 0,
  },
  {
    isColor: true,
    labelText: "Border Color",
    property: "borderColor",
    initialColor: "#000000",
  },

  {
    isColor: true,
    labelText: "Background Color",
    property: "backgroundColor",
    initialColor: "#FFFFFF",
  },
  // {
  //   labelText: "Padding (All Sides)",
  //   property: "padding",
  //   numberValue: 10,
  // },

  // {
  //   isColor: true,
  //   labelText: "Box Shadow Color",
  //   property: "boxShadowColor",
  //   initialColor: "#000000",
  //   x: true,
  // },
  // {
  //   labelText: "Box Shadow Horizontal Offset",
  //   property: "boxShadowX",
  //   numberValue: 0,
  //   x: true,
  // },
  // {
  //   labelText: "Box Shadow Vertical Offset",
  //   property: "boxShadowY",
  //   numberValue: 0,
  //   x: true,
  // },
  // {
  //   labelText: "Box Shadow Blur Radius",
  //   property: "boxShadowBlur",
  //   numberValue: 0,
  //   x: true,
  // },
  // {
  //   labelText: "Box Shadow Spread Radius",
  //   property: "boxShadowSpread",
  //   numberValue: 0,
  //   x: true,
  // },
  // {
  //   select: true,
  //   labelText: "Box Shadow Type",
  //   property: "boxShadowInset",
  //   options: ["none", "inset"],
  //   x: true,
  // },

  {
    labelText: "Padding Top",
    property: "paddingTop",
    numberValue: 10,
  },
  {
    labelText: "Padding Right",
    property: "paddingRight",
    numberValue: 10,
  },
  {
    labelText: "Padding Bottom",
    property: "paddingBottom",
    numberValue: 10,
  },
  {
    labelText: "Padding Left",
    property: "paddingLeft",
    numberValue: 10,
  },
  // {
  //   labelText: "Padding Horizontal (Left + Right)",
  //   property: "paddingInline",
  //   numberValue: 10,
  // },
  // {
  //   labelText: "Padding Vertical (Top + Bottom)",
  //   property: "paddingBlock",
  //   numberValue: 10,
  // },

  // {
  //   labelText: "Margin (All Sides)",
  //   property: "margin",
  //   numberValue: 0,
  // },
  {
    labelText: "Margin Top",
    property: "marginTop",
    numberValue: 0,
  },
  {
    labelText: "Margin Right",
    property: "marginRight",
    numberValue: 0,
  },
  {
    labelText: "Margin Bottom",
    property: "marginBottom",
    numberValue: 0,
  },
  {
    labelText: "Margin Left",
    property: "marginLeft",
    numberValue: 0,
  },
  // {
  //   labelText: "Margin Horizontal (Left + Right)",
  //   property: "marginInline",
  //   numberValue: 0,
  // },
  // {
  //   labelText: "Margin Vertical (Top + Bottom)",
  //   property: "marginBlock",
  //   numberValue: 0,
  // },

  {
    select: true,
    labelText: "Border Style",
    property: "borderStyle",
    options: [
      "solid",
      "none",
      "dashed",
      "dotted",
      "double",
      "groove",
      "ridge",
      "inset",
      "outset",
    ],
  },
  {
    labelText: "Border Width",
    numberValue: 2,
    property: "borderWidth",
  },

  // {
  //   select: true,
  //   labelText: "Box Shadow",
  //   property: "boxShadow",
  //   options: [
  //     "none",
  //     "inset",
  //     "0px 4px 6px rgba(0, 0, 0, 0.1)",
  //     "0px 2px 12px rgba(0, 0, 0, 0.2)",
  //     "0px 6px 20px rgba(0, 0, 0, 0.25)",
  //   ],
  // },
  {
    labelText: "Width",
    property: "width",
    // numberValue: 100,
    format: "%",
    numberValue: 100,
    options: [
      "initial",
      "unset",
      "auto",
      "fit-content",
      "max-content",
      "fit-content",
    ],
  },
  {
    labelText: "Height",
    property: "height",
    rangeMax: 1000,
    numberValue: "auto",
    options: ["unset", "auto", "fit-content", "max-content", "fit-content"],
  },
  {
    select: true,
    labelText: "Box Sizing",
    property: "boxSizing",
    options: ["content-box", "border-box", "auto", "initial"],
  },
  {
    select: true,
    labelText: "Display",
    property: "display",
    options: [
      "block",
      "inline",
      "flex",
      "grid",
      "none",
      "inline-block",
      "inline-flex",
      "inline-grid",
    ],
  },

  {
    select: true,
    labelText: "Text Align",
    property: "textAlign",
    options: ["left", "right", "center", "justify", "start", "end"],
  },

  {
    select: true,
    labelText: "Overflow",
    property: "overflow",
    options: ["visible", "hidden", "scroll", "auto"],
  },

  // {
  //   select: true,
  //   labelText: "Vertical Align (Inline)",
  //   property: "verticalAlign",
  //   options: [
  //     "unset",
  //     "baseline",
  //     "top",
  //     "middle",
  //     "bottom",
  //     "sub",
  //     "super",
  //     "text-top",
  //     "text-bottom",
  //   ],
  // },

  {
    select: true,
    labelText: "Flex Direction (flex)",
    property: "flexDirection",
    options: ["row", "column", "row-reverse", "column-reverse"],
    require: {
      display: "flex",
    },
  },

  {
    select: true,
    labelText: "Justify Content (flex)",
    property: "justifyContent",
    options: [
      "flex-start",
      "flex-end",
      "center",
      "space-between",
      "space-around",
      "space-evenly",
    ],
    require: {
      display: "flex",
    },
  },

  {
    select: true,
    labelText: "Align Items (flex)",
    property: "alignItems",
    options: ["stretch", "flex-start", "flex-end", "center", "baseline"],
    require: {
      display: "flex",
    },
  },

  {
    select: true,
    labelText: "Align Self (flex)",
    property: "alignSelf",
    options: [
      "auto",
      "flex-start",
      "flex-end",
      "center",
      "baseline",
      "stretch",
    ],
    require: {
      display: "flex",
    },
  },

  {
    labelText: "Gap (flex)",
    property: "gap",
    numberValue: 10,
    require: {
      display: "flex",
    },
  },

  {
    select: true,
    labelText: "Float",
    property: "float",
    options: ["left", "right", "none"],
  },

  {
    select: true,
    labelText: "Clear",
    property: "clear",
    options: ["left", "right", "both", "none"],
  },

  {
    select: true,
    labelText: "Visibility",
    property: "visibility",
    options: ["visible", "hidden", "collapse"],
  },

  {
    select: true,
    labelText: "Z-Index",
    property: "zIndex",
    options: ["auto", "0", "1", "2", "3", "4", "5", "10", "9999"],
  },

  {
    select: true,
    labelText: "Object Fit",
    property: "objectFit",
    options: ["fill", "contain", "cover", "none", "scale-down"],
  },
  {
    labelText: "Zoom",
    property: "zoom",
    numberValue: 100,
    rangeMin: 1,
    rangeMax: 200,
    rangeStep: 0.1,
    format: "%",
  },
];

const optionElems = [];

const resetLogic = () => {
  for (const opt of optionElems) {
    opt.resetValue();
  }
};

const copyLogic = async () => {
  const str = generateCSS();
  console.log(str);
  await navigator.clipboard.writeText(str);
};

export function firstOpen() {
  const fileNameX = document.querySelector("#lsp-name");
  fileNameX.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      fileNameX.blur();
    }
  });
  const configsElem = document.querySelector("#lsp-configs");
  const copyButton = document.querySelector("#lsp-copyres");
  const resetButton = document.querySelector("#lsp-reset");

  resetButton.addEventListener("click", resetLogic);
  copyButton.addEventListener("click", copyLogic);

  for (const config of configs) {
    // const option =
    //   config.select === true
    //     ? createCustomOptionSelect(config)
    //     : config.isColor
    //     ? createOptionColor(config)
    //     : createCustomOption(config);
    const option = createOption(config);
    optionElems.push(option);
    option.resetValue();
    // configsElem.append(option, document.createElement("br"));
    configsElem.appendChild(option);
  }
}

function createOption(config) {
  let {
    labelText,
    numberValue = 0,
    rangeMin = 0,
    rangeMax = 200,
    target,
    rangeStep = 1,
    placeholder = "",
    initialColor = "#000000",
    options = [],
    selectedValue = options[0],
    onInputHandler,
    property = "",
    textValue,
    select = false,
    isColor = false,
    isText = false,
    require = {},
    x = false,
    format = select ? "" : isColor ? "" : isText ? "" : "px",
  } = config;
  let willShow = false;

  const result = document.querySelector(target ?? "#lsp-preview");
  const container = document.createElement("div");
  container.result = result;
  result.styleX ??= {};
  container.changeListener = () => {};
  container.classList.add("lsp-option");
  container.config = config;

  const updateReq = () => {
    for (const a of optionElems) {
      for (const key in a.config.require) {
        const val = a.config.require[key];
        // console.log(key, val);
        if (a.result.style[key] === val) {
          a.style.display = "";
          // console.log("Hiding");
        } else {
          a.style.display = "none";
          // console.log("showing");
        }
      }
    }
  };

  const label = document.createElement("label");
  label.title = "Double click to reset.";
  label.classList.add("ml-label");
  label.textContent = `${labelText} ${format ? `(${format})` : ""}`;
  container.appendChild(label);

  if (property.includes("margin") || property.includes("padding")) {
    container.addEventListener("mouseenter", () => {
      highlightMarginsAndPadding(result);
    });
  }
  container.addEventListener("mouseleave", () => {
    removeHighlight(result);
  });

  let inputElement;

  if (isColor) {
    inputElement = document.createElement("input");
    inputElement.type = "color";
    inputElement.classList.add("ml-input-color");
    inputElement.value = initialColor;
    result[x ? "styleX" : "style"][property] = inputElement.value;
    // updateReq();

    inputElement.addEventListener("input", () => {
      result[x ? "styleX" : "style"][property] = inputElement.value;
      if (onInputHandler) onInputHandler();
      parseProps(result);
    });

    container.setValue = (color) => {
      inputElement.value = color;
      result[x ? "styleX" : "style"][property] = inputElement.value;
      // updateReq();
      parseProps(result);
    };

    container.resetValue = () => {
      container.setValue(initialColor);
    };
  } else if (select) {
    inputElement = document.createElement("select");
    inputElement.classList.add("ml-input");

    options.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.textContent = option;
      inputElement.appendChild(optionElement);
    });

    inputElement.value = selectedValue;
    result[x ? "styleX" : "style"][property] = `${selectedValue}${format}`;

    updateReq();

    inputElement.addEventListener("change", () => {
      result[x ? "styleX" : "style"][
        property
      ] = `${inputElement.value}${format}`;
      if (onInputHandler) onInputHandler();
      updateReq();
      parseProps(result);
    });

    container.setValue = (value) => {
      inputElement.value = value;
      result[x ? "styleX" : "style"][property] = `${value}${format}`;
      updateReq();
      parseProps(result);
    };

    container.resetValue = () => {
      container.setValue(selectedValue);
    };
  } else if (isText) {
    inputElement = document.createElement("textarea");
    inputElement.classList.add("ml-textarea");
    inputElement.value = textValue;
    inputElement.placeholder = placeholder;
    result.textContent = inputElement.value;
    updateReq();

    inputElement.addEventListener("input", () => {
      result.textContent = inputElement.value;
      if (property.includes("margin") || property.includes("padding")) {
        highlightMarginsAndPadding(result);
      }

      parseProps(result);

      // updateReq();
    });

    container.setValue = (value) => {
      inputElement.value = value;
      result.textContent = inputElement.value;
      parseProps(result);

      // updateReq();
    };

    container.resetValue = () => {
      container.setValue(textValue);
    };
  } else {
    const numberInput = document.createElement("input");
    numberInput.type = "text";
    numberInput.classList.add("ml-input");
    numberInput.placeholder = "Value";
    numberInput.value = numberValue;
    if (options) {
      const uniqueId = "datalist-" + Math.random().toString(36).substr(2, 9);
      numberInput.setAttribute("list", uniqueId);
      numberInput.setAttribute("name", labelText);
      const datalist = document.createElement("datalist");
      datalist.id = uniqueId;
      for (const optionA of options) {
        const option = document.createElement("option");
        option.value = optionA;
        datalist.appendChild(option);
      }
      container.appendChild(datalist);
    }

    const rangeInput = document.createElement("input");
    rangeInput.type = "range";
    rangeInput.classList.add("ml-input-range");
    rangeInput.min = rangeMin;
    rangeInput.max = rangeMax;
    rangeInput.step = rangeStep;
    const num = numberValue;

    if (!isNaN(num)) {
      numberInput.value = num || "";
      rangeInput.value = num;
      result[x ? "styleX" : "style"][property] = `${rangeInput.value}${format}`;
    } else {
      result[x ? "styleX" : "style"][property] = `${numberInput.value}`;
    }
    // updateReq();

    numberInput.addEventListener("input", () => {
      const num = Math.min(Math.max(numberInput.value, rangeMin), rangeMax);

      if (!isNaN(num)) {
        numberInput.value = num || "";
        rangeInput.value = num;
        result[x ? "styleX" : "style"][
          property
        ] = `${rangeInput.value}${format}`;
      } else {
        result[x ? "styleX" : "style"][property] = `${numberInput.value}`;
      }
      if (property.includes("margin") || property.includes("padding")) {
        highlightMarginsAndPadding(result);
      }
      // updateReq();
      parseProps(result);
    });

    rangeInput.addEventListener("input", () => {
      numberInput.value = rangeInput.value;
      result[x ? "styleX" : "style"][property] = `${rangeInput.value}${format}`;
      if (onInputHandler) onInputHandler();
      if (property.includes("margin") || property.includes("padding")) {
        highlightMarginsAndPadding(result);
      }
      parseProps(result);

      // updateReq();
    });

    rangeInput.addEventListener("dblclick", () => {
      container.resetValue();
      if (property.includes("margin") || property.includes("padding")) {
        highlightMarginsAndPadding(result);
      }
      parseProps(result);
    });
    label.addEventListener("dblclick", () => {
      container.resetValue();
      if (property.includes("margin") || property.includes("padding")) {
        highlightMarginsAndPadding(result);
      }
      parseProps(result);
    });

    container.setValue = (value) => {
      const num = Math.min(Math.max(value, rangeMin), rangeMax);

      if (!isNaN(num)) {
        numberInput.value = num || "";
        rangeInput.value = num;
        result[x ? "styleX" : "style"][property] = `${num}${format}`;
      } else {
        numberInput.value = value;
        result[x ? "styleX" : "style"][property] = `${value}`;
      }

      // updateReq();
    };

    container.resetValue = () => {
      rangeInput.value = rangeMin;
      container.setValue(numberValue);
    };

    container.appendChild(numberInput);
    container.appendChild(rangeInput);
  }

  parseProps(result);

  label.addEventListener("dblclick", () => container.resetValue());

  if (inputElement) {
    container.appendChild(inputElement);
  }

  return container;
}

// function createCustomOption(config) {
//   const {
//     labelText,
//     numberValue = 0,
//     rangeMin = 0,
//     rangeMax = 200,
//     rangeStep = 1,
//     onInputHandler,
//     property = "",
//     format = "px",
//     select = false,
//   } = config;
//   const result = document.querySelector("#lsp-preview");
//   const container = document.createElement("div");
//   container.classList.add("lsp-option");

//   // <div class="ml-icon-tooltip">
//   //         <span class="ml-tooltip-text">LiaSpark Chrome</span>
//   //         <img
//   //           src="/css/icons/liachromevnew.png"
//   //           alt="Icon"
//   //           style="width: 50px"
//   //         />
//   //       </div>

//   // const tooltipCon = document.createElement("div");
//   // tooltipCon.classList.add("ml-icon-tooltip");
//   // const tipLabel = document.createElement("span");
//   // tipLabel.classList.add("ml-tooltip-text");
//   // tipLabel.textContent = "Double Click to reset.";

//   const label = document.createElement("label");
//   label.title = "Double click to reset.";
//   label.classList.add("ml-label");
//   label.textContent = `${labelText} ${format ? `(${format})` : ""}`;

//   const numberInput = document.createElement("input");
//   numberInput.type = "number";
//   numberInput.classList.add("ml-input");
//   numberInput.placeholder = "Value";
//   numberInput.value = numberValue;

//   const rangeInput = document.createElement("input");
//   rangeInput.type = "range";
//   rangeInput.classList.add("ml-input-range");
//   rangeInput.min = rangeMin;
//   rangeInput.max = rangeMax;
//   rangeInput.step = rangeStep;
//   rangeInput.value = numberValue;
//   result[x ? "styleX" : "style"][property] = `${rangeInput.value}${format}`;

//   const inputHandler = function () {
//     numberInput.value = rangeInput.value;
//     result[x ? "styleX" : "style"][property] = `${rangeInput.value}${format}`;
//     if (onInputHandler) {
//       onInputHandler();
//     }
//   };

//   numberInput.addEventListener("input", () => {
//     const num = Math.min(Math.max(numberInput.value, rangeMin), rangeMax);
//     numberInput.value = num;
//     rangeInput.value = num;
//     result[x ? "styleX" : "style"][property] = `${rangeInput.value}${format}`;
//   });

//   rangeInput.addEventListener("input", inputHandler);

//   rangeInput.addEventListener("dblclick", () => container.resetValue());
//   label.addEventListener("dblclick", () => container.resetValue());

//   // tooltipCon.appendChild(tipLabel)
//   // tooltipCon.appendChild(label);
//   // container.appendChild(tooltipCon);
//   container.appendChild(label);
//   container.appendChild(numberInput);
//   container.appendChild(rangeInput);
//   container.setValue = (value) => {
//     const num = Math.min(Math.max(value, rangeMin), rangeMax);
//     numberInput.value = num;
//     rangeInput.value = num;
//     result[x ? "styleX" : "style"][property] = `${rangeInput.value}${format}`;
//   };

//   container.resetValue = () => {
//     container.setValue(numberValue);
//   };

//   container.config = config;

//   return container;
// }

// function createOptionColor(config) {
//   const {
//     labelText,
//     initialColor = "#000000",
//     onInputHandler,
//     property = "",
//     format = "",
//   } = config;
//   const result = document.querySelector("#lsp-preview");
//   const container = document.createElement("div");
//   container.classList.add("lsp-option");

//   const label = document.createElement("label");
//   label.title = "Double click to reset.";

//   label.classList.add("ml-label");
//   label.textContent = labelText;

//   const colorInput = document.createElement("input");
//   colorInput.type = "color";
//   colorInput.classList.add("ml-input-color");
//   colorInput.value = initialColor;
//   result[x ? "styleX" : "style"][property] = colorInput.value;

//   const inputHandler = function () {
//     result[x ? "styleX" : "style"][property] = colorInput.value;
//     if (onInputHandler) {
//       onInputHandler();
//     }
//   };

//   label.addEventListener("dblclick", () => container.resetValue());

//   colorInput.addEventListener("input", inputHandler);

//   container.appendChild(label);
//   container.appendChild(colorInput);
//   container.setValue = (color) => {
//     colorInput.value = color;
//     result[x ? "styleX" : "style"][property] = colorInput.value;
//   };

//   container.resetValue = () => {
//     container.setValue(initialColor);
//   };

//   container.config = config;

//   return container;
// }

// function createCustomOptionSelect(config) {
//   const {
//     labelText,
//     options = [],
//     selectedValue = options[0],
//     onInputHandler,
//     property = "",
//     format = "",
//   } = config;

//   const result = document.querySelector("#lsp-preview");
//   const container = document.createElement("div");
//   container.classList.add("lsp-option");

//   const label = document.createElement("label");
//   label.title = "Double click to reset.";

//   label.classList.add("ml-label");
//   label.textContent = `${labelText} ${format ? `(${format})` : ""}`;

//   const selectInput = document.createElement("select");
//   selectInput.classList.add("ml-input");

//   options.forEach((option) => {
//     const optionElement = document.createElement("option");
//     optionElement.value = option;
//     optionElement.textContent = option;
//     selectInput.appendChild(optionElement);
//   });

//   label.addEventListener("dblclick", () => container.resetValue());

//   selectInput.value = selectedValue;
//   result[x ? "styleX" : "style"][property] = `${selectedValue}${format}`;

//   const inputHandler = function () {
//     result[x ? "styleX" : "style"][property] = `${selectInput.value}${format}`;
//     if (onInputHandler) {
//       onInputHandler();
//     }
//   };

//   selectInput.addEventListener("change", inputHandler);

//   container.appendChild(label);
//   container.appendChild(selectInput);
//   container.setValue = (value) => {
//     selectInput.value = value;
//     result[x ? "styleX" : "style"][property] = `${value}${format}`;
//   };

//   container.resetValue = () => {
//     container.setValue(selectedValue);
//   };

//   container.config = config;

//   return container;
// }

export const menuBar = [
  {
    name: "File",
    data: [
      // {
      //   label: "New",
      //   callback(event) {},
      // },
      {
        label: "Import",
        async callback(event) {
          const file = await fileHandler.open(".css");
          const data = await fileHandler.readFile(file, "text");
          const result = document.querySelector("#lsp-preview");
          const obj = parseCSSToStyleObject(data);
          console.log("Import", obj);
          for (const opt of optionElems) {
            const val = obj[opt.config.property];
            if (val) {
              opt.setValue(val.replace(opt.config.format ?? "px", ""));
            }
          }
        },
      },
      {
        label: "Export",
        async callback(event) {
          const fileName = document.querySelector("#lsp-name")?.textContent;
          const str = generateCSS();
          await fileHandler.save(str, `${fileName.replaceAll(" ", "_")}.css`);
        },
      },
    ],
  },
  {
    name: "Edit",
    data: [
      {
        label: "Reset All",
        callback: resetLogic,
      },
      {
        label: "Copy as CSS",
        callback: copyLogic,
      },
    ],
  },
  {
    name: "Credits",
    data: [
      {
        label: "Liane Cagara 🎀",
        callback(event) {
          window.open("https://github.com/lianecagara");
        },
      },
    ],
  },
];

// function highlightMarginsAndPadding(element) {}

// function removeHighlight(element) {}

function highlightMarginsAndPadding(element) {
  removeHighlight(element);
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);

  // const marginTop =
  //   parseInt(element.style.marginTop) || parseInt(style.marginTop);
  // const marginRight =
  //   parseInt(element.style.marginRight) || parseInt(style.marginRight);
  // const marginBottom =
  //   parseInt(element.style.marginBottom) || parseInt(style.marginBottom);
  // const marginLeft =
  //   parseInt(element.style.marginLeft) || parseInt(style.marginLeft);
  const marginTop = 0;
  const marginLeft = 0;
  const marginBottom = 0;
  const marginRight = 0;

  const paddingTop =
    parseInt(element.style.paddingTop) || parseInt(style.paddingTop);
  const paddingRight =
    parseInt(element.style.paddingRight) || parseInt(style.paddingRight);
  const paddingBottom =
    parseInt(element.style.paddingBottom) || parseInt(style.paddingBottom);
  const paddingLeft =
    parseInt(element.style.paddingLeft) || parseInt(style.paddingLeft);

  const highlightWrapper = document.createElement("div");
  highlightWrapper.classList.add("highlight-wrapper");
  highlightWrapper.style.position = "absolute";
  highlightWrapper.style.top = `${rect.top - marginTop}px`;
  highlightWrapper.style.left = `${rect.left - marginLeft}px`;
  highlightWrapper.style.width = `${rect.width + marginLeft + marginRight}px`;
  highlightWrapper.style.height = `${rect.height + marginTop + marginBottom}px`;
  highlightWrapper.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
  highlightWrapper.style.border = "2px dashed red";
  highlightWrapper.style.pointerEvents = "none";
  document.body.appendChild(highlightWrapper);

  const paddingHighlight = document.createElement("div");
  paddingHighlight.classList.add("highlight-wrapper");
  paddingHighlight.style.position = "absolute";
  paddingHighlight.style.top = `${rect.top + marginTop + paddingTop}px`;
  paddingHighlight.style.left = `${rect.left + marginLeft + paddingLeft}px`;
  paddingHighlight.style.width = `${rect.width - paddingLeft - paddingRight}px`;
  paddingHighlight.style.height = `${
    rect.height - paddingTop - paddingBottom
  }px`;
  paddingHighlight.style.backgroundColor = "rgba(0, 0, 255, 0.2)";
  paddingHighlight.style.border = "2px dashed blue";
  paddingHighlight.style.pointerEvents = "none";
  document.body.appendChild(paddingHighlight);
}

function removeHighlight() {
  const highlightWrappers = document.querySelectorAll(".highlight-wrapper");
  highlightWrappers.forEach((wrapper) => wrapper.remove());
}

function generateCSS(customSelector = ".lsp-container") {
  let cssOutput = "";
  let styles = "";

  optionElems.forEach((option) => {
    const resultElement = option.result;

    if (resultElement && resultElement.style) {
      if (resultElement.styleX) {
        parseProps(resultElement);
      }

      const { property } = option.config;
      if (resultElement.style[property]) {
        const formattedProperty = property
          .replace(/([A-Z])/g, "-$1")
          .toLowerCase();
        const value = resultElement.style[property];

        styles += `  ${formattedProperty}: ${value};\n`;
      }
    }
  });
  const result = document.querySelector("#lsp-preview");
  styles += `  box-shadow: ${result.style.boxShadow};\n`;

  if (customSelector) {
    cssOutput += `${customSelector} {\n${styles.trimEnd()}\n}`;
  }
  return cssOutput;
}

function parseCSSToStyleObject(cssString) {
  const styleObject = {};
  cssString = cssString.replace(/\/\*[\s\S]*?\*\//g, "");
  const regex = /([^{]+)\s*\{\s*([^}]+)\s*\}/;
  const match = regex.exec(cssString);

  if (match) {
    const styles = match[2].trim();
    styles.split(";").forEach((style) => {
      let [property, value] = style.split(":").map((part) => part.trim());
      if (property && value) {
        const camelCaseProperty = property.replace(
          /-([a-z])/g,
          (match, letter) => letter.toUpperCase()
        );
        if (value.startsWith("rgb")) {
          value = autoHexCode(value);
        }
        styleObject[camelCaseProperty] = value;
      }
    });
  }

  return styleObject;
}

function autoHexCode(color) {
  if (/^rgb/i.test(color)) {
    const rgbValues = color.match(/\d+/g);
    if (rgbValues && rgbValues.length === 3) {
      const [r, g, b] = rgbValues.map((val) =>
        parseInt(val).toString(16).padStart(2, "0")
      );
      return `#${r}${g}${b}`;
    }
  }
  return color;
}
