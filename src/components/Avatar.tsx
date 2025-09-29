import { BiSolidUser } from 'react-icons/bi';

import { cn } from './../utilities';

type DefaultProps = {
  variant?: undefined;
};

type ImageVariantProps = {
  variant: 'image';
  src: string;
  alt: string;
};

type InitialsVariantProps = {
  variant: 'initials';
  initials: string;
};

/**
 * Props for the Avatar component
 */

export type AvatarProps = {
  /** Size of the avatar in pixels */
  size?: '16' | '20' | '24' | '28' | '32' | '40' | '48' | '64';
  /** Whether the avatar should be displayed as a circle */
  rounded?: boolean;
  /** Additional CSS classes to apply to the avatar */
  className?: string;
} & (DefaultProps | ImageVariantProps | InitialsVariantProps);

// Note: Design System does not feature replacing the icon this component.
// Might revisit later if design reflects icon customizing

/**
 * Checks if the avatar is using the image variant
 */
const isImageVariant = (props: AvatarProps): props is ImageVariantProps =>
  props.variant === 'image' && props.src && props.alt ? true : false;

/**
 * Checks if the avatar is using the initials variant
 */
const isInitialVariant = (props: AvatarProps): props is InitialsVariantProps =>
  props.variant === 'initials' ? true : false;

/**
 * Avatar component for displaying user avatars with different variants.
 *
 * @prop {'16' | '20' | '24' | '28' | '32' | '40' | '48' | '64'} [size='16'] - Size of the avatar in pixels
 * @prop {boolean} [rounded=false] - Whether the avatar should be displayed as a circle
 * @prop {string} [className] - Additional CSS classes to apply to the avatar
 * @prop {undefined | 'image' | 'initials'} [variant] - The variant of the avatar
 * @prop {string} [src] - The source URL of the image (for image variant)
 * @prop {string} [alt] - The alt text for the image (for image variant)
 * @prop {string} [initials] - The initials to display (for initials variant)
 *
 * @example Default avatar
 * ```tsx
 * <Avatar size="32" />
 * ```
 *
 * @example Image avatar
 * ```tsx
 * <Avatar
 *   variant="image"
 *   size="48"
 *   src="/images/avatar.jpg"
 *   alt="User Avatar"
 *   rounded
 * />
 * ```
 *
 * @example Initials avatar
 * ```tsx
 * <Avatar variant="initials" size="40" initials="JD" />
 * ```
 */
const Avatar = (props: AvatarProps) => {
  const { rounded = false, size = '16', className } = props;

  // Base styles
  const baseStyles =
    'bg-surface border border-subtle relative grid place-items-center overflow-hidden';

  // Size and corner radius styles
  const sizeStyles = {
    '16': 'w-4 h-4 rounded-sm',
    '20': 'w-5 h-5 rounded',
    '24': 'w-6 h-6 rounded',
    '28': 'w-7 h-7 rounded-md',
    '32': 'w-8 h-8 rounded-md',
    '40': 'w-10 h-10 rounded-lg',
    '48': 'w-12 h-12 rounded-lg',
    '64': 'w-16 h-16 rounded-lg',
  }[size];

  // Rounded style (circle)
  const roundedStyle = rounded ? '!rounded-full' : '';

  // Icon styles
  const iconStyles = {
    '16': 'fill-icon-subtle absolute w-4 h-4 -bottom-0.5',
    '20': 'fill-icon-subtle absolute w-5 h-5 -bottom-0.5',
    '24': 'fill-icon-subtle absolute w-6 h-6 -bottom-1',
    '28': 'fill-icon-subtle absolute w-7 h-7 -bottom-1',
    '32': 'fill-icon-subtle absolute w-8 h-8 -bottom-1',
    '40': 'fill-icon-subtle absolute w-10 h-10 -bottom-1',
    '48': 'fill-icon-subtle absolute w-12 h-12 -bottom-1',
    '64': 'fill-icon-subtle absolute w-16 h-16 -bottom-2',
  }[size];

  // Initials styles
  const initialsStyles = {
    '16': 'text-subtle uppercase w-full h-full grid place-items-center text-[0.375rem]',
    '20': 'text-subtle uppercase w-full h-full grid place-items-center text-[0.5rem]',
    '24': 'text-subtle uppercase w-full h-full grid place-items-center text-[0.625rem]',
    '28': 'text-subtle uppercase w-full h-full grid place-items-center text-xs',
    '32': 'text-subtle uppercase w-full h-full grid place-items-center text-sm',
    '40': 'text-subtle uppercase w-full h-full grid place-items-center text-lg',
    '48': 'text-subtle uppercase w-full h-full grid place-items-center text-xl',
    '64': 'text-subtle uppercase w-full h-full grid place-items-center text-[1.375rem]',
  }[size];

  return (
    <div className={cn(baseStyles, sizeStyles, roundedStyle, className)}>
      {isImageVariant(props) ? (
        <img
          src={props.src}
          className="h-full w-full object-cover"
          alt={props.alt}
        />
      ) : isInitialVariant(props) ? (
        <div className={initialsStyles}>{props.initials.slice(0, 2)}</div>
      ) : (
        <BiSolidUser className={iconStyles} />
      )}
    </div>
  );
};

export default Avatar;
