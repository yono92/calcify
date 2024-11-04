import React, { useEffect } from "react";
import { OperatorType } from "../types/calculatorTypes";

interface ScientificCalculatorProps {
    onNumberClick: (num: string) => void;
    onOperatorClick: (operator: OperatorType) => void;
    onSettingsClick: () => void;
    display: string;
    equation: string;
    isSecondMode: boolean; // 추가
    error: string | null; // 에러 메시지를 받도록 추가
}

const ScientificCalculator: React.FC<ScientificCalculatorProps> = ({
    onNumberClick,
    onOperatorClick,
    onSettingsClick,
    display,
    equation,
    isSecondMode,
    error, // 에러 prop 추가
}) => {
    const createScientificButton = (
        operator: OperatorType,
        primaryDisplay: string,
        secondaryDisplay?: string
    ): JSX.Element => (
        <button
            onClick={() => onOperatorClick(operator)}
            className={`p-4 rounded-lg font-medium transition-all duration-200 
                    transform active:scale-95 
                    ${
                        isSecondMode
                            ? "bg-indigo-500 text-white"
                            : "bg-indigo-100 text-indigo-900"
                    }
                    hover:bg-indigo-200 active:bg-indigo-300 
                    dark:bg-indigo-900/80 dark:hover:bg-indigo-800 dark:active:bg-indigo-700 
                    dark:text-slate-200 shadow-sm`}
        >
            {isSecondMode && secondaryDisplay
                ? secondaryDisplay
                : primaryDisplay}
        </button>
    );

    const createNumberButton = (num: string): JSX.Element => (
        <button
            onClick={() => onNumberClick(num)}
            className="p-4 rounded-lg font-medium transition-all duration-200 
                    transform active:scale-95 
                    bg-slate-100 hover:bg-slate-200 active:bg-slate-300
                    dark:bg-slate-800 dark:hover:bg-slate-700 dark:active:bg-slate-600 
                    text-slate-900 dark:text-slate-200 shadow-sm"
        >
            {num}
        </button>
    );

    const createOperatorButton = (
        operator: OperatorType,
        displayText: string
    ): JSX.Element => (
        <button
            onClick={() => onOperatorClick(operator)}
            className="p-4 rounded-lg font-medium transition-all duration-200 
                    transform active:scale-95 
                    bg-slate-200 hover:bg-slate-300 active:bg-slate-400
                    dark:bg-slate-800 dark:hover:bg-slate-700 dark:active:bg-slate-600 
                    text-slate-900 dark:text-slate-200 shadow-sm"
        >
            {displayText}
        </button>
    );

    // 키보드 이벤트 처리
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const preventDefaultKeys = [
                "/",
                "*",
                "-",
                "+",
                "=",
                "Enter",
                "Escape",
                "Backspace",
                "p",
                "e",
                "s",
                "c",
                "t",
                "r",
                "q",
            ];
            if (preventDefaultKeys.includes(event.key.toLowerCase())) {
                event.preventDefault();
            }

            // Shift 키와 함께 눌린 경우
            if (event.shiftKey) {
                switch (event.key) {
                    case "^":
                        onOperatorClick("^");
                        return;
                    case "6": // ^ key
                        onOperatorClick("x²");
                        return;
                    case "|":
                        onOperatorClick("|x|");
                        return;
                }
            }

            // 일반 숫자와 소수점
            if (/^[0-9.]$/.test(event.key)) {
                onNumberClick(event.key);
                return;
            }

            // 기본 연산자와 특수 키
            switch (event.key.toLowerCase()) {
                case "/":
                    onOperatorClick("/");
                    break;
                case "*":
                    onOperatorClick("*");
                    break;
                case "-":
                    onOperatorClick("-");
                    break;
                case "+":
                    onOperatorClick("+");
                    break;
                case "=":
                case "enter":
                    onOperatorClick("=");
                    break;
                case "escape":
                    onOperatorClick("C");
                    break;
                case "backspace":
                    onOperatorClick("DEL");
                    break;
                case "s":
                    onOperatorClick(isSecondMode ? "arcsin" : "sin");
                    break;
                case "c":
                    onOperatorClick(isSecondMode ? "arccos" : "cos");
                    break;
                case "t":
                    onOperatorClick(isSecondMode ? "arctan" : "tan");
                    break;
                case "r":
                case "q":
                    onOperatorClick(isSecondMode ? "cbrt" : "sqrt");
                    break;
                case "p":
                    onOperatorClick("pi");
                    break;
                case "e":
                    onOperatorClick("e");
                    break;
                case "m":
                    if (event.ctrlKey || event.metaKey) {
                        onOperatorClick(event.shiftKey ? "m+" : "mc");
                    }
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onNumberClick, onOperatorClick, isSecondMode]);

    return (
        <div className="w-full h-full bg-slate-900 flex flex-col">
            <div
                className="relative w-[400px] mx-auto p-6 rounded-2xl 
                        bg-white/95 dark:bg-slate-900/95 
                        backdrop-blur-lg shadow-2xl
                        border border-slate-200 dark:border-slate-800"
            >
                {/* Settings Button */}
                <button
                    onClick={onSettingsClick}
                    className="absolute top-2 right-2 p-2 rounded-full 
                            text-slate-600 hover:text-slate-800 hover:bg-slate-200
                            dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800
                            transition-colors"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                </button>

                {/* Display */}
                <div className="mb-4 space-y-1 mt-4">
                    <div className="text-slate-600 dark:text-slate-400 text-sm h-6 overflow-hidden text-right">
                        {equation}
                    </div>
                    <div className="text-right text-4xl font-bold text-slate-900 dark:text-white h-12 overflow-hidden tracking-wider">
                        {error || display}{" "}
                        {/* 에러가 있으면 에러 메시지 표시 */}
                    </div>
                </div>

                {/* Scientific Functions */}
                <div className="grid grid-cols-5 gap-2 mb-2">
                    {createScientificButton(
                        "sin",
                        isSecondMode ? "sin⁻¹" : "sin"
                    )}
                    {createScientificButton(
                        "cos",
                        isSecondMode ? "cos⁻¹" : "cos"
                    )}
                    {createScientificButton(
                        "tan",
                        isSecondMode ? "tan⁻¹" : "tan"
                    )}
                    {createScientificButton("sqrt", isSecondMode ? "∛" : "√")}
                    {createScientificButton("^", "xʸ")}
                </div>

                {/* Memory Functions */}
                <div className="grid grid-cols-5 gap-2 mb-2">
                    {createOperatorButton("mc", "MC")}
                    {createOperatorButton("mr", "MR")}
                    {createOperatorButton("m+", "M+")}
                    {createOperatorButton("m-", "M-")}
                    {createOperatorButton("ms", "MS")}
                </div>

                {/* Number Pad with Extended Operations */}
                <div className="grid grid-cols-5 gap-2">
                    <button
                        onClick={() => onOperatorClick("2nd")}
                        className={`p-4 rounded-lg font-medium transition-all duration-200 
                    transform active:scale-95 
                    ${
                        isSecondMode
                            ? "bg-indigo-500 text-white"
                            : "bg-indigo-100 text-indigo-900"
                    } 
                    hover:bg-indigo-200 active:bg-indigo-300 
                    dark:bg-indigo-900/80 dark:hover:bg-indigo-800 dark:active:bg-indigo-700 
                    dark:text-slate-200 shadow-sm`}
                    >
                        2nd
                    </button>
                    {createOperatorButton("pi", "π")}
                    {createOperatorButton("e", "e")}
                    <button
                        onClick={() => onOperatorClick("C")}
                        className="bg-red-500 hover:bg-red-600 active:bg-red-700 
                                dark:bg-red-500/90 dark:hover:bg-red-600 dark:active:bg-red-700 
                                text-white p-4 rounded-lg font-medium transition-all duration-200 
                                transform active:scale-95"
                    >
                        AC
                    </button>
                    {createOperatorButton("/", "÷")}

                    {createScientificButton("x²", "x²", "x³")}
                    {createNumberButton("7")}
                    {createNumberButton("8")}
                    {createNumberButton("9")}
                    {createOperatorButton("*", "×")}

                    {createOperatorButton("1/x", "1/x")}
                    {createNumberButton("4")}
                    {createNumberButton("5")}
                    {createNumberButton("6")}
                    {createOperatorButton("-", "-")}

                    {createOperatorButton("|x|", "|x|")}
                    {createNumberButton("1")}
                    {createNumberButton("2")}
                    {createNumberButton("3")}
                    {createOperatorButton("+", "+")}

                    {createOperatorButton("exp", "exp")}
                    {createNumberButton("0")}
                    {createNumberButton(".")}
                    <button
                        onClick={() => onOperatorClick("=")}
                        className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 
                                text-white p-4 rounded-lg font-medium transition-all duration-200 
                                transform active:scale-95"
                    >
                        =
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScientificCalculator;
