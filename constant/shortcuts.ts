export const shortcuts = [
  {
    category: "Tools",
    items: [
      { key: "V", action: "Selection" },
      { key: "H", action: "Hand (pan)" },
      { key: "R", action: "Rectangle" },
      { key: "D", action: "Diamond" },
      { key: "O", action: "Ellipse" },
      { key: "L", action: "Line" },
      { key: "A", action: "Arrow" },
      { key: "P", action: "Pencil (freehand)" },
      { key: "T", action: "Text" },
      { key: "E", action: "Eraser" },
    ],
  },
  {
    category: "View",
    items: [
      { key: "Ctrl + +", action: "Zoom in" },
      { key: "Ctrl + -", action: "Zoom out" },
      { key: "Ctrl + 0", action: "Reset zoom" },
      { key: "Scroll", action: "Pan canvas" },
      { key: "Ctrl + Scroll", action: "Zoom" },
    ],
  },
  {
    category: "Edit",
    items: [
      { key: "Ctrl + Z", action: "Undo" },
      { key: "Ctrl + Shift + Z", action: "Redo" },
      { key: "Ctrl + D", action: "Duplicate" },
      { key: "Delete / Backspace", action: "Delete selected" },
    ],
  },
  {
    category: "Layers",
    items: [
      { key: "Ctrl + Shift + [", action: "Send to back" },
      { key: "Ctrl + [", action: "Send backward" },
      { key: "Ctrl + ]", action: "Bring forward" },
      { key: "Ctrl + Shift + ]", action: "Bring to front" },
    ],
  },
]