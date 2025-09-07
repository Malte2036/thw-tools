import React, { forwardRef } from 'react';

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  pattern?: string;
  onInput?: (event: React.FormEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      value,
      onChange,
      label,
      placeholder,
      type = 'text',
      inputMode,
      pattern,
      onInput,
      className = '',
      id,
      disabled = false,
      required = false,
      autoComplete,
      autoFocus = false,
    },
    ref
  ) => {
    const inputId = id || 'inputField';

    const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
      const target = event.target as HTMLInputElement;
      onChange(target.value);
      onInput?.(event);
    };

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="font-bold" htmlFor={inputId}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          value={value}
          onChange={handleInput}
          placeholder={placeholder}
          inputMode={inputMode}
          pattern={pattern}
          onInput={onInput}
          className={`border border-black rounded-lg py-1 px-2 ${className}`}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
