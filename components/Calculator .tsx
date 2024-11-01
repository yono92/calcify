import React, { useState, useEffect, useCallback } from "react";

type OperatorType = "+" | "-" | "*" | "/" | "=";
type NumberType =
    | "0"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | ".";

interface CalculatorButtonProps {
    onClick: () => void;
    className: string;
    children: React.ReactNode;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({
    onClick,
    className,
    children,
}) => (
    <button
        onClick={onClick}
        className={`p-4 rounded transition-colors ${className}`}
    >
        {children}
    </button>
);

const Calculator: React.FC = () => {
    const [display, setDisplay] = useState<string>("0");
    const [equation, setEquation] = useState<string>("");
    const [isNewNumber, setIsNewNumber] = useState<boolean>(true);
    const [lastOperator, setLastOperator] = useState<OperatorType | null>(null);
    const [lastNumber, setLastNumber] = useState<string>("");

    const resetState = useCallback(() => {
        setEquation("");
        setIsNewNumber(true);
        setLastOperator(null);
        setLastNumber("");
    }, []);

    const clearDisplay = useCallback(() => {
        setDisplay("0");
        resetState();
    }, [resetState]);

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

            if (!isFinite(result)) {
                throw new Error("Result is not finite");
            }

            const resultString = Number.isInteger(result)
                ? result.toString()
                : result.toFixed(8).replace(/\.?0+$/, "");

            setDisplay(resultString);
            resetState();
        } catch (error) {
            console.error("Calculator error:", error);
            setDisplay("Error");
            resetState();
        }
    }, [lastOperator, lastNumber, display, resetState]);

    const handleNumber = useCallback(
        (num: NumberType): void => {
            if (isNewNumber) {
                setDisplay(num);
                setIsNewNumber(false);
            } else {
                if (num === "." && display.includes(".")) return;
                setDisplay(display + num);
            }
        },
        [display, isNewNumber]
    );

    const handleOperator = useCallback(
        (operator: OperatorType): void => {
            if (operator === "=") {
                calculateResult();
                return;
            }

            setLastOperator(operator);
            setLastNumber(display);
            setEquation(display + " " + operator + " ");
            setIsNewNumber(true);
        },
        [display, calculateResult]
    );

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (/^[0-9.]$/.test(event.key)) {
                handleNumber(event.key as NumberType);
            } else if (["+", "-", "*", "/"].includes(event.key)) {
                handleOperator(event.key as OperatorType);
            } else if (event.key === "Enter") {
                handleOperator("=");
            } else if (event.key === "Escape") {
                clearDisplay();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [handleNumber, handleOperator, clearDisplay]);

    const createNumberButton = (num: NumberType): JSX.Element => (
        <CalculatorButton
            key={num}
            onClick={() => handleNumber(num)}
            className="bg-gray-50 hover:bg-gray-100"
        >
            {num}
        </CalculatorButton>
    );

    const createOperatorButton = (
        operator: OperatorType,
        display: string
    ): JSX.Element => (
        <CalculatorButton
            onClick={() => handleOperator(operator)}
            className="bg-gray-200 hover:bg-gray-300"
        >
            {display}
        </CalculatorButton>
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl w-80">
            <div className="mb-4">
                <div className="text-gray-500 text-sm h-6 overflow-hidden">
                    {equation}
                </div>
                <div className="text-right text-4xl font-bold text-gray-800 h-12 overflow-hidden">
                    {display}
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
                <CalculatorButton
                    onClick={clearDisplay}
                    className="col-span-2 bg-red-500 hover:bg-red-600 text-white"
                >
                    AC
                </CalculatorButton>
                {createOperatorButton("/", "÷")}
                {createOperatorButton("*", "×")}

                {[7, 8, 9].map((num) =>
                    createNumberButton(num.toString() as NumberType)
                )}
                {createOperatorButton("-", "-")}

                {[4, 5, 6].map((num) =>
                    createNumberButton(num.toString() as NumberType)
                )}
                {createOperatorButton("+", "+")}

                {[1, 2, 3].map((num) =>
                    createNumberButton(num.toString() as NumberType)
                )}
                <CalculatorButton
                    onClick={() => handleOperator("=")}
                    className="bg-blue-500 hover:bg-blue-600 text-white row-span-2"
                >
                    =
                </CalculatorButton>

                <div className="col-span-2">{createNumberButton("0")}</div>
                {createNumberButton(".")}
            </div>
        </div>
    );
};

export default Calculator;
