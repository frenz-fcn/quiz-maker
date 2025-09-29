import React, { type ComponentProps } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

import { cn } from './../utilities';

import Text from './Text';
import Button from './Button';
import Stack from './Stack';

const MAP_VARIANT_CLASS = {
  default: 'bg-interface-subtle text border-b border-subtle',
  warning: 'bg-warning-subtle text-on-warning-subtle',
  danger: 'bg-danger-subtle text-on-danger-subtle',
  primary: 'bg-brand-subtle text-on-brand-subtle',
} as const;

const MAP_HEADER_TEXT_STYLE = {
  default: 'default',
  warning: 'on-warning-subtle',
  danger: 'on-danger-subtle',
} as const;

const MAP_PRIMARY_BUTTON_INTENT = {
  default: 'default',
  primary: 'primary',
  warning: 'warning',
  danger: 'danger',
} as const;

const MAP_MODAL_WIDTH_CLASS = {
  sm: 'max-w-sm',
  default: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '7xl': 'max-w-7xl',
} as const;

type Intent = Exclude<
  ComponentProps<typeof Button>['intent'],
  undefined | 'success' | 'info' | 'inverse'
>;
type Size = keyof typeof MAP_MODAL_WIDTH_CLASS;

type ModalProps = {
  onClose: () => void;
  title: string | React.ReactNode;
  intent?: Intent;
  size?: Size;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  tertiaryAction?: {
    label: string;
    onClick: () => void;
  };
  children: React.ReactNode;
};

export default function Modal({
  onClose,
  title,
  intent = 'default',
  size = 'default',
  primaryAction,
  secondaryAction,
  tertiaryAction,
  children,
}: ModalProps) {
  return (
    <Stack
      className={cn(
        'relative rounded-mds-8 border border-subtle bg-surface-raised shadow-lg',
        'h-fit w-screen overflow-clip',
        MAP_MODAL_WIDTH_CLASS[size]
      )}
    >
      <Stack
        horizontal
        align="center"
        className={cn(
          'h-full w-full items-center justify-between p-mds-24',
          MAP_VARIANT_CLASS[intent] as Intent
        )}
      >
        {typeof title === 'string' ? (
          <Text
            size="lead"
            weight="semibold"
            color={
              MAP_HEADER_TEXT_STYLE[
                intent as keyof typeof MAP_HEADER_TEXT_STYLE
              ]
            }
          >
            {title}
          </Text>
        ) : (
          title
        )}
        <button
          type="button"
          className="hover:shadow-button aspect-square rounded text-2xl duration-200 hover:bg-interface-hovered"
          onClick={onClose}
          aria-label="Close modal"
        >
          <IoCloseOutline />
        </button>
      </Stack>

      <div className="flex-1 p-mds-24">{children}</div>

      {(primaryAction || secondaryAction) && (
        <Stack
          horizontal
          distribute="between"
          className="w-full px-mds-14 pb-mds-24 pr-mds-24"
        >
          {tertiaryAction && (
            <Button
              variant="text"
              intent={MAP_PRIMARY_BUTTON_INTENT[intent]}
              className="h-fit px-mds-8 py-mds-6 capitalize hover:bg-transparent [&_span]:mx-0"
              onClick={() => {
                tertiaryAction.onClick();
              }}
            >
              {tertiaryAction.label}
            </Button>
          )}

          <Stack
            gap="4"
            horizontal
            justify="end"
            align="end"
            className="w-full"
          >
            {secondaryAction && (
              <Button
                variant="ghost"
                className="capitalize"
                onClick={() => {
                  secondaryAction.onClick();
                }}
              >
                {secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button
                variant="solid"
                intent={MAP_PRIMARY_BUTTON_INTENT[intent]}
                className="capitalize"
                onClick={() => {
                  primaryAction.onClick();
                }}
              >
                {primaryAction.label}
              </Button>
            )}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
