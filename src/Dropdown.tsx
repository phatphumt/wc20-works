import React from 'react';

interface DropdownProps {
  week: number[]
  onChange: (value: number) => void;
  value?: number;
}

const Dropdown: React.FC<DropdownProps> = ({ onChange, value, week }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = parseInt(e.target.value, 10);
    onChange(selected);
  };

  return (
    <select className="dropdown" value={value ?? ''} onChange={handleChange}>
      <option value="" disabled>เลือกสัปดาห์</option>
      {week.map((p) => (
        <option key={p} value={p}>
          สัปดาห์ที่ {p}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
