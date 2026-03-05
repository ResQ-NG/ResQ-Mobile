import React from "react";
import { SvgXml, type SvgProps } from "react-native-svg";

const HugeiconsArrowRight01Icon = (props: Omit<SvgProps, "xml">) => {
  const xml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 6s6 4.419 6 6s-6 6-6 6"/></svg>`;

  return <SvgXml xml={xml} {...props} />;
};

export default HugeiconsArrowRight01Icon;
