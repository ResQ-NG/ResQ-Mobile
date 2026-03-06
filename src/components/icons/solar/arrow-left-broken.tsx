import React from "react";
import { SvgXml, type SvgProps } from "react-native-svg";

const SolarArrowLeftBrokenIcon = (props: Omit<SvgProps, "xml">) => {
  const xml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m4 12l6-6m-6 6l6 6m-6-6h10.5m5.5 0h-2.5"/></svg>`;

  return <SvgXml xml={xml} {...props} />;
};

export default SolarArrowLeftBrokenIcon;
