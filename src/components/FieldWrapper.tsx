import { useMemo } from 'react';
import { BiErrorCircle } from 'react-icons/bi';

import { cn } from './../utilities';
import Text from './Text';
import Stack from './Stack';

export type FieldError =
  | {
      message: string;
    }
  | string;

export type Props = {
  id?: string;
  name?: string;
  error?: FieldError;
  className?: string;
  readOnly?: boolean;
  asLabel?: boolean;
  gap?: React.ComponentProps<typeof Stack>['gap'];
} & (
  | {
      inline: true;
      label?: never;
      optional?: never;
      helpText?: never;
    }
  | {
      inline?: false;
      label?: string;
      optional?: boolean;
      helpText?: string;
    }
);

const FieldWrapper = ({
  id,
  name,
  error,
  children,
  readOnly,
  gap = '4',
  className,
  asLabel = true,
  ...rest
}: Props & {
  children: React.ReactNode;
}) => {
  const { inline, label, helpText, optional } = useMemo(() => {
    if (rest.inline)
      return {
        ...rest,
        label: undefined,
        optional: undefined,
        helpText: undefined,
      };
    return { ...rest, inline: false };
  }, [rest]);

  return (
    <Stack gap={gap} className={cn('flex-grow items-start', className)}>
      {(label || optional) && !inline && (
        <Stack horizontal gap="4">
          <Text
            size="caption"
            weight="medium"
            className="w-full text-nowrap text-subtle"
            {...(asLabel
              ? {
                  as: 'label',
                  htmlFor: id ? id : `id-${name}`,
                }
              : { as: 'h4' })}
          >
            {label}
          </Text>

          {optional && !readOnly ? (
            <Text
              size="caption"
              as="span"
              className="w-fit text-nowrap italic text-subtle"
            >
              - optional
            </Text>
          ) : null}
        </Stack>
      )}

      {children}

      {!inline &&
        (error ? (
          <Stack
            gap="2"
            horizontal
            align="center"
            className={cn(
              'min-h-[1rem] text-danger',
              ((!error && !helpText) || readOnly) && 'invisible'
            )}
          >
            <BiErrorCircle className="text-caption" />
            <Text size="caption" lineHeight="tight" color="inherit">
              {typeof error === 'object' ? error?.message : error}
            </Text>
          </Stack>
        ) : (
          <Text
            size="caption"
            lineHeight="tight"
            className={cn(
              'min-h-[1rem] text-subtle',
              ((!error && !helpText) || readOnly) && 'invisible'
            )}
          >
            {helpText}
          </Text>
        ))}
    </Stack>
  );
};

export default FieldWrapper;
