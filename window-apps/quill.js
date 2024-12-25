import { FileHandler } from "../tools/file.js";

export function firstOpen() {
  if (!window.doneQuill) {
    window.quill = new window.Quill("#quill-editor", {
      theme: "snow",
      modules: {
        toolbar: [
          // Text formatting options
          [{ font: [] }, { size: [] }], // Font and size dropdowns

          // Header options
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          // Text alignment options
          [{ align: [] }],

          // Text styling
          ["bold", "italic", "underline", "strike"], // Bold, italic, underline, strikethrough

          // Subscript / Superscript
          [{ script: "sub" }, { script: "super" }], // Subscript, superscript

          // Block formatting
          [{ list: "ordered" }, { list: "bullet" }], // Ordered list, bullet list
          [{ indent: "-1" }, { indent: "+1" }], // Outdent/Indent

          // Line styling
          [{ color: [] }, { background: [] }], // Text color, background color
          [{ direction: "rtl" }], // Right-to-left text

          // Code and blockquote
          ["blockquote", "code-block"], // Blockquote, code block

          // Link, image, and video
          ["link", "image", "video"],

          // Undo/Redo (requires custom bindings, see note below)
          ["clean"], // Clear formatting
        ],
      },
    });
    window.doneQuill = true;
  }
  // document.querySelector("#quillsave").addEventListener("click", () => {
  //   saveQuill();
  // });
}
// export function everyOpen() {
//   const tb = document.querySelector(".ql-toolbar");
//   const lc = document.querySelector("#quill-editor");
//   lc.style.height = `calc(100% - ${tb.clientHeight}px)`;
// }

export const extraMenu = [
  {
    label: "Copy as HTML",
    callback: saveQuill,
  },
];

function saveQuill() {
  const { quill } = window;
  const html = quill.root.innerHTML;
  console.log(html);
  navigator.clipboard
    .writeText(html)
    .then(() => {
      // alert("Copied as HTML!");
    })
    .catch((err) => {
      alert("Failed to copy");
      console.error(err);
    });
}

const fileHandler = new FileHandler();

export const menuBarClass = ["lia-menubar", "small", "_ribbon", "_side"];

export const menuBar = [
  {
    name: "File",
    data: [
      {
        label: "New",
        callback(event) {
          if (confirm("Warning: This will erase everything.")) {
            const { quill } = window;
            quill.root.innerHTML = "";
          }
        },
      },
      {
        label: "Open",
        async callback(event) {
          const file = await fileHandler.open(".txt");
          const data = await fileHandler.readFile(file, "text");
          const { quill } = window;
          quill.root.innerHTML = data;
        },
      },
      {
        label: "Download",
        async callback(event) {
          const { quill } = window;
          const html = quill.root.innerHTML;
          await fileHandler.save(html, "quill-project.txt");
        },
      },
    ],
  },
  {
    name: "Edit",
    data: [
      {
        label: "Copy as HTML",
        callback: saveQuill,
      },
      {
        html: `<p style="color: red">Deprecated</p>`,
      },
      {
        label: "Undo",
        callback() {
          document.execCommand("undo");
        },
      },
      {
        label: "Redo",
        callback() {
          document.execCommand("redo");
        },
      },
    ],
  },
  {
    name: "Format",
    data: [
      {
        html: `<p style="color: red">Deprecated</p>`,
      },
      {
        label: "Bold",
        callback() {
          document.execCommand("bold");
        },
      },
      {
        label: "Italic",
        callback() {
          document.execCommand("italic");
        },
      },
      {
        label: "Underline",
        callback() {
          document.execCommand("underline");
        },
      },
      {
        label: "Strike Through",
        callback() {
          document.execCommand("strikethrough");
        },
      },
      {
        label: "Insert Ordered List",
        callback() {
          document.execCommand("insertOrderedList");
        },
      },
      {
        label: "Insert Unordered List",
        callback() {
          document.execCommand("insertUnorderedList");
        },
      },
      {
        label: "Justify Left",
        callback() {
          document.execCommand("justifyLeft");
        },
      },
      {
        label: "Justify Center",
        callback() {
          document.execCommand("justifyCenter");
        },
      },
      {
        label: "Justify Right",
        callback() {
          document.execCommand("justifyRight");
        },
      },
      {
        label: "Justify Full",
        callback() {
          document.execCommand("justifyFull");
        },
      },
      {
        label: "Change Font Color",
        callback() {
          const color = prompt("Enter a font color (e.g., red, #ff0000):");
          if (color) {
            document.execCommand("foreColor", false, color);
          }
        },
      },
      {
        label: "Change Background Color",
        callback() {
          const color = prompt(
            "Enter a background color (e.g., yellow, #ffff00):"
          );
          if (color) {
            document.execCommand("hiliteColor", false, color);
          }
        },
      },
      {
        label: "Insert Link",
        callback() {
          const url = prompt("Enter the URL:");
          if (url) {
            document.execCommand("createLink", false, url);
          }
        },
      },
      {
        label: "Remove Link",
        callback() {
          document.execCommand("unlink");
        },
      },
      {
        label: "Increase Font Size",
        callback() {
          document.execCommand("fontSize", false, "5");
        },
      },
      {
        label: "Decrease Font Size",
        callback() {
          document.execCommand("fontSize", false, "2");
        },
      },
      {
        label: "Remove Formatting",
        callback() {
          document.execCommand("removeFormat");
        },
      },
    ],
  },
  {
    name: "View",
    data: [
      {
        label: "Large",
        callback(event) {
          const aa = document.querySelector("#quill-editor");
          aa.style.zoom = 2;
        },
      },
      {
        label: "Medium",
        callback(event) {
          const aa = document.querySelector("#quill-editor");
          aa.style.zoom = "";
        },
      },
      {
        label: "Small",
        callback(event) {
          const aa = document.querySelector("#quill-editor");
          aa.style.zoom = 0.5;
        },
      },
      {
        label: "Toggle Print Layout",
        callback(event) {
          const aa = document.querySelector("#quill-editor");
          aa.classList.toggle("print");
        },
      },
    ],
  },
  {
    name: "Credits",
    data: [
      {
        label: "Quill.js",
        callback(event) {
          window.open("https://quilljs.com/");
        },
      },
      {
        label: "Liane Cagara 🎀",
        callback(event) {
          window.open("https://github.com/lianecagara");
        },
      },
    ],
  },
];
