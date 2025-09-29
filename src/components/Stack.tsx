import { type ReactNode } from 'react';

import { cn } from './../utilities';

/**
 * Props for the Stack component
 */
interface StackProps {
  /** React children to be rendered inside the Stack */
  children: ReactNode;
  /** Additional CSS classes to apply to the Stack */
  className?: string;
  /** HTML element to render the Stack as */
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav' | 'main';
  /** Controls the flex direction. If true, uses row (horizontal), if false uses column (vertical) */
  horizontal?: boolean;
  /** Controls the width of the Stack */
  width?: 'auto' | 'full' | 'fit';
  /** Controls the height of the Stack */
  height?: 'auto' | 'full' | 'fit';
  /** Controls the justify-content property */
  justify?: 'start' | 'center' | 'end';
  /** Controls the align-items property */
  align?: 'start' | 'center' | 'end' | 'baseline';
  /** Controls the space distribution between items */
  distribute?: 'between' | 'around' | 'evenly' | 'stretch';
  /** Controls the gap between items in pixels */
  gap?:
    | '2'
    | '4'
    | '6'
    | '8'
    | '10'
    | '12'
    | '14'
    | '16'
    | '18'
    | '20'
    | '24'
    | '28'
    | '32'
    | '40'
    | '60';
  onClick?: () => void;
}

/**
 * Stack component for flexible layout arrangement.
 *
 * @prop {ReactNode} children - React children to be rendered inside the Stack
 * @prop {string} [className] - Additional CSS classes to apply to the Stack
 * @prop {'div' | 'section' | 'header' | 'footer' | 'nav' | 'main'} [as='div'] - HTML element to render the Stack as
 * @prop {boolean} [horizontal=false] - Controls the flex direction. If true, uses row (horizontal), if false uses column (vertical)
 * @prop {'auto' | 'full' | 'fit'} [width='auto'] - Controls the width of the Stack
 * @prop {'auto' | 'full' | 'fit'} [height] - Controls the height of the Stack
 * @prop {'start' | 'center' | 'end'} [justify] - Controls the justify-content property
 * @prop {'start' | 'center' | 'end' | 'baseline'} [align] - Controls the align-items property
 * @prop {'between' | 'around' | 'evenly' | 'stretch'} [distribute] - Controls the space distribution between items
 * @prop {'2' | '4' | '6' | '8' | '10' | '12' | '14' | '16' | '18' | '20' | '24' | '28' | '32' | '40' | '60'} [gap] - Controls the gap between items in pixels
 *
 * @example Basic vertical stack with gap
 * ```tsx
 * <Stack gap="8">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Stack>
 * ```
 *
 * @example Horizontal stack with items centered
 * ```tsx
 * <Stack horizontal justify="center" align="center" gap="16">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Stack>
 * ```
 *
 * @example Full width stack with distributed items
 * ```tsx
 * <Stack width="full" distribute="between" gap="24">
 *   <div>Left</div>
 *   <div>Right</div>
 * </Stack>
 * ```
 */
const Stack = ({
  as: Component = 'div',
  horizontal = false, //default direction is vertical
  width = 'auto',
  height,
  justify,
  align,
  gap,
  distribute,
  children,
  className,
  ...props
}: StackProps) => {
  // Base styles
  const baseStyles = 'flex';

  // Width styles
  const widthStyles = {
    auto: 'w-auto',
    full: 'w-full',
    fit: 'w-fit',
  }[width];

  // Height styles
  const heightStyles =
    height &&
    {
      auto: 'h-auto',
      full: 'h-full',
      fit: 'h-fit',
    }[height];

  // Direction styles
  const directionStyles = horizontal ? 'flex-row' : 'flex-col';

  // Justify styles
  const justifyStyles =
    justify &&
    {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
    }[justify];

  // Align styles
  const alignStyles =
    align &&
    {
      start: 'content-start items-start',
      center: 'content-center items-center',
      end: 'content-end items-end',
      baseline: 'items-baseline',
    }[align];

  // Distribute styles
  const distributeStyles =
    distribute &&
    {
      between: 'justify-between content-between',
      around: 'justify-around content-around',
      evenly: 'justify-evenly content-evenly',
      stretch: '*:flex-grow justify-stretch content-stretch',
    }[distribute];

  // Gap styles using the custom utility classes
  const gapStyles =
    gap &&
    {
      '2': 'gap-mds-2',
      '4': 'gap-mds-4',
      '6': 'gap-mds-6',
      '8': 'gap-mds-8',
      '10': 'gap-mds-10',
      '12': 'gap-mds-12',
      '14': 'gap-mds-14',
      '16': 'gap-mds-16',
      '18': 'gap-mds-18',
      '20': 'gap-mds-20',
      '24': 'gap-mds-24',
      '28': 'gap-mds-28',
      '32': 'gap-mds-32',
      '40': 'gap-mds-40',
      '60': 'gap-mds-60',
    }[gap];

  const styles = cn(
    baseStyles,
    widthStyles,
    heightStyles,
    directionStyles,
    justifyStyles,
    alignStyles,
    distributeStyles,
    gapStyles,
    className
  );

  return (
    <Component className={styles} {...props}>
      {children}
    </Component>
  );
};

export default Stack;
