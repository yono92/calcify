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
    const [memory, setMemory] = useState<number>(0);

    // Memory Operations
    const handleMemory = useCallback((operation: string) => {
        const currentValue = parseFloat(display);
        switch (operation) {
            case "mc":
                setMemory(0);
                setIsNewNumber(true);
                break;
            case "mr":
                setDisplay(memory.toString());
                setIsNewNumber(true);
                break;
            case "m+":
                setMemory(memory + currentValue);
                setIsNewNumber(true);
                break;
            case "m-":
                setMemory(memory - currentValue);
                setIsNewNumber(true);
                break;
            case "ms":
                setMemory(currentValue);
                setIsNewNumber(true);
                break;
        }
    }, [display, memory]);

    // Scientific Calculations
    const calculateScientific = useCallback((operator: string) => {
        try {
            const num = parseFloat(display);
            let result: number;

            switch (operator) {
                case "sin":
                    result = Math.sin(num * Math.PI / 180);
                    break;
                case "cos":
                    result = Math.cos(num * Math.PI / 180);
                    break;
                case "tan":
                    result = Math.tan(num * Math.PI / 180);
                    break;
                case "sqrt":
                    if (num < 0) throw new Error("Cannot calculate square root of negative number");
                    result = Math.sqrt(num);
                    break;
                case "x²":
                    result = Math.pow(num, 2);
                    break;
                case "1/x":
                    if (num === 0) throw new Error("Cannot divide by zero");
                    result = 1 / num;
                    break;
                case "|x|":
                    result = Math.abs(num);
                    break;
                case "exp":
                    result = Math.exp(num);
                    break;
                case "pi":
                    result = Math.PI;
                    break;
                case "e":
                    result = Math.E;
                    break;
                case "^":
                    setLastOperator("^");
                    setLastNumber(display);
                    setEquation(`${display} ^ `);
                    setIsNewNumber(true);
                    return;
                default:
                    return;
            }

            setDisplay(Number.isInteger(result) ? result.toString() : result.toFixed(8).replace(/\.?0+$/, ""));
            setIsNewNumber(true);
            setEquation("");
        } catch (error) {
            setDisplay("Error");
            setEquation("");
            setIsNewNumber(true);
        }
    }, [display]);

    // Basic Calculations
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
                case "^":
                    result = Math.pow(num1, num2);
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

    // Number Input Handler
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

    // Operator Input Handler
    const handleOperator = useCallback(
        (operator: string) => {
            if (display === "Error" && operator !== "C") return;

            // Handle Memory Operations
            if (["mc", "mr", "m+", "m-", "ms"].includes(operator)) {
                handleMemory(operator);
                return;
            }

            // Handle Scientific Operations
            if (["sin", "cos", "tan", "sqrt", "x²", "1/x", "|x|", "exp", "pi", "e", "^"].includes(operator)) {
                calculateScientific(operator);
                return;
            }

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
        [display, isNewNumber, calculateResult, handleMemory, calculateScientific]
    );

    // Settings handlers
    const handleThemeChange = (isDark: boolean) => {
        setIsDarkMode(isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
    };

    const handleModeChange = (scientific: boolean) => {
        setIsScientific(scientific);
        localStorage.setItem("calculatorMode", scientific ? "scientific" : "basic");
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
        <div className="min-h-screen flex items-center justify-center">
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
            <div className={`${isScientific ? 'w-[400px] h-[600px]' : 'w-[320px] h-[500px]'} rounded-3xl overflow-hidden`}>
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