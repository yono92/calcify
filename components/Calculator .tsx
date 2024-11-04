import React, { useState, useEffect, useCallback } from "react";
import Settings from "./Settings";
import ScientificCalculator from "./ScientificCalculator";
import BasicCalculator from "./BasicCalculator";

const Calculator: React.FC = () => {
    const [display, setDisplay] = useState<string>("0");
    const [equation, setEquation] = useState<string>("");
    const [isNewNumber, setIsNewNumber] = useState<boolean>(true);
    const [lastOperator, setLastOperator] = useState<string | null>(null);
    const [lastNumber, setLastNumber] = useState<string>("");
    const [isDarkMode, setIsDarkMode] = useState<boolean>(
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isScientific, setIsScientific] = useState<boolean>(false);

    // 계산 로직
    const calculateResult = useCallback(() => {
        try {
            if (!lastOperator || !lastNumber) return;
            if (display === "Error") return;

            const num1 = parseFloat(lastNumber);
            const num2 = parseFloat(display);

            if (isNaN(num1) || isNaN(num2)) {
                throw new Error("Invalid number");
            }

            let result: number;
            switch (lastOperator) {
                case "+":
                    result = num1 + num2;
                    break;
                case "-":
                    result = num1 - num2;
                    break;
                case "*":
                    result = num1 * num2;
                    break;
                case "/":
                    if (num2 === 0) throw new Error("Division by zero");
                    result = num1 / num2;
                    break;
                default:
                    return;
            }

            const resultString = Number.isInteger(result)
                ? result.toString()
                : result.toFixed(8).replace(/\.?0+$/, "");

            setDisplay(resultString);
            setEquation("");
            setIsNewNumber(true);
            setLastOperator(null);
            setLastNumber("");
        } catch (error) {
            setDisplay("Error");
            setEquation("");
            setIsNewNumber(true);
            setLastOperator(null);
            setLastNumber("");
        }
    }, [lastOperator, lastNumber, display]);

    // 숫자 입력 처리
    const handleNumber = useCallback(
        (num: string) => {
            if (display === "Error") {
                setDisplay(num);
                setIsNewNumber(false);
                return;
            }

            if (isNewNumber) {
                setDisplay(num);
                setIsNewNumber(false);
            } else {
                if (num === "." && display.includes(".")) return;
                if (display === "0" && num !== ".") {
                    setDisplay(num);
                } else {
                    setDisplay(display + num);
                }
            }
        },
        [display, isNewNumber]
    );

    // 연산자 입력 처리
    const handleOperator = useCallback(
        (operator: string) => {
            if (display === "Error" && operator !== "C") return;

            switch (operator) {
                case "C":
                    setDisplay("0");
                    setEquation("");
                    setIsNewNumber(true);
                    setLastOperator(null);
                    setLastNumber("");
                    break;
                case "DEL":
                    if (!isNewNumber && display !== "0") {
                        const newDisplay = display.slice(0, -1);
                        setDisplay(newDisplay === "" ? "0" : newDisplay);
                    }
                    break;
                case "=":
                    calculateResult();
                    break;
                default:
                    setLastOperator(operator);
                    setLastNumber(display);
                    setEquation(`${display} ${operator} `);
                    setIsNewNumber(true);
            }
        },
        [display, isNewNumber, calculateResult]
    );

    // Settings handlers
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
        setDisplay("0");
        setEquation("");
        setIsNewNumber(true);
        setLastOperator(null);
        setLastNumber("");
    };

    // Load saved preferences
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
                />
            )}


            {/* Calculator */}
            <div className="w-full max-w-sm mx-auto">
                {isScientific ? (
                    <ScientificCalculator
                        onNumberClick={handleNumber}
                        onOperatorClick={handleOperator}
                        onSettingsClick={() => setIsSettingsOpen(true)}
                        display={display}
                        equation={equation}
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
