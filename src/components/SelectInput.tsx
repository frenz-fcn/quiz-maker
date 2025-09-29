import { createPortal } from 'react-dom';
import { BiChevronDown } from 'react-icons/bi';
import { CgSearch } from 'react-icons/cg';
import { MdCheck } from 'react-icons/md';

import FieldWrapper, { type Props as FieldWrapperProps } from './FieldWrapper';

import { type RefObject, useCallback, useMemo, useRef, useState } from 'react';
import { cn } from './../utilities';
import Stack from './Stack';
import Badge from './Badge';
import useOnClickOutside from './useOnClickOutside';

/**
 * Option type for SelectInput component
 * @typedef {Object} TOption
 * @property {string} label - Display text for the option
 * @property {string} value - Unique identifier for the option
 */
type TOption = {
  label: string;
  value: string;
};

type TCommonProps = (
  | {
      type?: 'single';
      value: TOption | null;
      onChange: (_value: TOption) => void;
    }
  | {
      type: 'multiple';
      value: TOption[] | null;
      onChange: (_value: TOption[]) => void;
      selectAllLabel?: string;
      showSelectAllButton?: boolean;
    }
) &
  FieldWrapperProps;

/**
 * SelectInput component props
 * @typedef {Object} TProps
 * @property {TOption[]} options - Array of selectable options
 * @property {boolean} [disabled] - Whether the select input is disabled
 * @property {string} [placeholder='Select an item'] - Placeholder text when no option is selected
 * @property {'single' | 'multiple'} [type='single'] - Selection mode
 * @property {TOption | null} value - Selected value for single mode
 * @property {TOption[] | null} value - Selected values for multiple mode
 * @property {(value: TOption) => void} onChange - Callback for single selection changes
 * @property {(value: TOption[]) => void} onChange - Callback for multiple selection changes
 * @property {string} [selectAllLabel='Select all'] - Label for select all button (multiple mode only)
 * @property {boolean} [showSelectAllButton] - Whether to show select all button (multiple mode only)
 * @property {string} [id='select-input'] - Unique identifier for the select input
 * @property {string} [name] - Name attribute for form handling
 * @property {string} [error] - Error message to display
 * @property {boolean} [readOnly] - Whether the input is read-only
 */
type TProps = {
  options: TOption[];
  disabled?: boolean;
  placeholder?: string;
} & TCommonProps;

/**
 * SelectInput component for single or multiple option selection with search functionality
 *
 * @example
 * ```tsx
 * # Single selection
 * <SelectInput
 *   options={[
 *     { label: 'Option 1', value: '1' },
 *     { label: 'Option 2', value: '2' }
 *   ]}
 *   value={selectedOption}
 *   onChange={setSelectedOption}
 *   placeholder="Choose an option"
 * />
 *
 * # Multiple selection
 * <SelectInput
 *   type="multiple"
 *   options={options}
 *   value={selectedOptions}
 *   onChange={setSelectedOptions}
 *   showSelectAllButton
 *   selectAllLabel="Select All Items"
 * />
 *
 * # With form integration
 * <SelectInput
 *   name="category"
 *   options={categories}
 *   value={formData.category}
 *   onChange={(value) => setFormData({...formData, category: value})}
 *   error={errors.category}
 *   disabled={isLoading}
 * />
 * ```
 *
 * @param {TProps} props - Component props
 * @param {TOption[]} props.options - Available options to select from
 * @param {'single' | 'multiple'} [props.type='single'] - Selection mode
 * @param {TOption | TOption[] | null} props.value - Currently selected value(s)
 * @param {Function} props.onChange - Handler for selection changes
 * @param {string} [props.placeholder='Select an item'] - Placeholder text
 * @param {boolean} [props.disabled] - Disable the input
 * @param {boolean} [props.readOnly] - Make the input read-only
 * @param {string} [props.id='select-input'] - Input identifier
 * @param {string} [props.name] - Input name for forms
 * @param {string} [props.error] - Error message to display
 * @param {boolean} [props.showSelectAllButton] - Show select all button (multiple mode)
 * @param {string} [props.selectAllLabel='Select all'] - Select all button label
 */
function SelectInput({
  id,
  name,
  error,
  value,
  options,
  disabled,
  readOnly,
  onChange,
  type = 'single',
  placeholder = 'Select an item',
  ...rest
}: TProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [query, setQuery] = useState('');

  const onClick = useCallback(() => {
    if (!isOpen) {
      inputRef.current?.focus();
      setIsOpen(true);
      setTimeout(() => {
        setAnimate(true);
      }, 50);
      return;
    }
    setAnimate(false);
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
    setTimeout(() => {
      setQuery('');
    }, 300);
  }, [isOpen]);

  useOnClickOutside(ref as RefObject<HTMLElement>, () => {
    if (isOpen) {
      onClick();
    }
  });

  const filteredOptions = useMemo(() => {
    if (!query) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, options]);

  const handleOnSelect = (selectedOption: TOption) => {
    if (type === 'single') {
      return handleSingleSelect(selectedOption);
    }

    return handleMultipleSelect(selectedOption);
  };

  const handleSingleSelect = (selectedOption: TOption) => {
    if (isOpen) {
      onClick();
    }

    const isSameOption =
      value && !Array.isArray(value) && value.value === selectedOption.value;
    const newValue = isSameOption ? null : selectedOption;

    onChange(newValue as never);
  };

  const handleMultipleSelect = (selectedOption: TOption) => {
    const currentValues = (value as TOption[]) || [];
    const isAlreadySelected = currentValues.some(
      (item) => item.value === selectedOption.value
    );

    const newValues = isAlreadySelected
      ? currentValues.filter((item) => item.value !== selectedOption.value)
      : [...currentValues, selectedOption];

    onChange(newValues as never);
  };

  const getIsOptionSelected = (option: TOption): boolean =>
    Array.isArray(value)
      ? value.some((item) => item.value === option.value)
      : option.value === value?.value;

  const getDisplayValue = (): string => {
    if (value === null || value === undefined) return placeholder;

    if (type === 'single') {
      return (value as TOption)?.label || '';
    }

    const selectedCount = (value as TOption[])?.length || 0;
    if (selectedCount === 0) return placeholder;

    return selectedCount === 1
      ? '1 item selected'
      : `${selectedCount} items selected`;
  };

  const isValueEmpty = (): boolean => {
    if (value === null) return true;
    if (type === 'multiple' && Array.isArray(value)) {
      return value.length === 0;
    }
    return !value;
  };

  return (
    <FieldWrapper
      id={id}
      name={name}
      error={error}
      readOnly={readOnly}
      {...rest}
    >
      <div
        className={cn(
          'cursor-pointer',
          'relative flex h-9 w-full rounded text-body',
          disabled ? 'bg-interface-disabled' : 'bg-interface',
          error && 'bg-danger-subtle'
        )}
      >
        <div
          className={cn(
            '!text-sm !leading-4 text',
            'flex h-9 w-full rounded p-[0.5625rem]',
            'items-end justify-between',
            isValueEmpty() && 'text-placeholder',
            error && 'text-on-danger-subtle'
          )}
        >
          {getDisplayValue()}
        </div>
        <input
          ref={inputRef}
          id={id ? id : `id-${name}`}
          readOnly
          className={cn(
            'absolute inset-0 my-auto ml-1 w-auto opacity-0',
            'pointer-events-none focus:outline-none [&:focus~div]:border-selected'
          )}
        />
        <button
          className={cn(
            'border',
            'pointer-events-none',
            'absolute inset-y-0 right-0 z-auto overflow-hidden',
            'my-auto flex h-9 w-9 rounded bg-interface-subtle',
            error &&
              'border-danger-subtle bg-danger-subtle text-on-danger-subtle'
          )}
        >
          <BiChevronDown className="m-auto shrink-0 text-body" size={16} />
        </button>
        <div
          ref={ref}
          role="button"
          onClick={onClick}
          className={cn(
            'cursor-pointer focus-within:border-selected',
            'absolute inset-0 z-auto h-full w-full rounded border',
            error && '!border-danger-subtle',
            !disabled && readOnly && 'border-none bg-white px-0 pt-1.5'
          )}
        />
        {isOpen &&
          createPortal(
            <div className="absolute right-0 top-full z-10 mt-2 flex w-full">
              <div
                data-state={animate}
                className={cn(
                  'w-full divide-y rounded bg-white shadow',
                  'origin-top transform transition-all duration-300 ease-out',
                  'data-[state=true]:translate-y-0 data-[state=true]:opacity-100',
                  'data-[state=false]:-translate-y-2 data-[state=false]:opacity-0'
                )}
              >
                <div className="relative isolate">
                  <input
                    autoFocus
                    type="text"
                    value={query}
                    autoComplete="off"
                    spellCheck={false}
                    id={`${id}-search-input`}
                    onChange={(e) => setQuery(e.target.value)}
                    className={cn(
                      'w-full p-[0.625rem] pr-10 text-sm leading-4 focus:outline-none',
                      'placeholder:text-placeholder'
                    )}
                    placeholder="Search for an item"
                  />
                  <CgSearch
                    size={18}
                    className="pointer-events-none absolute right-3.5 top-1/2 z-10 -translate-y-1/2 text-icon-subtle"
                  />
                </div>

                {filteredOptions?.length > 0 ? (
                  <div className="max-h-80 w-full divide-y overflow-auto">
                    {filteredOptions?.map((option) => {
                      const isSelected = getIsOptionSelected(option);

                      return (
                        <div
                          role="button"
                          id={`picker-option-${option.value}`}
                          key={`picker-option-${option.value}`}
                          onClick={() => handleOnSelect(option)}
                          className={cn(
                            'flex w-full cursor-pointer items-center justify-between',
                            'space-x-1 p-[0.625rem] text-sm leading-4 text hover:bg-interface-hovered',
                            isSelected && 'bg-brand-subtle text-brand'
                          )}
                        >
                          <span>{option.label}</span>
                          {type === 'multiple' && isSelected && (
                            <MdCheck className="text-brand" />
                          )}
                        </div>
                      );
                    })}
                    {type === 'multiple' &&
                      'showSelectAllButton' in rest &&
                      rest.showSelectAllButton && (
                        <button
                          type="button"
                          className={cn(
                            'cursor-pointer',
                            'text-left text-sm font-medium leading-4',
                            'text-brand hover:bg-interface-hovered',
                            'sticky bottom-0 w-full bg-white p-[0.625rem]'
                          )}
                          onClick={() => {
                            onChange(filteredOptions as never);
                            if (isOpen) {
                              onClick();
                            }
                          }}
                        >
                          {'selectAllLabel' in rest
                            ? (rest.selectAllLabel ?? 'Select all')
                            : 'Select all'}
                        </button>
                      )}
                  </div>
                ) : (
                  <div
                    className={cn(
                      'cursor-not-allowed p-[0.625rem] text-sm leading-4 hover:bg-interface-hovered'
                    )}
                  >
                    No Items Found
                  </div>
                )}
              </div>
            </div>,
            ref.current as HTMLElement
          )}
      </div>
      {type === 'multiple' && Boolean((value as TOption[])?.length) && (
        <Stack gap="4" horizontal className="flex-wrap">
          {(value as TOption[])?.map((i) => (
            <Badge
              key={i?.value}
              onDismiss={() => {
                const _value = value as TOption[];
                const x = _value?.filter((v) => v?.value !== i?.value);
                onChange(x as never);
              }}
              label={
                options.find((option) => option.value === i?.value)?.label ?? ''
              }
            />
          ))}
        </Stack>
      )}
    </FieldWrapper>
  );
}

export default SelectInput;
