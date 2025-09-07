import { useState } from 'react';
import { Button, Input } from '../base';
import { inventarNummerRegex } from '@/api/funk/funkModels';

type Props = {
  showButtonText?: string;
  submitButtonText?: string;
  onScan: (inputValue: string) => void;
};

export default function ManuelDeviceIdInput({
  showButtonText = 'Gerät manuell hinzufügen',
  submitButtonText = 'Eintragen',
  onScan,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const HYPHEN_INDEX = 4;
  const HYPHEN = '-';

  const fixInputValue = (value: string) => {
    value = value.trim();

    if (value.length > HYPHEN_INDEX && value[HYPHEN_INDEX] !== HYPHEN) {
      value = value.slice(0, HYPHEN_INDEX) + HYPHEN + value.slice(HYPHEN_INDEX);
    }

    return value;
  };

  if (!isExpanded) {
    return (
      <Button type="secondary" onClick={() => setIsExpanded(true)}>
        {showButtonText}
      </Button>
    );
  }

  return (
    <div className="flex flex-row gap-4 w-full items-end">
      <Input
        value={inputValue}
        onChange={(value: string) => setInputValue(fixInputValue(value))}
        placeholder="Inventarnummer"
        label="Inventarnummer des Gerätes"
        inputMode="numeric"
        pattern={inventarNummerRegex.source}
      />
      <Button
        type="secondary"
        onClick={() => {
          onScan(inputValue);
        }}
      >
        {submitButtonText}
      </Button>
    </div>
  );
}
