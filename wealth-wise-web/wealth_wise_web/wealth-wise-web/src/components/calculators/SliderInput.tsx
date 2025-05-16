
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  formatter?: (value: number) => string;
}

const SliderInput = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
  formatter,
}: SliderInputProps) => {
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleSliderChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    const parsedValue = parseFloat(newValue);
    if (!isNaN(parsedValue) && parsedValue >= min && parsedValue <= max) {
      onChange(parsedValue);
    }
  };

  const handleInputBlur = () => {
    const parsedValue = parseFloat(inputValue);
    if (isNaN(parsedValue) || parsedValue < min) {
      setInputValue(min.toString());
      onChange(min);
    } else if (parsedValue > max) {
      setInputValue(max.toString());
      onChange(max);
    }
  };

  const displayValue = formatter ? formatter(value) : value.toString();

  return (
    <div className="calculator-input">
      <Label>{label}</Label>
      <div className="input-wrapper my-2">
        {prefix && <span className="text-muted-foreground mr-2">{prefix}</span>}
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className="max-w-[160px]"
        />
        {suffix && <span className="text-muted-foreground ml-2">{suffix}</span>}
      </div>
      <div className="calculator-slider">
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={handleSliderChange}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{formatter ? formatter(min) : min}{suffix}</span>
          <span>{formatter ? formatter(max) : max}{suffix}</span>
        </div>
      </div>
    </div>
  );
};

export default SliderInput;
