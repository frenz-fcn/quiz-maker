import { useMemo } from 'react';
import { type IconType } from 'react-icons';

import { cn } from './../utilities';

import FieldWrapper, { type Props as WrapperProps } from './FieldWrapper';

type Props = {
  testId?: string;
  icon?: IconType;
  value: string;
  disabled?: boolean;
  maxLength?: number;
  placeholder?: string;
  type?: 'text' | 'email';
  onChange: (_value: string) => void;
  onPaste?: () => void;
} & WrapperProps;

function TextInput({
  name,
  value,
  error,
  icon: Icon,
  type = 'text',
  disabled = false,
  readOnly = false,
  testId = undefined,
  maxLength = undefined,
  placeholder = undefined,
  onChange,
  onPaste,
  ...rest
}: Props) {
  const hasIcon = useMemo(() => Boolean(Icon), [Icon]);
  return (
    <FieldWrapper name={name} error={error} readOnly={readOnly} {...rest}>
      <div className="relative w-full">
        {Icon ? (
          <Icon
            className={cn(
              'absolute left-[0.5625rem] top-1/2 h-[0.875rem] w-[0.875rem] -translate-y-1/2 text-subtle',
              disabled ? 'text-disabled' : '',
              error ? 'text-on-danger-subtle' : ''
            )}
          />
        ) : null}
        <input
          id={name}
          type={type}
          data-test-id={testId}
          value={value}
          className={cn(
            'h-9 w-full rounded-mds-4 border bg-white px-mds-10 pb-[0.063rem] text-body text placeholder:text-placeholder',
            'focus:outline-none disabled:bg-interface-disabled ',
            'read-only:text-on-interface-subtle read-only:bg-interface-subtle',
            hasIcon ? 'pl-mds-32' : 'pl-mds-10',
            error
              ? 'border-danger-subtle bg-danger-subtle text-on-danger-subtle'
              : 'focus:border-selected'
          )}
          onChange={(e) => {
            const { value } = e.target;
            if (typeof onChange === 'function') onChange(value);
          }}
          placeholder={readOnly ? '' : placeholder}
          disabled={readOnly ? false : disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          onPaste={onPaste}
        />
      </div>
    </FieldWrapper>
  );
}

export default TextInput;
