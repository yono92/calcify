import React from "react";

interface SettingsProps {
    isOpen: boolean;
    onClose: () => void;
    isDarkMode: boolean;
    isScientific: boolean;
    onThemeChange: (isDark: boolean) => void;
    onModeChange: (isScientific: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({
    isOpen,
    onClose,
    isDarkMode,
    isScientific,
    onThemeChange,
    onModeChange,
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl
                transform transition-all"
            >
                <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                        Settings
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full
                                text-slate-500 dark:text-slate-400 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-300">
                            Dark Mode
                        </span>
                        <button
                            onClick={() => onThemeChange(!isDarkMode)}
                            className={`
                                w-12 h-6 rounded-full p-1 transition-colors duration-200
                                ${isDarkMode ? "bg-blue-600" : "bg-slate-300"}
                            `}
                        >
                            <div
                                className={`
                                w-4 h-4 rounded-full bg-white transition-transform duration-200
                                ${
                                    isDarkMode
                                        ? "translate-x-6"
                                        : "translate-x-0"
                                }
                            `}
                            />
                        </button>
                    </div>

                    {/* Calculator Mode Toggle */}
                    <div className="flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-300">
                            Scientific Mode
                        </span>
                        <button
                            onClick={() => onModeChange(!isScientific)}
                            className={`
                                w-12 h-6 rounded-full p-1 transition-colors duration-200
                                ${isScientific ? "bg-blue-600" : "bg-slate-300"}
                            `}
                        >
                            <div
                                className={`
                                w-4 h-4 rounded-full bg-white transition-transform duration-200
                                ${
                                    isScientific
                                        ? "translate-x-6"
                                        : "translate-x-0"
                                }
                            `}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
