import { useState, useCallback } from "react";
import {
    OperatorType,
    CalculatorMemory,
    AngleMode,
    calculate,
    createCalculatorMemory,
    isUnaryOperator,
    isMemoryOperator,
    isConstant,
    isBinaryOperator,
    formatResult,
    CalculatorError,
} from "../types/calculatorTypes";

interface CalculatorState {
    display: string;
    equation: string;
    isNewNumber: boolean;
    lastOperator: OperatorType | null;
    lastNumber: string;
    memory: CalculatorMemory;
    angleMode: AngleMode;
    error: CalculatorError | null;
    isSecondMode: boolean; // 추가
}
export const useCalculator = () => {
    const [state, setState] = useState<CalculatorState>({
        display: "0",
        equation: "",
        isNewNumber: true,
        lastOperator: null,
        lastNumber: "",
        memory: createCalculatorMemory(),
        angleMode: "deg",
        error: null,
        isSecondMode: false, // 추가
    });

    const handleNumber = useCallback((num: string) => {
        setState((prev) => {
            // 에러 상태에서는 새로운 입력 시작
            if (prev.error) {
                return {
                    ...prev,
                    display: num,
                    isNewNumber: false,
                    error: null,
                    equation: "",
                };
            }

            // 새로운 숫자 입력 시작
            if (prev.isNewNumber) {
                return {
                    ...prev,
                    display: num,
                    isNewNumber: false,
                };
            }

            // 기존 숫자에 추가
            const newDisplay = prev.display === "0" ? num : prev.display + num;
            return {
                ...prev,
                display: newDisplay,
            };
        });
    }, []);

    const handleDecimalPoint = useCallback(() => {
        setState((prev) => {
            if (prev.error) {
                return {
                    ...prev,
                    display: "0.",
                    isNewNumber: false,
                    error: null,
                    equation: "",
                };
            }

            if (prev.isNewNumber) {
                return {
                    ...prev,
                    display: "0.",
                    isNewNumber: false,
                };
            }

            if (!prev.display.includes(".")) {
                return {
                    ...prev,
                    display: prev.display + ".",
                };
            }

            return prev;
        });
    }, []);

    // 2nd 모드 토글 함수 추가
    const toggleSecondMode = useCallback(() => {
        setState((prev) => ({
            ...prev,
            isSecondMode: !prev.isSecondMode,
        }));
    }, []);

    const handleOperator = useCallback((operator: OperatorType) => {
        setState((prev) => {
            try {
                const currentNumber = parseFloat(prev.display);

                // 2nd 버튼 처리
                if (operator === "2nd") {
                    return {
                        ...prev,
                        isSecondMode: !prev.isSecondMode,
                    };
                }

                // 특수 연산자 처리
                if (operator === "C") {
                    return {
                        ...prev,
                        display: "0",
                        equation: "",
                        isNewNumber: true,
                        lastOperator: null,
                        lastNumber: "",
                        error: null,
                        isSecondMode: false,
                    };
                }

                if (operator === "DEL") {
                    if (prev.isNewNumber || prev.display.length === 1) {
                        return {
                            ...prev,
                            display: "0",
                            isNewNumber: true,
                        };
                    }
                    return {
                        ...prev,
                        display: prev.display.slice(0, -1),
                    };
                }

                // 메모리 연산자 처리
                if (isMemoryOperator(operator)) {
                    const { result, memory } = calculate(
                        operator,
                        currentNumber,
                        {
                            memory: prev.memory,
                            angleMode: prev.angleMode,
                        }
                    );
                    return {
                        ...prev,
                        display: formatResult(result),
                        isNewNumber: true,
                        memory: memory ?? prev.memory,
                    };
                }

                // 단항 연산자 처리
                if (isUnaryOperator(operator)) {
                    let actualOperator = operator;
                    if (prev.isSecondMode) {
                        switch (operator) {
                            case "sin":
                                actualOperator = "arcsin";
                                break;
                            case "cos":
                                actualOperator = "arccos";
                                break;
                            case "tan":
                                actualOperator = "arctan";
                                break;
                            case "sqrt":
                                actualOperator = "cbrt";
                                break;
                            case "x²":
                                actualOperator = "x³";
                                break;
                        }
                    }

                    const result = calculate(
                        actualOperator as OperatorType,
                        currentNumber,
                        {
                            angleMode: prev.angleMode,
                        }
                    );

                    if (result.error) {
                        return {
                            ...prev,
                            display: "Error",
                            equation: `${actualOperator}(${currentNumber}) = Error`,
                            error: {
                                message: result.error,
                                type: "math",
                            },
                            isNewNumber: true,
                            lastOperator: null,
                            lastNumber: "",
                            isSecondMode: false,
                        };
                    }

                    return {
                        ...prev,
                        display: formatResult(result.result),
                        equation: `${actualOperator}(${currentNumber}) = ${formatResult(
                            result.result
                        )}`,
                        isNewNumber: true,
                        lastOperator: null,
                        lastNumber: "",
                        isSecondMode: false,
                    };
                }

                // 이항 연산자 처리
                if (isBinaryOperator(operator)) {
                    // 이전에 단항 연산자가 있었다면 그 결과값을 사용
                    const numberToUse = prev.isNewNumber
                        ? prev.display
                        : currentNumber;
                    return {
                        ...prev,
                        lastOperator: operator,
                        lastNumber: numberToUse,
                        equation: `${numberToUse} ${operator} `,
                        isNewNumber: true,
                        isSecondMode: false, // 연산자 입력 시 2nd 모드 해제
                    };
                }

                // 상수 처리
                if (isConstant(operator)) {
                    const { result } = calculate(operator, currentNumber);
                    return {
                        ...prev,
                        display: formatResult(result),
                        isNewNumber: true,
                        isSecondMode: false,
                    };
                }

                // 등호 처리
                if (operator === "=") {
                    if (!prev.lastOperator || !prev.lastNumber) {
                        return prev;
                    }

                    const { result } = calculate(
                        prev.lastOperator,
                        parseFloat(prev.lastNumber),
                        {
                            secondValue: currentNumber,
                            angleMode: prev.angleMode,
                        }
                    );

                    return {
                        ...prev,
                        display: formatResult(result),
                        equation: `${
                            prev.equation
                        }${currentNumber} = ${formatResult(result)}`,
                        isNewNumber: true,
                        lastOperator: null,
                        lastNumber: "",
                        isSecondMode: false, // 계산 완료 후 2nd 모드 해제
                    };
                }

                return prev;
            } catch (error) {
                return {
                    ...prev,
                    display: "Error",
                    equation:
                        error instanceof Error
                            ? error.message
                            : "Unknown error",
                    error: {
                        message:
                            error instanceof Error
                                ? error.message
                                : "Unknown error",
                        type: "math",
                    },
                    isSecondMode: false,
                };
            }
        });
    }, []);

    const calculateResult = useCallback(() => {
        try {
            const currentNumber = parseFloat(state.display);
            if (state.lastOperator && state.lastNumber) {
                const lastNum = parseFloat(state.lastNumber);
                const { result, memory, error } = calculate(
                    state.lastOperator,
                    lastNum,
                    {
                        secondValue: currentNumber,
                        memory: state.memory,
                        angleMode: state.angleMode,
                    }
                );

                if (error) {
                    throw new Error(error);
                }

                setState((prev) => ({
                    ...prev,
                    display: formatResult(result),
                    equation: `${
                        prev.equation
                    }${currentNumber} = ${formatResult(result)}`,
                    isNewNumber: true,
                    lastOperator: null,
                    lastNumber: "",
                    memory: memory ?? prev.memory,
                }));
            }
        } catch (error) {
            setState((prev) => ({
                ...prev,
                display: "Error",
                equation: "",
                error:
                    error instanceof Error
                        ? { message: error.message, type: "math" }
                        : { message: "Unknown error", type: "system" },
            }));
        }
    }, [state]);

    return {
        state,
        handleNumber,
        handleDecimalPoint,
        handleOperator,
        calculateResult,
        setAngleMode: (mode: AngleMode) =>
            setState((prev) => ({ ...prev, angleMode: mode })),
        clearMemory: () =>
            setState((prev) => ({ ...prev, memory: createCalculatorMemory() })),
        clearError: () => setState((prev) => ({ ...prev, error: null })),
        toggleSecondMode, // 추가
    };
};
