import { Chapter, ColorPalette, ColorPaletteRequest } from "@/assets/types";
import {
  createColorPalette,
  deleteColorPalette,
  getColorPalattes,
  getLatestChapter,
  updateColorPalette,
} from "./../../lib/Appwrite";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { PopoverPicker } from "./../popoverPicker";

type NewColorPalette = {
  name: string;
  primary: string;
  secondary: string;
  thirdly: string;
  fourthly: string;
  primaryText: string;
  secondaryText: string;
  accentText: string;
  background: string;
};

type SimpleColorPalette = {
  primary: string;
  secondary: string;
  thirdly: string;
  fourthly: string;
  primaryText: string;
  secondaryText: string;
  accentText: string;
  background: string;
};

const PageSettings = () => {
  const [colors, setColors] = useState<ColorPalette[]>();
  const [tempColors, setTempColors] = useState<ColorPalette[]>();
  const [accordionColorIndex, setAccordionColorIndex] = useState<number | null>(
    null
  );
  const [testColorPalette, setTestColorPalette] =
    useState<SimpleColorPalette>();

  const [newColorPalettes, setNewColorPalettes] = useState<NewColorPalette[]>();

  useEffect(() => {
    const fetchColors = async () => {
      const colors = (await getColorPalattes()) as ColorPaletteRequest;
      setColors(colors.documents);
      setTempColors(colors.documents);
    };
    fetchColors();
  }, []);

  const openAccordionColorIndex = (index: number) => {
    if (accordionColorIndex === index) {
      setAccordionColorIndex(null);
    } else {
      setAccordionColorIndex(index);
    }
  };

  useEffect(() => {
    const setColors = async () => {
      let colorPalette;
      try {
        const chapter: Chapter = (await getLatestChapter()) as Chapter;
        colorPalette = chapter?.ColorPalette;
      } catch (error) {
        console.log("No latest chapters found, using default colors.");
      }
      document.documentElement.style.setProperty(
        "--primary",
        testColorPalette?.primary || colorPalette?.primary || "#18ADF5"
      );
      document.documentElement.style.setProperty(
        "--secondary",
        testColorPalette?.secondary || colorPalette?.secondary || "#0B0A34"
      );
      document.documentElement.style.setProperty(
        "--thirdly",
        testColorPalette?.thirdly || colorPalette?.thirdly || "#00468C"
      );
      document.documentElement.style.setProperty(
        "--fourthly",
        testColorPalette?.fourthly || colorPalette?.fourthly || "#041031"
      );
      document.documentElement.style.setProperty(
        "--primaryText",
        testColorPalette?.primaryText || colorPalette?.primaryText || "#FFFFFF"
      );
      document.documentElement.style.setProperty(
        "--secondaryText",
        testColorPalette?.secondaryText ||
          colorPalette?.secondaryText ||
          "#969696"
      );
      document.documentElement.style.setProperty(
        "--accentText",
        testColorPalette?.accentText || colorPalette?.accentText || "#18ADF5"
      );
      document.documentElement.style.setProperty(
        "--background",
        testColorPalette?.background || colorPalette?.background || "#000000"
      );
    };
    setColors();
  }, [testColorPalette]);

  const handleSavingColors = async (id: string) => {
    if (tempColors) {
      const correctColorPalette = tempColors.find((color) => color.$id === id);
      const response = await updateColorPalette(
        id,
        correctColorPalette?.name || "New Color Palette",
        correctColorPalette?.primary || "#000000",
        correctColorPalette?.secondary || "#000000",
        correctColorPalette?.thirdly || "#000000",
        correctColorPalette?.fourthly || "#000000",
        correctColorPalette?.primaryText || "#000000",
        correctColorPalette?.secondaryText || "#000000",
        correctColorPalette?.accentText || "#000000",
        correctColorPalette?.background || "#000000"
      );
      if (response) {
        setColors(tempColors);
      }
    }
  };

  const handleNewColorPalette = async (index: number) => {
    if (newColorPalettes) {
      const correctColorPalette = newColorPalettes[index];
      const response = await createColorPalette(
        correctColorPalette.name,
        correctColorPalette.primary,
        correctColorPalette.secondary,
        correctColorPalette.thirdly,
        correctColorPalette.fourthly,
        correctColorPalette.primaryText,
        correctColorPalette.secondaryText,
        correctColorPalette.accentText,
        correctColorPalette.background
      );
      if (response) {
        window.location.reload();
      }
    }
  };

  const handleDeleteColorPalette = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this color palette?")) {
      await deleteColorPalette(id);
      window.location.reload();
      console.log(`Color palette with id ${id} deleted.`);
    }
  };

  return (
    <div className="flex flex-col w-full gap-4 h-fit">
      <div className="flex flex-col w-full gap-1">
        <h1 className="w-fit h-fit font-bold text-xl text-[--primaryText]">
          Page Settings
        </h1>
        <p className="text-[--secondaryText]">
          In here you can change some settings for the entire page such as the
          color palettes for chapters and socials links.
        </p>
      </div>
      <div className="flex flex-col w-full gap-4 h-fit">
        <h2 className="w-fit h-fit font-semibold text-lg text-[--primaryText]">
          Colors
        </h2>
        {tempColors && tempColors.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 h-fit">
            {tempColors.map((color, index) => {
              if (index === accordionColorIndex) {
                return (
                  <div className="w-full bg-[--secondary] h-fit py-2 px-4">
                    <div className="flex flex-row justify-between w-full h-fit">
                      <input
                        className="w-full h-10 p-2 text-[--primaryText] border border-transparent bg-[--secondary] focus-visible:outline-none rounded-none"
                        value={color.name}
                        onChange={(e) =>
                          setTempColors((prevColors = []) =>
                            prevColors.map((c, i) =>
                              i === index ? { ...c, name: e.target.value } : c
                            )
                          )
                        }
                      />
                      <ChevronDown
                        className="w-6 h-6 text-[--primaryText] cursor-pointer"
                        onClick={() => openAccordionColorIndex(index)}
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="w-full h-fit">
                        <p className="text-[--primaryText] text-sm">
                          Primary Color:
                        </p>
                        <PopoverPicker
                          color={color.primary}
                          onChange={(newColor: string) =>
                            setTempColors((prevColors = []) =>
                              prevColors.map((c, i) =>
                                i === index ? { ...c, primary: newColor } : c
                              )
                            )
                          }
                        />
                      </div>
                      <div className="w-full h-fit">
                        <p className="text-[--primaryText] text-sm">
                          Secondary Color:
                        </p>
                        <PopoverPicker
                          color={color.secondary}
                          onChange={(newColor: string) =>
                            setTempColors((prevColors = []) =>
                              prevColors.map((c, i) =>
                                i === index ? { ...c, secondary: newColor } : c
                              )
                            )
                          }
                        />
                      </div>
                      <div className="w-full h-fit">
                        <p className="text-[--primaryText] text-sm">
                          Thirdly Color:
                        </p>
                        <PopoverPicker
                          color={color.thirdly}
                          onChange={(newColor: string) =>
                            setTempColors((prevColors = []) =>
                              prevColors.map((c, i) =>
                                i === index ? { ...c, thirdly: newColor } : c
                              )
                            )
                          }
                        />
                      </div>
                      <div className="w-full h-fit">
                        <p className="text-[--primaryText] text-sm">
                          Fourthly Color:
                        </p>
                        <PopoverPicker
                          color={color.fourthly}
                          onChange={(newColor: string) =>
                            setTempColors((prevColors = []) =>
                              prevColors.map((c, i) =>
                                i === index ? { ...c, fourthly: newColor } : c
                              )
                            )
                          }
                        />
                      </div>
                      <div className="w-full h-fit">
                        <p className="text-[--primaryText] text-sm">
                          Primary Text Color:
                        </p>
                        <PopoverPicker
                          color={color.primaryText}
                          onChange={(newColor: string) =>
                            setTempColors((prevColors = []) =>
                              prevColors.map((c, i) =>
                                i === index
                                  ? { ...c, primaryText: newColor }
                                  : c
                              )
                            )
                          }
                        />
                      </div>
                      <div className="w-full h-fit">
                        <p className="text-[--primaryText] text-sm">
                          Secondary Text Color:
                        </p>
                        <PopoverPicker
                          color={color.secondaryText}
                          onChange={(newColor: string) =>
                            setTempColors((prevColors = []) =>
                              prevColors.map((c, i) =>
                                i === index
                                  ? { ...c, secondaryText: newColor }
                                  : c
                              )
                            )
                          }
                        />
                      </div>
                      <div className="w-full h-fit">
                        <p className="text-[--primaryText] text-sm">
                          Accent Text Color:
                        </p>
                        <PopoverPicker
                          color={color.accentText}
                          onChange={(newColor: string) =>
                            setTempColors((prevColors = []) =>
                              prevColors.map((c, i) =>
                                i === index ? { ...c, accentText: newColor } : c
                              )
                            )
                          }
                        />
                      </div>
                      <div className="w-full h-fit">
                        <p className="text-[--primaryText] text-sm">
                          Background Color:
                        </p>
                        <PopoverPicker
                          color={color.background}
                          onChange={(newColor: string) =>
                            setTempColors((prevColors = []) =>
                              prevColors.map((c, i) =>
                                i === index ? { ...c, background: newColor } : c
                              )
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="flex gap-6 mt-8">
                      <button
                        className="w-full h-10 p-2 text-[--primaryText] bg-gradient-to-r from-[--fourthly] via-[--thirdly] to-[--fourthly]"
                        onClick={() => {
                          setTestColorPalette(color);
                        }}
                        disabled={testColorPalette === color}
                      >
                        Test
                      </button>
                      <button
                        className="w-full h-10 p-2 text-[--primaryText] bg-gradient-to-r from-[--fourthly] via-[--thirdly] to-[--fourthly]"
                        onClick={() => {
                          setTempColors(() => {
                            const temp = [...tempColors];
                            if (colors) {
                              temp[index] = colors[index];
                            }
                            return temp;
                          });
                        }}
                      >
                        Reset
                      </button>
                      <button
                        className="w-full h-10 p-2 text-[--primaryText] bg-gradient-to-r from-[--fourthly] via-[--thirdly] to-[--fourthly]"
                        onClick={() => handleSavingColors(color.$id)}
                      >
                        Save
                      </button>
                      <button
                        className="w-full h-10 p-2 text-[--primaryText] bg-gradient-to-r from-[--fourthly] via-[--thirdly] to-[--fourthly]"
                        onClick={() => handleDeleteColorPalette(color.$id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="w-full bg-[--secondary] h-fit py-2 px-4">
                    <div className="flex flex-row justify-between w-full h-fit">
                      <h3 className="text-[--primaryText] font-semibold">
                        {color.name}
                      </h3>
                      <ChevronLeft
                        className="w-6 h-6 text-[--primaryText] cursor-pointer"
                        onClick={() => openAccordionColorIndex(index)}
                      />
                    </div>
                  </div>
                );
              }
            })}
          </div>
        ) : (
          <p className="text-[--secondaryText]">No color palettes found.</p>
        )}
        {newColorPalettes && newColorPalettes.length > 0 && (
          <div className="grid grid-cols-1 gap-4 h-fit">
            {newColorPalettes.map((color, index) => {
              return (
                <div className="w-full bg-[--secondary] h-fit py-2 px-4">
                  <div className="flex flex-row justify-between w-full h-fit">
                    <input
                      className="w-full h-10 p-2 text-[--primaryText] bg-[--background] border-[--primary] border-2 focus-visible:outline-none rounded-none"
                      value={color.name}
                      onChange={(e) =>
                        setNewColorPalettes((prevColors = []) =>
                          prevColors.map((c, i) =>
                            i === index ? { ...c, name: e.target.value } : c
                          )
                        )
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="w-full h-fit">
                      <p className="text-[--primaryText] text-sm">
                        Primary Color:
                      </p>
                      <PopoverPicker
                        color={color.primary}
                        onChange={(newColor: string) =>
                          setNewColorPalettes((prevColors = []) =>
                            prevColors.map((c, i) =>
                              i === index ? { ...c, primary: newColor } : c
                            )
                          )
                        }
                      />
                    </div>
                    <div className="w-full h-fit">
                      <p className="text-[--primaryText] text-sm">
                        Secondary Color:
                      </p>
                      <PopoverPicker
                        color={color.secondary}
                        onChange={(newColor: string) =>
                          setNewColorPalettes((prevColors = []) =>
                            prevColors.map((c, i) =>
                              i === index ? { ...c, secondary: newColor } : c
                            )
                          )
                        }
                      />
                    </div>
                    <div className="w-full h-fit">
                      <p className="text-[--primaryText] text-sm">
                        Thirdly Color:
                      </p>
                      <PopoverPicker
                        color={color.thirdly}
                        onChange={(newColor: string) =>
                          setNewColorPalettes((prevColors = []) =>
                            prevColors.map((c, i) =>
                              i === index ? { ...c, thirdly: newColor } : c
                            )
                          )
                        }
                      />
                    </div>
                    <div className="w-full h-fit">
                      <p className="text-[--primaryText] text-sm">
                        Fourthly Color:
                      </p>
                      <PopoverPicker
                        color={color.fourthly}
                        onChange={(newColor: string) =>
                          setNewColorPalettes((prevColors = []) =>
                            prevColors.map((c, i) =>
                              i === index ? { ...c, fourthly: newColor } : c
                            )
                          )
                        }
                      />
                    </div>
                    <div className="w-full h-fit">
                      <p className="text-[--primaryText] text-sm">
                        Primary Text Color:
                      </p>
                      <PopoverPicker
                        color={color.primaryText}
                        onChange={(newColor: string) =>
                          setNewColorPalettes((prevColors = []) =>
                            prevColors.map((c, i) =>
                              i === index ? { ...c, primaryText: newColor } : c
                            )
                          )
                        }
                      />
                    </div>
                    <div className="w-full h-fit">
                      <p className="text-[--primaryText] text-sm">
                        Secondary Text Color:
                      </p>
                      <PopoverPicker
                        color={color.secondaryText}
                        onChange={(newColor: string) =>
                          setNewColorPalettes((prevColors = []) =>
                            prevColors.map((c, i) =>
                              i === index
                                ? { ...c, secondaryText: newColor }
                                : c
                            )
                          )
                        }
                      />
                    </div>
                    <div className="w-full h-fit">
                      <p className="text-[--primaryText] text-sm">
                        Accent Text Color:
                      </p>
                      <PopoverPicker
                        color={color.accentText}
                        onChange={(newColor: string) =>
                          setNewColorPalettes((prevColors = []) =>
                            prevColors.map((c, i) =>
                              i === index ? { ...c, accentText: newColor } : c
                            )
                          )
                        }
                      />
                    </div>
                    <div className="w-full h-fit">
                      <p className="text-[--primaryText] text-sm">
                        Background Color:
                      </p>
                      <PopoverPicker
                        color={color.background}
                        onChange={(newColor: string) =>
                          setNewColorPalettes((prevColors = []) =>
                            prevColors.map((c, i) =>
                              i === index ? { ...c, background: newColor } : c
                            )
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="flex gap-6 mt-4">
                    <button
                      className="w-full h-10 p-2 text-[--primaryText] bg-gradient-to-r from-[--fourthly] via-[--thirdly] to-[--fourthly]"
                      onClick={() => {
                        setTestColorPalette(color);
                      }}
                      disabled={testColorPalette === color}
                    >
                      Test
                    </button>
                    <button
                      className="w-full h-10 p-2 text-[--primaryText] bg-gradient-to-r from-[--fourthly] via-[--thirdly] to-[--fourthly]"
                      onClick={() => {
                        setNewColorPalettes((prevColors = []) =>
                          prevColors.filter((_c, i) => i !== index)
                        );
                      }}
                    >
                      Delete
                    </button>
                    <button
                      className="w-full h-10 p-2 text-[--primaryText] bg-gradient-to-r from-[--fourthly] via-[--thirdly] to-[--fourthly]"
                      onClick={() => handleNewColorPalette(index)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {testColorPalette && (
          <div className="w-full mt-2 h-fit">
            <button
              className="w-full h-10 p-2 text-[--primaryText] bg-gradient-to-r from-[--thirdly] via-[--primary] to-[--thirdly]"
              onClick={() => setTestColorPalette(undefined)}
            >
              Turn off testing
            </button>
          </div>
        )}
        <div className="w-full mt-6 h-fit">
          <button
            className="w-full h-10 p-2 text-[--primaryText] bg-gradient-to-r from-[--fourthly] via-[--primary] to-[--fourthly]"
            onClick={() => {
              setNewColorPalettes((prevColors = []) => [
                ...prevColors,
                {
                  name: "New Color Palette",
                  primary: "#000000",
                  secondary: "#000000",
                  thirdly: "#000000",
                  fourthly: "#000000",
                  primaryText: "#000000",
                  secondaryText: "#000000",
                  accentText: "#000000",
                  background: "#000000",
                },
              ]);
            }}
          >
            Create New
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageSettings;
