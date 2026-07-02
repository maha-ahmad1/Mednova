import type { DeviceProduct } from "../types/device.types";

export const devices: DeviceProduct[] = [
  {
    id: "hrc10",
    pid: "SY-HRC10",
    category: "homecare",
    image: "/images/smart-devices/SY-HRC10.png",
    hostSize: "105x95x60mm",
  },
  {
    id: "hrc12",
    pid: "SY-HRC12",
    category: "homecare",
    image: "/images/smart-devices/SY-HRC12.png",
    hostSize: "145x145x55mm",
  },
  {
    id: "hre12e",
    pid: "SY-HRE12E",
    category: "homecare",
    image: "/images/smart-devices/SY-HRE12E.png",
    isBestSeller: true,
    hostSize: "145x145x55mm",
  },
  {
    id: "hrc15",
    pid: "SY-HRC15",
    category: "clinical",
    image: "/images/smart-devices/SY-HRC15.png",
    hostSize: "160x180x110mm",
  },
  {
    id: "hr06e",
    pid: "SY-HR06E",
    category: "clinical",
    image: "/images/smart-devices/SY-HR06E.png",
    isBestSeller: true,
    hostSize: "240x160x240mm",
  },
  {
    id: "hr08e",
    pid: "SY-HR08E",
    category: "clinical",
    image: "/images/smart-devices/SY-HR08E.png",
    hostSize: "300x160x275mm",
  },
  {
    id: "hr08g",
    pid: "SY-HR08G",
    category: "clinical",
    image: "/images/smart-devices/SY-HR08G.png",
  },
  {
    id: "uea2",
    pid: "SY-UEA2",
    category: "clinical",
    image: "/images/smart-devices/SY-UEA2.png",
  },
  {
    id: "uh01",
    pid: "SY-UH01",
    category: "accessories",
    image: "/images/smart-devices/SY-UH01.png",
  },
  {
    id: "m1",
    pid: "SY-M1",
    category: "accessories",
    image: "/images/smart-devices/SY-M1.png",
  },
];
