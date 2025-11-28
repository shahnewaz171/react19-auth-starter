import type { CustomIconProps } from '@/components/types/Icon';

const CustomIcon = ({ width = 100, height = 100 }: CustomIconProps) => (
  <svg width={width} height={height}>
    <circle cx="50" cy="50" r="40" stroke="green" strokeWidth="4" fill="yellow" />
  </svg>
);

export default CustomIcon;
