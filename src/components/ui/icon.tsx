import React from 'react'
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as IoIcons from 'react-icons/io';
import * as GiIcons from 'react-icons/gi';
import * as LuIcons from 'react-icons/lu';
import { MdOutlineHealthAndSafety } from "react-icons/md";

// Puedes importar otros sets de iconos según lo necesites

// Combinamos todos los iconos en un único objeto
const iconos = {
  ...FaIcons,
  ...MdIcons,
  ...IoIcons,
  ...GiIcons,
  ...LuIcons,
};


interface IconProps extends React.HTMLAttributes<HTMLElement> {
  iconName: string;  // nombre del icono, por ejemplo "FaBeer"
  size?: number | string;
  color?: string;
  className?: string;
}

export const Icon = ({ iconName, className, ...rest }: IconProps) => {
  const IconComponent = iconos[iconName as keyof typeof iconos];

  if (!IconComponent) {
    return <MdOutlineHealthAndSafety className={className} />
  }

  const svgSpecificProps = Object.fromEntries(
    Object.entries(rest).filter(([key]) =>
      key.startsWith('aria-') || key.startsWith('data-') || key === 'role' || key === 'tabIndex'
    )
  );
  return <IconComponent className={className} {...svgSpecificProps} />;
}





