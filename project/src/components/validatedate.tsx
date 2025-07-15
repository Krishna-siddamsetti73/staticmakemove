import React, { useState } from 'react';

interface ValidatedDateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min: string;
  max: string;
  required?: boolean;
}

const ValidatedDateInput: React.FC<ValidatedDateInputProps> = ({
  label,
  value,
  onChange,
  min,
  
  max,
  required = false,
}) => {
  const [error, setError] = useState('');

 const validate = (val: string) => {
  const dateValue = new Date(val);
  const minDate = new Date(min);
  const maxDate = new Date(max);

  if (!val && required) {
    setError('This field is required');
    return;
  }

  if (val.length === 10) {
    if (isNaN(dateValue.getTime())) {
      setError('Invalid date format');
    } else if (dateValue < minDate || dateValue > maxDate) {
      setError(`Please select a date between ${min} and ${max}`);
    } else {
      setError('');
    }

    onChange(val); // ✅ Call onChange even if there's an error, so user input is preserved
  } else {
    // Allow typing without validation errors
    setError('');
    onChange(val); // still update value so user can finish typing
  }
};


  return (
    <div className="relative mb-4">
      <label className="block text-sm text-gray-700 mb-1">{label}</label>
      <input
        type="date"
        className="border p-3 rounded w-full"
        value={value}
        min={min}
        max={max}
        onChange={(e) => validate(e.target.value)}
      />
      {error && (<p className="text-sm text-red-600 mt-1">{error}</p>
      )
      }
    </div>
  );
};

export default ValidatedDateInput;
