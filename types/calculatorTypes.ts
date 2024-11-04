// calculatorTypes.ts
export type OperatorType =
    | "+"
    | "-"
    | "*"
    | "/"
    | "="
    | "C"
    | "DEL"
    | "sin"
    | "cos"
    | "tan"
    | "arcsin" // 추가
    | "arccos" // 추가
    | "arctan" // 추가
    | "sqrt"
    | "cbrt" // 추가 (세제곱근)
    | "^"
    | "x²"
    | "x³" // 추가
    | "1/x"
    | "|x|"
    | "pi"
    | "e"
    | "exp"
    | "mc"
    | "mr"
    | "m+"
    | "m-"
    | "ms"
    | "2nd"; // 2nd 모드 토글용

export type AngleMode = "deg" | "rad";

export interface CalculatorMemory {
    value: number;
    hasValue: boolean;
}

export interface CalculatorError {
    message: string;
    type: "math" | "system";
}

export const createCalculatorMemory = (): CalculatorMemory => ({
    value: 0,
    hasValue: false,
});

export const isUnaryOperator = (operator: OperatorType): boolean =>
    [
        // 기본 삼각함수
        "sin",
        "cos",
        "tan",
        // 역삼각함수
        "arcsin",
        "arccos",
        "arctan",
        // 제곱근 관련
        "sqrt",
        "cbrt",
        // 제곱 관련
        "x²",
        "x³",
        // 기타 함수
        "1/x",
        "|x|",
        "exp",
    ].includes(operator);

export const isBinaryOperator = (operator: OperatorType): boolean =>
    ["+", "-", "*", "/", "^"].includes(operator);

export const isMemoryOperator = (operator: OperatorType): boolean =>
    ["mc", "mr", "m+", "m-", "ms"].includes(operator);

export const isConstant = (operator: OperatorType): boolean =>
    ["pi", "e"].includes(operator);

export const formatResult = (num: number): string => {
    if (isNaN(num)) return "Error";
    if (!isFinite(num)) return "Error";

    const precision = 10;
    const result = Number(num.toPrecision(precision));

    return Number.isInteger(result)
        ? result.toString()
        : result.toString().replace(/\.?0+$/, "");
};

interface CalculateOptions {
    secondValue?: number;
    memory?: CalculatorMemory;
    angleMode?: AngleMode;
}

export const calculate = (
    operator: OperatorType,
    value: number,
    options: CalculateOptions = {}
): { result: number; memory?: CalculatorMemory; error?: string } => {
    const { secondValue, memory, angleMode = "deg" } = options;

    try {
        switch (operator) {
            // 기본 연산자
            case "+":
                return { result: value + (secondValue ?? 0) };
            case "-":
                return { result: value - (secondValue ?? 0) };
            case "*":
                return { result: value * (secondValue ?? 1) };
            case "/":
                if (secondValue === 0) throw new Error("Division by zero");
                return { result: value / (secondValue ?? 1) };
            case "^":
                return { result: Math.pow(value, secondValue ?? 2) };

            // 삼각함수
            case "sin":
                return {
                    result: Math.sin(
                        angleMode === "deg" ? (value * Math.PI) / 180 : value
                    ),
                };
            case "cos":
                return {
                    result: Math.cos(
                        angleMode === "deg" ? (value * Math.PI) / 180 : value
                    ),
                };
            case "tan":
                return {
                    result: Math.tan(
                        angleMode === "deg" ? (value * Math.PI) / 180 : value
                    ),
                };

            // 역삼각함수 - 입력값 검사 추가
            case "arcsin":
                if (value < -1 || value > 1) {
                    throw new Error(
                        "Invalid input: arcsin requires value between -1 and 1"
                    );
                }
                return {
                    result:
                        angleMode === "deg"
                            ? (Math.asin(value) * 180) / Math.PI
                            : Math.asin(value),
                };

            case "arccos":
                if (value < -1 || value > 1) {
                    throw new Error(
                        "Invalid input: arccos requires value between -1 and 1"
                    );
                }
                return {
                    result:
                        angleMode === "deg"
                            ? (Math.acos(value) * 180) / Math.PI
                            : Math.acos(value),
                };

            case "arctan":
                return {
                    result:
                        angleMode === "deg"
                            ? (Math.atan(value) * 180) / Math.PI
                            : Math.atan(value),
                };

            // 기타 수학 함수
            case "sqrt": {
                if (value < 0) throw new Error("Invalid input for square root");
                return { result: Math.sqrt(value) };
            }
            case "cbrt": // 세제곱근 추가
                return { result: Math.cbrt(value) };
            case "x²":
                return { result: value * value };
            case "x³": // 세제곱 추가
                return { result: Math.pow(value, 3) };
            case "1/x":
                if (value === 0) throw new Error("Division by zero");
                return { result: 1 / value };
            case "|x|":
                return { result: Math.abs(value) };
            case "exp":
                return { result: Math.exp(value) };

            // 상수
            case "pi":
                return { result: Math.PI };
            case "e":
                return { result: Math.E };

            // 메모리 연산
            case "mc":
                return {
                    result: value,
                    memory: createCalculatorMemory(),
                };
            case "mr":
                return {
                    result: memory?.hasValue ? memory.value : value,
                };
            case "m+":
                return {
                    result: value,
                    memory: {
                        value: (memory?.value ?? 0) + value,
                        hasValue: true,
                    },
                };
            case "m-":
                return {
                    result: value,
                    memory: {
                        value: (memory?.value ?? 0) - value,
                        hasValue: true,
                    },
                };
            case "ms":
                return {
                    result: value,
                    memory: {
                        value: value,
                        hasValue: true,
                    },
                };

            default:
                throw new Error("Unknown operator");
        }
    } catch (error) {
        return {
            result: NaN,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
};
