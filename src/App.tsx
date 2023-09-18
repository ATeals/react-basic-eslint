import { useReducer } from "react";

const DIGITS = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

const OPERATORS = {
    ADD: "+",
    SUB: "-",
    MUL: "x",
    DIV: "/",
} as const;

const EQUAL = "=";

const MODIFIER = "AC";

const ACTION = {
    OPERATORS: "OPERATORS",
    DIGITS: "DIGITS",
    EQUAL: "EQUAL",
    MODIFIER: "MODIFIER",
} as const;

const ERRORVALUE = ["NaN", "Infinity", "-Infinity"];

const DEFAULTSTATE = { leftOperand: "0", operator: "", rightOperand: "" };

interface State {
    leftOperand: string;
    operator: string;
    rightOperand: string;
}

interface ActionType {
    type: string;
    payload: string;
}

const reducer = (state: State, action: ActionType) => {
    switch (action.type) {
        case ACTION.OPERATORS:
            if (state.leftOperand === "오류") {
                console.log("초기화 해야 합니다.");
                return state;
            }

            if (action.payload === EQUAL) {
                if (!state.operator) {
                    return state;
                }

                const CalculateMap: {
                    [operator: string]: (leftOperand: string, rightOperand: string) => number;
                } = {
                    "+": (leftOperand: string, rightOperand: string) => Number(leftOperand) + Number(rightOperand),
                    "-": (leftOperand: string, rightOperand: string) => Number(leftOperand) - Number(rightOperand),
                    x: (leftOperand: string, rightOperand: string) => Number(leftOperand) * Number(rightOperand),
                    "/": (leftOperand: string, rightOperand: string) => Math.floor(Number(leftOperand) / Number(rightOperand)),
                };

                const newOperand = String(CalculateMap[state.operator](state.leftOperand, state.rightOperand));

                const newState = { ...DEFAULTSTATE, leftOperand: ERRORVALUE.includes(newOperand) ? "오류" : newOperand };

                return newState;
            }

            if (state.operator && action.payload !== EQUAL) {
                console.log("연산 기호는 한번만 작성가능");
                return state;
            }
            return { ...state, operator: action.payload };
        case ACTION.DIGITS:
            if (state.leftOperand === "오류") {
                console.log("초기화 해야 합니다.");
                return state;
            }

            const newLeftOperand = state.leftOperand.length > 2 ? state : { ...state, leftOperand: String(Number(state.leftOperand + action.payload)) };
            const newRightOperand = state.rightOperand.length > 2 ? state : { ...state, rightOperand: String(Number(state.rightOperand + action.payload)) };

            return state.operator ? newRightOperand : newLeftOperand;
        case ACTION.MODIFIER:
            return DEFAULTSTATE;
    }

    return state;
};

const App = () => {
    const [state, dispatch] = useReducer(reducer, DEFAULTSTATE);

    const clickDigit = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLButtonElement;
        if (!target.textContent) return;

        dispatch({ type: ACTION.DIGITS, payload: target.textContent });
    };

    const clickOperator = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLButtonElement;
        if (!target.textContent) return;

        dispatch({ type: ACTION.OPERATORS, payload: target.textContent });
    };

    const clickModifier = (e: React.MouseEvent<HTMLButtonElement>) => {
        const target = e.target as HTMLButtonElement;
        if (!target.textContent) return;

        dispatch({ type: ACTION.MODIFIER, payload: target.textContent });
    };

    const { leftOperand, operator, rightOperand } = state;

    const total = rightOperand || operator || leftOperand;

    return (
        <div className="flex justify-center items-center">
            <div className="calculator">
                <h1 id="total">{total}</h1>
                <div
                    className="digits flex"
                    onClick={clickDigit}
                >
                    {DIGITS.map((digit) => (
                        <button
                            key={digit}
                            className="digit"
                        >
                            {digit}
                        </button>
                    ))}
                </div>
                <div className="modifiers subgrid">
                    <button
                        className="modifier"
                        onClick={clickModifier}
                    >
                        {MODIFIER}
                    </button>
                </div>
                <div
                    className="operations subgrid"
                    onClick={clickOperator}
                >
                    {Object.values(OPERATORS).map((operator) => (
                        <button key={operator}>{operator}</button>
                    ))}
                    <button>{EQUAL}</button>
                </div>
            </div>
        </div>
    );
};

export default App;
