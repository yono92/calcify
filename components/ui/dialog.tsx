// components/ui/dialog.tsx
import React from "react";

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
    open,
    onOpenChange,
    children,
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50"
                onClick={() => onOpenChange(false)}
            />
            {/* Dialog content */}
            <div className="relative z-50 bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-md w-full mx-4">
                {children}
            </div>
        </div>
    );
};

export const DialogContent: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className = "" }) => {
    return <div className={`p-6 ${className}`}>{children}</div>;
};

export const DialogHeader: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return <div className="mb-4">{children}</div>;
};

export const DialogTitle: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {children}
        </h2>
    );
};
