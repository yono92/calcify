import React from "react";

interface LabelProps {
    htmlFor?: string;
    children: React.ReactNode;
    className?: string;
}

export const Label: React.FC<LabelProps> = ({
    htmlFor,
    children,
    className = "",
}) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`text-sm font-medium text-slate-900 dark:text-slate-100 ${className}`}
        >
            {children}
        </label>
    );
};
