type CalculatorState = {
    memory: number;
    isRadianMode: boolean;
};

const createCalculatorEngine = () => {
    const state: CalculatorState = { memory: 0, isRadianMode: false };

    // 각도 변환 헬퍼 함수
    const toRadians = (degrees: number): number => {
        return state.isRadianMode ? degrees : (degrees * Math.PI) / 180;
    };

    // 각도/라디안 모드 전환
    const setAngleMode = (isRadian: boolean) => {
        state.isRadianMode = isRadian;
    };

    // 계산 함수
    const calculate = (
        operator: string,
        value: number,
        secondValue?: number
    ): number => {
        try {
            switch (operator) {
                // 기본 연산
                case "+":
                    return value + (secondValue ?? 0);
                case "-":
                    return value - (secondValue ?? 0);
                case "*":
                    return value * (secondValue ?? 1);
                case "/":
                    if (secondValue === 0) throw new Error("Division by zero");
                    return value / (secondValue ?? 1);

                // 삼각함수
                case "sin":
                    return Math.sin(toRadians(value));
                case "cos":
                    return Math.cos(toRadians(value));
                case "tan":
                    return Math.tan(toRadians(value));

                // 지수/로그 함수
                case "exp":
                    return Math.exp(value);
                case "log":
                    if (value <= 0)
                        throw new Error("Invalid input for logarithm");
                    return Math.log10(value);
                case "ln":
                    if (value <= 0)
                        throw new Error("Invalid input for natural logarithm");
                    return Math.log(value);

                // 제곱/제곱근
                case "x²":
                    return Math.pow(value, 2);
                case "^":
                    if (secondValue === undefined)
                        throw new Error("Second operand required for power");
                    return Math.pow(value, secondValue);
                case "sqrt":
                    if (value < 0)
                        throw new Error("Invalid input for square root");
                    return Math.sqrt(value);

                // 기타 함수
                case "1/x":
                    if (value === 0) throw new Error("Division by zero");
                    return 1 / value;
                case "|x|":
                    return Math.abs(value);

                // 상수
                case "pi":
                    return Math.PI;
                case "e":
                    return Math.E;

                // 메모리 연산
                case "mc":
                    state.memory = 0;
                    return value;
                case "mr":
                    return state.memory;
                case "m+":
                    state.memory += value;
                    return value;
                case "m-":
                    state.memory -= value;
                    return value;
                case "ms":
                    state.memory = value;
                    return value;

                default:
                    return value;
            }
        } catch (error) {
            console.error("Calculation error:", error);
            throw error;
        }
    };

    // 연산자 타입 체크 함수들
    const isUnaryOperator = (operator: string): boolean => {
        return [
            "sin",
            "cos",
            "tan",
            "sqrt",
            "x²",
            "1/x",
            "|x|",
            "exp",
            "log",
            "ln",
        ].includes(operator);
    };

    const isMemoryOperator = (operator: string): boolean => {
        return ["mc", "mr", "m+", "m-", "ms"].includes(operator);
    };

    const isConstant = (operator: string): boolean => {
        return ["pi", "e"].includes(operator);
    };

    const isBinaryOperator = (operator: string): boolean => {
        return ["+", "-", "*", "/", "^"].includes(operator);
    };

    return {
        setAngleMode,
        calculate,
        isUnaryOperator,
        isMemoryOperator,
        isConstant,
        isBinaryOperator,
    };
};
