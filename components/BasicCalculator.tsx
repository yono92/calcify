import React, { useEffect } from "react";

interface BasicCalculatorProps {
    onNumberClick: (num: string) => void;
    onOperatorClick: (operator: string) => void;
    onSettingsClick: () => void;
    display: string;
    equation: string;
}

const BasicCalculator: React.FC<BasicCalculatorProps> = ({
    onNumberClick,
    onOperatorClick,
    onSettingsClick,
    display,
    equation,
}) => {
    const createNumberButton = (num: string): JSX.Element => (
        <button
            onClick={() => onNumberClick(num)}
            className={`
                p-4 rounded-lg
                font-medium
                transition-all duration-200
                transform active:scale-95
                ${num === "0" ? "col-span-2" : ""}
                bg-slate-100 hover:bg-slate-200 active:bg-slate-300
                dark:bg-slate-800 dark:hover:bg-slate-700 dark:active:bg-slate-600 
                text-slate-900 dark:text-slate-200
                shadow-sm
            `}
        >
            {num}
        </button>
    );

    // 키보드 이벤트 처리
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // event.preventDefault()를 선택적으로 호출
            const preventDefaultKeys = [
                "/",
                "*",
                "-",
                "+",
                "=",
                "Enter",
                "Escape",
                "Backspace",
            ];
            if (preventDefaultKeys.includes(event.key)) {
                event.preventDefault();
            }

            // 숫자와 소수점
            if (/^[0-9.]$/.test(event.key)) {
                onNumberClick(event.key);
                return;
            }

            // 연산자
            switch (event.key) {
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
                case "Enter":
                    onOperatorClick("=");
                    break;
                case "Escape":
                    onOperatorClick("C");
                    break;
                case "Backspace":
                    onOperatorClick("DEL");
                    break;
                default:
                    break;
            }
        };

        // 이벤트 리스너 등록
        window.addEventListener("keydown", handleKeyDown);

        // 클린업 함수
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onNumberClick, onOperatorClick]);

    const createOperatorButton = (
        operator: string,
        display: string
    ): JSX.Element => (
        <button
            onClick={() => onOperatorClick(operator)}
            className={`
                p-4 rounded-lg
                font-medium
                transition-all duration-200
                transform active:scale-95
                bg-slate-800 hover:bg-slate-700 active:bg-slate-600
                text-slate-200
                shadow-sm
            `}
        >
            {display}
        </button>
    );

    return (
        <div className="w-full h-full bg-slate-900 flex flex-col">
        <div
            className="relative w-[320px] mx-auto p-6 rounded-2xl 
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
                    {display}
                </div>
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-4 gap-2">
                {/* First Row */}
                <button
                    onClick={() => onOperatorClick("C")}
                    className="col-span-2 bg-red-500 hover:bg-red-600 active:bg-red-700 
                dark:bg-red-500/90 dark:hover:bg-red-600 dark:active:bg-red-700 
                text-white p-4 rounded-lg font-medium transition-all duration-200 
                transform active:scale-95"
                >
                    AC
                </button>
                {createOperatorButton("DEL", "⌫")}
                {createOperatorButton("/", "÷")}

                {/* Second Row */}
                {createNumberButton("7")}
                {createNumberButton("8")}
                {createNumberButton("9")}
                {createOperatorButton("*", "×")}

                {/* Third Row */}
                {createNumberButton("4")}
                {createNumberButton("5")}
                {createNumberButton("6")}
                {createOperatorButton("-", "-")}

                {/* Fourth Row */}
                {createNumberButton("1")}
                {createNumberButton("2")}
                {createNumberButton("3")}
                {createOperatorButton("+", "+")}

                {/* Fifth Row */}
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

export default BasicCalculator;
