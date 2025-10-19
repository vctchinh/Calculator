import React, { useState } from "react";

function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const [memory, setMemory] = useState(0);
  const [lastOperand, setLastOperand] = useState(null); // Lưu số hạng cuối để lặp lại phép tính
  const [lastOperation, setLastOperation] = useState(null); // Lưu phép tính cuối

  // Handle number button clicks
  const handleNumber = (num) => {
    if (shouldResetDisplay) {
      setDisplay(String(num));
      setShouldResetDisplay(false);
    } else {
      setDisplay(display === "0" ? String(num) : display + num);
    }
  };

  const handleDecimal = () => {
    if (shouldResetDisplay) {
      setDisplay("0.");
      setShouldResetDisplay(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleOperation = (op) => {
    const currentValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operation && !shouldResetDisplay) {
      const result = calculateResult(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    } else {
      setPreviousValue(currentValue);
    }

    setOperation(op);
    setShouldResetDisplay(true);
    setLastOperand(null);
    setLastOperation(null);
  };

  const calculateResult = (prev, current, op) => {
    switch (op) {
      case "+":
        return prev + current;
      case "-":
        return prev - current;
      case "×":
        return prev * current;
      case "÷":
        return current !== 0 ? prev / current : 0;
      default:
        return current;
    }
  };

  const handleEquals = () => {
    const currentValue = parseFloat(display);

    if (lastOperand !== null && lastOperation !== null) {
      const result = calculateResult(currentValue, lastOperand, lastOperation);
      setDisplay(String(result));
      return;
    }

    if (operation && previousValue !== null) {
      let operand;

      if (shouldResetDisplay) {
        operand = previousValue;
      } else {
        operand = currentValue;
      }

      const result = calculateResult(previousValue, operand, operation);
      setDisplay(String(result));

      setLastOperand(operand);
      setLastOperation(operation);

      setPreviousValue(null);
      setOperation(null);
      setShouldResetDisplay(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
    setLastOperand(null);
    setLastOperation(null);
  };

  const handleClearEntry = () => {
    setDisplay("0");
    setShouldResetDisplay(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const handlePercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const handleReciprocal = () => {
    const value = parseFloat(display);
    if (value !== 0) {
      setDisplay(String(1 / value));
    }
  };

  const handleSquare = () => {
    const value = parseFloat(display);
    setDisplay(String(value * value));
  };

  const handleSquareRoot = () => {
    const value = parseFloat(display);
    if (value >= 0) {
      setDisplay(String(Math.sqrt(value)));
    }
  };

  const handleNegate = () => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  };

  const handleMemoryClear = () => setMemory(0);
  const handleMemoryRecall = () => setDisplay(String(memory));
  const handleMemoryAdd = () => setMemory(memory + parseFloat(display));
  const handleMemorySubtract = () => setMemory(memory - parseFloat(display));
  const handleMemoryStore = () => setMemory(parseFloat(display));

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-80 bg-zinc-900 rounded-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white text-lg font-semibold">Standard</span>
          </div>
          <button className="text-white hover:bg-zinc-800 p-2 rounded">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
        {/* Display */}
        <div className="px-6 pb-8 pt-6 text-right">
          <div className="text-white text-5xl font-light overflow-hidden overflow-ellipsis">
            {display}
          </div>
        </div>
        {/* Memory Buttons */}
        <div className="grid grid-cols-6 gap-1 px-2 pb-2">
          <button
            onClick={handleMemoryClear}
            className={`py-3 text-sm ${
              memory !== 0 ? "text-white" : "text-gray-600"
            } hover:bg-zinc-800 rounded transition-colors`}
          >
            MC
          </button>
          <button
            onClick={handleMemoryRecall}
            className={`py-3 text-sm ${
              memory !== 0 ? "text-white" : "text-gray-600"
            } hover:bg-zinc-800 rounded transition-colors`}
          >
            MR
          </button>
          <button
            onClick={handleMemoryAdd}
            className={`py-3 text-sm ${
              memory !== 0 ? "text-white" : "text-gray-600"
            } hover:bg-zinc-800 rounded transition-colors`}
          >
            M+
          </button>
          <button
            onClick={handleMemorySubtract}
            className={`py-3 text-sm ${
              memory !== 0 ? "text-white" : "text-gray-600"
            } hover:bg-zinc-800 rounded transition-colors`}
          >
            M-
          </button>
          <button
            onClick={handleMemoryStore}
            className={`py-3 text-sm ${
              memory !== 0 ? "text-white" : "text-gray-600"
            } hover:bg-zinc-800 rounded transition-colors`}
          >
            MS
          </button>
          <button className="py-3 text-sm text-gray-600 hover:bg-zinc-800 rounded transition-colors">
            M▼
          </button>
        </div>
        {/* Calculator Buttons */}
        <div className="grid grid-cols-4 gap-1 p-2">
          {/* Row 1 */}
          <button
            onClick={handlePercent}
            className="bg-zinc-800 hover:bg-zinc-700 text-white py-4 text-lg rounded transition-colors"
          >
            %
          </button>
          <button
            onClick={handleClearEntry}
            className="bg-zinc-800 hover:bg-zinc-700 text-white py-4 text-lg rounded transition-colors"
          >
            CE
          </button>
          <button
            onClick={handleClear}
            className="bg-zinc-800 hover:bg-zinc-700 text-white py-4 text-lg rounded transition-colors"
          >
            C
          </button>
          <button
            onClick={handleBackspace}
            className="bg-zinc-800 hover:bg-zinc-700 text-white py-4 text-lg rounded transition-colors"
          >
            ⌫
          </button>

          {/* Row 2 */}
          <button
            onClick={handleReciprocal}
            className="bg-zinc-800 hover:bg-zinc-700 text-white py-4 text-base rounded transition-colors"
          >
            ¹⁄ₓ
          </button>
          <button
            onClick={handleSquare}
            className="bg-zinc-800 hover:bg-zinc-700 text-white py-4 text-base rounded transition-colors"
          >
            x²
          </button>
          <button
            onClick={handleSquareRoot}
            className="bg-zinc-800 hover:bg-zinc-700 text-white py-4 text-base rounded transition-colors"
          >
            ²√x
          </button>
          <button
            onClick={() => handleOperation("÷")}
            className="bg-zinc-800 hover:bg-zinc-700 text-white py-4 text-xl rounded transition-colors"
          >
            ÷
          </button>

          {/* Row 3 */}
          <button
            onClick={() => handleNumber(7)}
            className="bg-zinc-700 hover:bg-zinc-600 text-white py-4 text-xl rounded transition-colors"
          >
            7
          </button>
          <button
            onClick={() => handleNumber(8)}
            className="bg-zinc-700 hover:bg-zinc-600 text-white py-4 text-xl rounded transition-colors"
          >
            8
          </button>
          <button
            onClick={() => handleNumber(9)}
            className="bg-zinc-700 hover:bg-zinc-600 text-white py-4 text-xl rounded transition-colors"
          >
            9
          </button>
          <button
            onClick={() => handleOperation("×")}
            className="bg-zinc-800 hover:bg-zinc-700 text-white py-4 text-xl rounded transition-colors"
          >
            ×
          </button>

          {/* Row 4 */}
          <button
            onClick={() => handleNumber(4)}
            className="bg-zinc-700 hover:bg-zinc-600 text-white py-4 text-xl rounded transition-colors"
          >
            4
          </button>
          <button
            onClick={() => handleNumber(5)}
            className="bg-zinc-700 hover:bg-zinc-600 text-white py-4 text-xl rounded transition-colors"
          >
            5
          </button>
          <button
            onClick={() => handleNumber(6)}
            className="bg-zinc-700 hover:bg-zinc-600 text-white py-4 text-xl rounded transition-colors"
          >
            6
          </button>
          <button
            onClick={() => handleOperation("-")}
            className="bg-zinc-800 hover:bg-zinc-700 text-white py-4 text-xl rounded transition-colors"
          >
            −
          </button>

          {/* Row 5 */}
          <button
            onClick={() => handleNumber(1)}
            className="bg-zinc-700 hover:bg-zinc-600 text-white py-4 text-xl rounded transition-colors"
          >
            1
          </button>
          <button
            onClick={() => handleNumber(2)}
            className="bg-zinc-700 hover:bg-zinc-600 text-white py-4 text-xl rounded transition-colors"
          >
            2
          </button>
          <button
            onClick={() => handleNumber(3)}
            className="bg-zinc-700 hover:bg-zinc-600 text-white py-4 text-xl rounded transition-colors"
          >
            3
          </button>
          <button
            onClick={() => handleOperation("+")}
            className="bg-zinc-800 hover:bg-zinc-700 text-white py-4 text-xl rounded transition-colors"
          >
            +
          </button>

          {/* Row 6 */}
          <button
            onClick={handleNegate}
            className="bg-zinc-700 hover:bg-zinc-600 text-white py-4 text-xl rounded transition-colors"
          >
            ⁺⁄₋
          </button>
          <button
            onClick={() => handleNumber(0)}
            className="bg-zinc-700 hover:bg-zinc-600 text-white py-4 text-xl rounded transition-colors"
          >
            0
          </button>
          <button
            onClick={handleDecimal}
            className="bg-zinc-700 hover:bg-zinc-600 text-white py-4 text-xl rounded transition-colors"
          >
            .
          </button>
          <button
            onClick={handleEquals}
            className="bg-cyan-500 hover:bg-cyan-400 text-white py-4 text-xl rounded transition-colors"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
}

export default CalculatorApp;
