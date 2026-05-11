import { useState } from 'react';

export default function useToggle(defaultValue: boolean = false): [boolean, (value?: boolean) => void] {
  const [value, setValue] = useState<boolean>(defaultValue);

  function toggleValue(value?: boolean): void {
    setValue((currentValue: boolean) => (typeof value === 'boolean' ? value : !currentValue));
  }

  return [value, toggleValue];
}
