import { isValidElement, type ReactElement } from 'react';
import { type IconType } from 'react-icons';
import { LuX } from 'react-icons/lu';

import Avatar, { type AvatarProps } from './Avatar';
import Indicator from './Indicator';
import Text from './Text';
import { cn } from './../utilities';

/**
 * Base Badge Props
 */
type BaseProps = {
  /** Text label for the badge */
  label: string;
  /** Visual style variant */
  variant?: 'solid' | 'outline' | 'ghost';
  /** Color intent of the badge */
  intent?: 'default' | 'primary' | 'info' | 'warning' | 'success' | 'danger';
  /** Whether to use rounded (pill) style */
  rounded?: boolean;
  /** Additional CSS classes */
  className?: string;
};

/**
 * Props for badge without leading item
 */
type NoLeadingItem = {
  leadingItem?: never;
  config?: never;
  icon?: never;
  status?: never;
};

/**
 * Props for non-dismissible badge
 */
type NotDismissbileProps = {
  onDismiss?: never;
};

/**
 * Props for dismissible badge
 */
type DismissibleProps = {
  /** Function to call when dismiss button is clicked */
  onDismiss: () => void;
};

/**
 * Props for badge with avatar leading item
 */
type LeadingAvatar = {
  /** Type of leading item */
  leadingItem: 'avatar';
  /** Avatar configuration */
  config: AvatarProps;
};

type Icon = IconType | ReactElement;

/**
 * Props for badge with icon leading item
 */
type LeadingIcon = {
  /** Type of leading item */
  leadingItem: 'icon';
  /** Icon component */
  icon: Icon;
};

/**
 * Props for badge with indicator leading item
 */
type LeadingIndicator = {
  /** Type of leading item */
  leadingItem: 'indicator';
  /** Status of the indicator */
  status: 'neutral' | 'success' | 'warning' | 'danger';
};

/**
 * Combined badge props
 */
type BadgeProps = BaseProps &
  (DismissibleProps | NotDismissbileProps) &
  (NoLeadingItem | LeadingAvatar | LeadingIcon | LeadingIndicator);

/**
 * Checks if the badge has a leading avatar
 */
const hasLeadingAvatar = (
  props: BadgeProps
): props is BaseProps & LeadingAvatar => props.leadingItem === 'avatar';

/**
 * Checks if the badge has a leading icon
 */
const hasLeadingIcon = (props: BadgeProps): props is BaseProps & LeadingIcon =>
  props.leadingItem === 'icon';

/**
 * Checks if the badge has a leading indicator
 */
const hasLeadingIndicator = (
  props: BadgeProps
): props is BaseProps & LeadingIndicator => props.leadingItem === 'indicator';

/**
 * Checks if the badge is dismissible
 */
const isDismissible = (
  props: BadgeProps
): props is BaseProps & DismissibleProps => props.onDismiss !== undefined;

/**
 * Renders an avatar component for the badge
 */
const renderAvatar = (config: AvatarProps, rounded: boolean) => {
  const AvatarComponent =
    config.variant === 'image' ? (
      <Avatar
        variant="image"
        size={config.size}
        src={config.src}
        alt={config.alt}
        rounded={rounded}
      />
    ) : config.variant === 'initials' ? (
      <Avatar
        variant="initials"
        size={config.size}
        initials={config.initials}
        rounded={rounded}
      />
    ) : (
      <Avatar size={config.size} rounded={rounded} />
    );

  return AvatarComponent;
};

/**
 * Renders an icon component for the badge
 */
const renderIcon = (Icon: Icon) => {
  if (isValidElement(Icon)) {
    return Icon;
  }
  if (typeof Icon === 'function') {
    return <Icon size={12} />;
  }
  return null;
};

/**
 * Renders an indicator component for the badge
 */
const renderIndicator = (status: LeadingIndicator['status']) => (
  <Indicator status={status} className="border-[0.063em] border-light" />
);

/**
 * Badge component for displaying short labels, tags or status.
 *
 * @prop {string} [label='Badge'] - Text label for the badge
 * @prop {'solid' | 'outline' | 'ghost'} [variant='solid'] - Visual style variant
 * @prop {'default' | 'primary' | 'info' | 'warning' | 'success' | 'danger'} [intent='default'] - Color intent of the badge
 * @prop {boolean} [rounded=false] - Whether to use rounded (pill) style
 * @prop {string} [className] - Additional CSS classes
 * @prop {'avatar' | 'icon' | 'indicator'} [leadingItem] - Type of leading item to display
 * @prop {AvatarProps} [config] - Avatar configuration when leadingItem is 'avatar'
 * @prop {IconType | ReactElement} [icon] - Icon component when leadingItem is 'icon'
 * @prop {'neutral' | 'success' | 'warning' | 'danger'} [status] - Status when leadingItem is 'indicator'
 * @prop {Function} [onDismiss] - Function to call when dismiss button is clicked, makes the badge dismissible
 *
 * @example Basic badge
 * ```tsx
 * <Badge label="New" intent="primary" />
 * ```
 *
 * @example Dismissible outline badge
 * ```tsx
 * <Badge label="Remove" variant="outline" intent="danger" onDismiss={() => {}} />
 * ```
 *
 * @example Badge with avatar
 * ```tsx
 * <Badge
 *   label="John Doe"
 *   leadingItem="avatar"
 *   config={{
 *     variant: "initials",
 *     initials: "JD",
 *     size: 20
 *   }}
 *   rounded
 * />
 * ```
 *
 * @example Badge with indicator
 * ```tsx
 * <Badge label="Active" leadingItem="indicator" status="success" />
 * ```
 */
const Badge = (props: BadgeProps) => {
  const {
    label = 'Badge',
    rounded = false,
    variant = 'solid',
    intent = 'default',
    leadingItem,
    onDismiss,
    className,
  } = props;

  // Base styles
  const baseStyles =
    'flex gap-1 items-center px-[0.375rem] py-0.5 min-h-5 drop-shadow-sm w-max';

  // Rounded styles
  const roundedStyles = rounded ? 'rounded-3xl' : 'rounded';

  // Leading item styles
  const leadingItemStyles =
    {
      icon: 'pl-1',
      avatar: 'pl-0.5',
      indicator: 'pl-[0.375rem]',
    }[leadingItem as string] || '';

  // Dismissible styles
  const dismissibleStyles = onDismiss !== undefined ? 'pr-1' : '';

  // Variant specific styles
  const variantStyles = {
    solid: {
      default: 'bg-interface text border border-subtle',
      primary: 'bg-brand text-on-brand',
      info: 'bg-info text-on-info',
      success: 'bg-success text-on-success',
      warning: 'bg-warning text-on-warning',
      danger: 'bg-danger text-on-danger',
    }[intent],
    outline: {
      default: 'bg-interface text border border-subtle',
      primary: 'bg-brand-subtle text-on-brand-subtle border border-brand',
      info: 'bg-info-subtle text-on-info-subtle border border-info',
      success: 'bg-success-subtle text-on-success-subtle border border-success',
      warning: 'bg-warning-subtle text-on-warning-subtle border border-warning',
      danger: 'bg-danger-subtle text-on-danger-subtle border border-danger',
    }[intent],
    ghost: {
      default: 'bg-interface-subtle text',
      primary: 'bg-brand-subtle text-on-brand-subtle',
      info: 'bg-info-subtle text-on-info-subtle',
      success: 'bg-success-subtle text-on-success-subtle',
      warning: 'bg-warning-subtle text-on-warning-subtle',
      danger: 'bg-danger-subtle text-on-danger-subtle',
    }[intent],
  }[variant];

  return (
    <div
      className={cn(
        baseStyles,
        roundedStyles,
        leadingItemStyles,
        dismissibleStyles,
        variantStyles,
        className
      )}
    >
      {hasLeadingAvatar(props) ? renderAvatar(props.config, rounded) : null}
      {hasLeadingIcon(props) ? renderIcon(props.icon) : null}
      {hasLeadingIndicator(props) ? renderIndicator(props.status) : null}
      <Text size="overline" color="inherit">
        {label}
      </Text>
      {isDismissible(props) && (
        <LuX size={12} className="cursor-pointer" onClick={onDismiss} />
      )}
    </div>
  );
};

export default Badge;
