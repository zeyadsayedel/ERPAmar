import React from 'react';
import Select, { MultiValue, Props as SelectProps } from 'react-select';
import { cn } from '@/lib/utils';

export type Option = {
  label: string;
  value: number | string;
};

interface MultiSelectProps extends Omit<SelectProps<Option, true>, 'classNames' | 'onChange'> {
  options: Option[];
  onChange: (selected: { value: number | string; label: string; }[]) => void;
  className?: string;
  placeholder?: string;
}

export function MultiSelect({
  options,
  onChange,
  className,
  placeholder = 'Select options...',
  ...props
}: MultiSelectProps) {
  const handleChange = (selected: MultiValue<Option>) => {
    onChange(selected as Option[]);
  };

  return (
    <Select
      isMulti
      options={options}
      className={cn('react-select-container', className)}
      classNamePrefix="react-select"
      placeholder={placeholder}
      onChange={handleChange}
      {...props}
    />
  );
}
