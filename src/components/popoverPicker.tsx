import React, { useCallback, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import useClickOutside from "./useClickOutside";

interface PopoverPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const PopoverPicker: React.FC<PopoverPickerProps> = ({
  color,
  onChange,
}) => {
  const popover = useRef<HTMLDivElement>(null);
  const [isOpen, toggle] = useState(false);

  const close = useCallback(() => toggle(false), []);
  useClickOutside(popover, close);

  return (
    <div className="relative">
      <div
        className="w-full h-8 cursor-pointer"
        style={{ backgroundColor: color }}
        onClick={() => toggle(true)}
      />

      {isOpen && (
        <div
          className="absolute top-[calc(100%_-_2px)] left-0 z-50"
          ref={popover}
        >
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
};
