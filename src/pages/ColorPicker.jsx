import React from "react";
import { ColorPickerComponent } from "@syncfusion/ej2-react-inputs";

import { Header } from "../components";

const colorPreviewElement = "preview";
const fitterStyle = "text-2xl font-semibold mt-2 mb-4";

const handleColorSelection = (args) => {
  document.getElementById(colorPreviewElement).style.backgroundColor =
    args.currentValue.hex;
};

const CustomColorPicker = ({ id, mode }) => (
  <ColorPickerComponent
    id={id}
    mode={mode}
    modeSwitcher={false}
    inline
    showButtons={false}
    change={handleColorSelection}
  />
);

const ColorPicker = () => (
  <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
    <Header category="App" title="Color Picker" />
    <div className="text-center">
      {/* Preview Pencil Widget */}
      <div id={colorPreviewElement} />
      <div className="flex justify-center items-center gap-20 flex-wrap">
        {/* Inline Pallete */}
        <div>
          <p className={fitterStyle}>Inline Pallete</p>
          <CustomColorPicker id="inline-palette" mode="Palette" />
        </div>

        {/* Color Picker Hexidecimal*/}
        <div>
          <p className={fitterStyle}>Inline Picker</p>
          <CustomColorPicker id="inline-picker" mode="Picker" />
        </div>
      </div>
    </div>
  </div>
);

export default ColorPicker;
