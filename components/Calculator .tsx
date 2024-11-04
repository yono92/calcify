import React, { useState, useEffect } from "react";
import Settings from "./Settings";
import ScientificCalculator from "./ScientificCalculator";
import BasicCalculator from "./BasicCalculator";
import { useCalculator } from "../hooks/useCalculator";


const Calculator: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isScientific, setIsScientific] = useState<boolean>(false);
    const [isRadianMode, setIsRadianMode] = useState(true);

    const {
        state: { display, equation, isSecondMode, error }, // error 추가
        handleNumber,
        handleOperator,
        setAngleMode,
    } = useCalculator();

    const handleThemeChange = (isDark: boolean) => {
        setIsDarkMode(isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
    };

    const handleModeChange = (scientific: boolean) => {
        setIsScientific(scientific);
        localStorage.setItem(
            "calculatorMode",
            scientific ? "scientific" : "basic"
        );
    };

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        const savedMode = localStorage.getItem("calculatorMode");
        if (savedMode) {
            setIsScientific(savedMode === "scientific");
        }
    }, [isDarkMode]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
            {isSettingsOpen && (
                <Settings
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    isDarkMode={isDarkMode}
                    isScientific={isScientific}
                    onThemeChange={handleThemeChange}
                    onModeChange={handleModeChange}
                    isRadianMode={isRadianMode}
                    onAngleModeChange={(isRadian) => {
                        setIsRadianMode(isRadian);
                        setAngleMode(isRadian ? "rad" : "deg");
                    }}
                />
            )}

            <div
                className={`${
                    isScientific ? "w-[400px] h-[600px]" : "w-[320px] h-[500px]"
                } rounded-3xl overflow-hidden`}
            >
                {isScientific ? (
                    <ScientificCalculator
                        onNumberClick={handleNumber}
                        onOperatorClick={handleOperator}
                        onSettingsClick={() => setIsSettingsOpen(true)}
                        display={display}
                        equation={equation}
                        isSecondMode={isSecondMode}
                        error={error?.message || null} // error 메시지 전달
                    />
                ) : (
                    <BasicCalculator
                        onNumberClick={handleNumber}
                        onOperatorClick={handleOperator}
                        onSettingsClick={() => setIsSettingsOpen(true)}
                        display={display}
                        equation={equation}
                    />
                )}
            </div>
        </div>
    );
};

export default Calculator;
