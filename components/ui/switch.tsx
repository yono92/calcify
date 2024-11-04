import React from "react";

interface SwitchProps {
    id?: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}

export const Switch: React.FC<SwitchProps> = ({
    id,
    checked,
    onCheckedChange,
}) => {
    return (
        <button
            id={id}
            role="switch"
            aria-checked={checked}
            onClick={() => onCheckedChange(!checked)}
            className={`
                relative inline-flex h-6 w-11 items-center rounded-full 
                transition-colors focus-visible:outline-none focus-visible:ring-2 
                focus-visible:ring-offset-2 focus-visible:ring-offset-white
                ${
                    checked
                        ? "bg-indigo-600 dark:bg-indigo-400"
                        : "bg-slate-200 dark:bg-slate-700"
                }
            `}
        >
            <span
                className={`
                    ${checked ? "translate-x-6" : "translate-x-1"}
                    inline-block h-4 w-4 transform rounded-full 
                    bg-white transition-transform
                `}
            />
        </button>
    );
};
