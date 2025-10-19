import React, { useState } from "react";

function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  const [inputString, setInputString] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [currentValue, setCurrentValue] = useState(0);
  const [operation, setOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [memory, setMemory] = useState(0);

  const handleNumber = (num) => {
    if (waitingForNewValue) {
      setDisplay(String(num));
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === "0" ? String(num) : display + String(num));
    }
    setCurrentValue(
      parseFloat(display === "0" ? String(num) : display + String(num))
    );
  };

  const handleDecimal = () => {
    if (waitingForNewValue) {
      setDisplay("0.");
      setWaitingForNewValue(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleOperation = (op) => {
    const inputValue = parseFloat(display);

    if (operation && waitingForNewValue) {
      setOperation(op);
      return;
    }

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const result = calculateResult(previousValue, inputValue, operation);
      setCurrentValue(result);
      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForNewValue(true);
    setOperation(op);
  };

  const calculateResult = (firstOperand, secondOperand, operation) => {
    switch (operation) {
      case "+":
        return firstOperand + secondOperand;
      case "-":
        return firstOperand - secondOperand;
      case "×":
        return firstOperand * secondOperand;
      case "÷":
        if (secondOperand === 0) {
          alert("Cannot divide by zero");
          return 0;
        }
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const result = calculateResult(previousValue, inputValue, operation);
      setCurrentValue(result);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setCurrentValue(0);
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const handleClearEntry = () => {
    setDisplay("0");
    setCurrentValue(0);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      const newDisplay = display.slice(0, -1);
      setDisplay(newDisplay);
      setCurrentValue(parseFloat(newDisplay));
    } else {
      setDisplay("0");
      setCurrentValue(0);
    }
  };

  const handlePercent = () => {
    const value = parseFloat(display);
    const newValue = value / 100;
    setDisplay(String(newValue));
    setCurrentValue(newValue);
  };

  const handleReciprocal = () => {
    const value = parseFloat(display);
    if (value !== 0) {
      const newValue = 1 / value;
      setDisplay(String(newValue));
      setCurrentValue(newValue);
    } else {
      alert("Cannot divide by zero");
    }
  };

  const handleSquare = () => {
    const value = parseFloat(display);
    const newValue = value * value;
    setDisplay(String(newValue));
    setCurrentValue(newValue);
  };

  const handleSquareRoot = () => {
    const value = parseFloat(display);
    if (value >= 0) {
      const newValue = Math.sqrt(value);
      setDisplay(String(newValue));
      setCurrentValue(newValue);
    } else {
      alert("Invalid input for square root");
    }
  };

  const handleNegate = () => {
    const value = parseFloat(display);
    const newValue = -value;
    setDisplay(String(newValue));
    setCurrentValue(newValue);
  };

  const handleMemoryClear = () => setMemory(0);
  const handleMemoryRecall = () => {
    setDisplay(String(memory));
    setCurrentValue(memory);
  };
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
        <div className="px-6 pt-4 pb 0 text-right">
          <div className="text-gray-400 text-xl font-light overflow-hidden overflow-ellipsis">
            {inputString}
          </div>
        </div>
        <div className="px-6 pb-8 pt-2 text-right">
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
            onClick={handleClear}
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
