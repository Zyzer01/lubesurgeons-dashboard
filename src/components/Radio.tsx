import { RadioGroup } from '@headlessui/react';
import { SVGProps } from 'react';

interface Vehicle {
  name: string;
}

interface RadioProps {
  name: string;
  handleTypeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedType: string;
  handleBlur: () => void;
}

const vehicleType: Vehicle[] = [
  {
    name: 'Sedan',
  },
  {
    name: 'SUV',
  },
  {
    name: 'Truck',
  },
];

export default function Radio({
  name,
  handleTypeChange,
  selectedType,
  handleBlur,
}: RadioProps) {
  const handleTypeSelection = (value: string) => {
    // Update the type
    handleTypeChange({ target: { name, value } });
    console.log(value);
  };

  return (
    <div className="w-full py-4">
      <div className="w-full max-w-md">
        <RadioGroup
          value={selectedType}
          onChange={handleTypeSelection}
          onBlur={handleBlur}
        >
          <div className="grid grid-cols-3 gap-4">
            {vehicleType.map((vehicle) => (
              <RadioGroup.Option
                key={vehicle.name}
                value={vehicle.name}
                className={({ active, checked }) =>
                  `${
                    !active
                      ? 'ring-2 ring-white ring-opacity-60 border border-bodydark2 border-dotted ring-offset-1 ring-offset-amber-400'
                      : ''
                  }
                  ${
                    checked
                      ? 'bg-primary bg-opacity-75 text-white shadow-xl shadow-amber-500/50 transition-all'
                      : 'bg-white'
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex w-full items-center justify-around">
                      {checked && (
                        <div className="text-white">
                          <CheckIcon className="h-6 w-6" />
                        </div>
                      )}
                      <div className="flex items-center text-end">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium  ${
                              checked ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {vehicle.name}
                          </RadioGroup.Label>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
