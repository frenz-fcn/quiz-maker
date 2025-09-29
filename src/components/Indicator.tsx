import { cn } from './../utilities';

/**
 * Props for the Indicator component
 */
export interface IndicatorProps {
  /** Size of the indicator */
  size?: 'sm' | 'md' | 'lg';
  /** Status/color of the indicator */
  status: 'neutral' | 'success' | 'danger' | 'warning';
  /** Additional CSS classes to apply to the indicator */
  className?: string;
}

/**
 * Indicator component for displaying status indicators.
 *
 * @prop {'sm' | 'md' | 'lg'} [size='default'] - Size of the indicator
 * @prop {'neutral' | 'success' | 'danger' | 'warning'} status - Status/color of the indicator
 * @prop {string} [className] - Additional CSS classes to apply to the indicator
 *
 * @example Basic indicator
 * ```tsx
 * <Indicator status="success" />
 * ```
 *
 * @example Custom sized indicator
 * ```tsx
 * <Indicator status="warning" size="lg" />
 * ```
 */
const Indicator = ({ size, status, className }: IndicatorProps) => {
  // Base styles
  const baseStyles = 'aspect-square rounded-full';

  // Size styles
  const sizeStyles = {
    sm: 'w-[0.375rem]',
    default: 'w-2',
    md: 'w-[0.625rem]',
    lg: 'w-4',
  }[size || 'default'];

  // Status styles
  const statusStyles = {
    neutral: 'bg-status-neutral',
    success: 'bg-status-success',
    warning: 'bg-status-warning',
    danger: 'bg-status-danger',
  }[status];

  return (
    <div className={cn(baseStyles, sizeStyles, statusStyles, className)} />
  );
};

export default Indicator;
