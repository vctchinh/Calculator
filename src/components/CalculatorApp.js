import React, { useState } from "react";

function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  const [inputString, setInputString] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const [memory, setMemory] = useState(0);
  const [lastOperand, setLastOperand] = useState(null);
  const [lastOperation, setLastOperation] = useState(null);

  // New state for history panel
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

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
    setInputString(display + " " + op);
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
      const calcString =
        String(currentValue) + " " + lastOperation + " " + String(lastOperand);
      setInputString(calcString);
      setDisplay(String(result));

      // Add to history
      addToHistory(calcString, result);
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
      const calcString =
        String(previousValue) + " " + operation + " " + String(currentValue);
      setInputString(calcString);
      setDisplay(String(result));

      // Add to history
      addToHistory(calcString, result);

      setLastOperand(operand);
      setLastOperation(operation);

      setPreviousValue(null);
      setOperation(null);
      setShouldResetDisplay(true);
    }
  };

  const addToHistory = (calculation, result) => {
    const newEntry = {
      id: Date.now(),
      calculation: calculation,
      result: String(result),
    };
    setHistory((prev) => [newEntry, ...prev].slice(0, 5));
  };

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
    setLastOperand(null);
    setLastOperation(null);
    setInputString("");
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

    if (previousValue === null && lastOperation !== null) {
      const percentValue = (value * value) / 100;
      setDisplay(String(percentValue));
      setInputString(String(percentValue));
      return;
    }

    if (previousValue === null) {
      setDisplay("0");
      setInputString("0");
    } else {
      const percentBase = shouldResetDisplay ? previousValue : value;
      const percentValue = (previousValue * percentBase) / 100;
      setDisplay(String(percentValue));
      setInputString(
        String(previousValue) + " " + operation + " " + String(percentValue)
      );
      setShouldResetDisplay(false);
    }
  };

  const handleReciprocal = () => {
    const value = parseFloat(display);
    if (value !== 0) {
      setDisplay(String(1 / value));
      if (previousValue === null) {
        setInputString("1/(" + String(value));
      } else {
        setInputString(
          String(previousValue) + " " + operation + " 1/(" + String(value)
        );
      }
    }
    setShouldResetDisplay(false);
  };

  const handleSquare = () => {
    const value = parseFloat(display);
    setDisplay(String(value * value));
    if (previousValue === null) {
      setInputString("sqr(" + String(value) + ")");
    } else {
      setInputString(
        String(previousValue) + " " + operation + " sqr(" + String(value) + ")"
      );
    }
    setShouldResetDisplay(false);
  };

  const handleSquareRoot = () => {
    const value = parseFloat(display);
    if (value >= 0) {
      setDisplay(String(Math.sqrt(value)));
      if (previousValue === null) {
        setInputString("sqrt(" + String(value) + ")");
      } else {
        setInputString(
          String(previousValue) +
            " " +
            operation +
            " sqrt(" +
            String(value) +
            ")"
        );
      }
      setShouldResetDisplay(false);
    }
  };

  const handleNegate = () => {
    const value = parseFloat(display);
    setDisplay(String(-value));
    setInputString(String(-value));
    setShouldResetDisplay(false);
  };

  const handleMemoryClear = () => setMemory(0);
  const handleMemoryRecall = () => setDisplay(String(memory));
  const handleMemoryAdd = () => setMemory(memory + parseFloat(display));
  const handleMemorySubtract = () => setMemory(memory - parseFloat(display));
  const handleMemoryStore = () => setMemory(parseFloat(display));

  const toggleHistory = () => setShowHistory(!showHistory);

  const clearHistory = () => setHistory([]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-2 sm:p-4">
      <div className="flex w-full max-w-6xl gap-2 items-start justify-center">
        {/* Main Calculator */}
        <div
          className={`bg-zinc-900 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out ${
            showHistory
              ? "w-full lg:w-4/5"
              : "w-full max-w-sm sm:max-w-md lg:max-w-lg"
          }`}
        >
          {/* Header */}
          <div className="px-3 py-2 md:px-4 md:py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white text-base md:text-lg font-semibold">
                Standard
              </span>
            </div>
            <button
              onClick={toggleHistory}
              className="text-white hover:bg-zinc-800 p-1.5 md:p-2 rounded transition-colors"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
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
          <div className="px-4 pb-1 pt-1 md:px-6 md:pb-1 md:pt-2 text-right h-8">
            <div className="text-gray-300 text-sm sm:text-base md:text-xl lg:text-2xl font-light overflow-hidden overflow-ellipsis">
              {inputString}
            </div>
          </div>
          <div className="px-4 pb-4 pt-1 md:px-6 md:pb-6 md:pt-1 text-right">
            <div className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light overflow-hidden overflow-ellipsis">
              {display}
            </div>
          </div>
          {/* Memory Buttons */}
          <div className="grid grid-cols-6 gap-0.5 md:gap-1 px-1 pb-1 md:px-2 md:pb-2">
            <button
              onClick={handleMemoryClear}
              className={`py-2 md:py-3 text-xs md:text-sm ${
                memory !== 0 ? "text-white" : "text-gray-600"
              } hover:bg-zinc-800 rounded transition-colors`}
            >
              MC
            </button>
            <button
              onClick={handleMemoryRecall}
              className={`py-2 md:py-3 text-xs md:text-sm ${
                memory !== 0 ? "text-white" : "text-gray-600"
              } hover:bg-zinc-800 rounded transition-colors`}
            >
              MR
            </button>
            <button
              onClick={handleMemoryAdd}
              className={`py-2 md:py-3 text-xs md:text-sm ${
                memory !== 0 ? "text-white" : "text-gray-600"
              } hover:bg-zinc-800 rounded transition-colors`}
            >
              M+
            </button>
            <button
              onClick={handleMemorySubtract}
              className={`py-2 md:py-3 text-xs md:text-sm ${
                memory !== 0 ? "text-white" : "text-gray-600"
              } hover:bg-zinc-800 rounded transition-colors`}
            >
              M-
            </button>
            <button
              onClick={handleMemoryStore}
              className={`py-2 md:py-3 text-xs md:text-sm ${
                memory !== 0 ? "text-white" : "text-gray-600"
              } hover:bg-zinc-800 rounded transition-colors`}
            >
              MS
            </button>
            <button className="py-2 md:py-3 text-xs md:text-sm text-gray-600 hover:bg-zinc-800 rounded transition-colors">
              M▼
            </button>
          </div>
          {/* Calculator Buttons */}
          <div className="grid grid-cols-4 gap-0.5 md:gap-1 p-1 md:p-2">
            {/* Row 1 */}
            <button
              onClick={handlePercent}
              className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 md:py-4 lg:py-5 text-base md:text-lg lg:text-xl rounded transition-colors"
            >
              %
            </button>
            <button
              onClick={handleClearEntry}
              className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 md:py-4 lg:py-5 text-base md:text-lg lg:text-xl rounded transition-colors"
            >
              CE
            </button>
            <button
              onClick={handleClear}
              className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 md:py-4 lg:py-5 text-base md:text-lg lg:text-xl rounded transition-colors"
            >
              C
            </button>
            <button
              onClick={handleBackspace}
              className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 md:py-4 lg:py-5 text-base md:text-lg lg:text-xl rounded transition-colors"
            >
              ⌫
            </button>

            {/* Row 2 */}
            <button
              onClick={handleReciprocal}
              className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 md:py-4 lg:py-5 text-sm md:text-base lg:text-lg rounded transition-colors"
            >
              ¹⁄ₓ
            </button>
            <button
              onClick={handleSquare}
              className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 md:py-4 lg:py-5 text-sm md:text-base lg:text-lg rounded transition-colors"
            >
              x²
            </button>
            <button
              onClick={handleSquareRoot}
              className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 md:py-4 lg:py-5 text-sm md:text-base lg:text-lg rounded transition-colors"
            >
              ²√x
            </button>
            <button
              onClick={() => handleOperation("÷")}
              className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 md:py-4 lg:py-5 text-lg md:text-xl lg:text-2xl rounded transition-colors"
            >
              ÷
            </button>

            {/* Row 3 */}
            <button
              onClick={() => handleNumber(7)}
              className="bg-zinc-700 hover:bg-zinc-600 text-white py-3 md:py-4 lg:py-5 text-lg md:text-xl lg:text-2xl rounded transition-colors"
            >
              7
            </button>
            <button
              onClick={() => handleNumber(8)}
              className="bg-zinc-700 hover:bg-zinc-600 text-white py-3 md:py-4 lg:py-5 text-lg md:text-xl lg:text-2xl rounded transition-colors"
            >
              8
            </button>
            <button
              onClick={() => handleNumber(9)}
              className="bg-zinc-700 hover:bg-zinc-600 text-white py-3 md:py-4 lg:py-5 text-lg md:text-xl lg:text-2xl rounded transition-colors"
            >
              9
            </button>
            <button
              onClick={() => handleOperation("×")}
              className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 md:py-4 lg:py-5 text-lg md:text-xl lg:text-2xl rounded transition-colors"
            >
              ×
            </button>

            {/* Row 4 */}
            <button
              onClick={() => handleNumber(4)}
              className="bg-zinc-700 hover:bg-zinc-600 text-white py-3 md:py-4 lg:py-5 text-lg md:text-xl lg:text-2xl rounded transition-colors"
            >
              4
            </button>
            <button
              onClick={() => handleNumber(5)}
              className="bg-zinc-700 hover:bg-zinc-600 text-white py-3 md:py-4 lg:py-5 text-lg md:text-xl lg:text-2xl rounded transition-colors"
            >
              5
            </button>
            <button
              onClick={() => handleNumber(6)}
              className="bg-zinc-700 hover:bg-zinc-600 text-white py-3 md:py-4 lg:py-5 text-lg md:text-xl lg:text-2xl rounded transition-colors"
            >
              6
            </button>
            <button
              onClick={() => handleOperation("-")}
              className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 md:py-4 lg:py-5 text-lg md:text-xl lg:text-2xl rounded transition-colors"
            >
              −
            </button>

            {/* Row 5 */}
            <button
              onClick={() => handleNumber(1)}
              className="bg-zinc-700 hover:bg-zinc-600 text-white py-3 md:py-4 lg:py-5 text-lg md:text-xl lg:text-2xl rounded transition-colors"
            >
              1
            </button>
            <button
              onClick={() => handleNumber(2)}
              className="bg-zinc-700 hover:bg-zinc-600 text-white py-3 md:py-4 lg:py-5 text-lg md:text-xl lg:text-2xl rounded transition-colors"
            >
              2
            </button>
            <button
              onClick={() => handleNumber(3)}
              className="bg-zinc-700 hover:bg-zinc-600 text-white py-3 md:py-4 lg:py-5 text-lg md:text-xl lg:text-2xl rounded transition-colors"
            >
              3
            </button>
            <button
              onClick={() => handleOperation("+")}
              className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 md:py-4 lg:py-5 text-lg md:text-xl lg:text-2xl rounded transition-colors"
            >
              +
            </button>

            {/* Row 6 */}
            <button
              onClick={handleNegate}
              className="bg-zinc-700 hover:bg-zinc-600 text-white py-3 md:py-4 lg:py-5 text-lg md:text-xl lg:text-2xl rounded transition-colors"
            >
              ⁺⁄₋
            </button>
            <button
              onClick={() => handleNumber(0)}
              className="bg-zinc-700 hover:bg-zinc-600 text-white py-3 md:py-4 lg:py-5 text-lg md:text-xl lg:text-2xl rounded transition-colors"
            >
              0
            </button>
            <button
              onClick={handleDecimal}
              className="bg-zinc-700 hover:bg-zinc-600 text-white py-3 md:py-4 lg:py-5 text-lg md:text-xl lg:text-2xl rounded transition-colors"
            >
              .
            </button>
            <button
              onClick={handleEquals}
              className="bg-cyan-500 hover:bg-cyan-400 text-white py-3 md:py-4 lg:py-5 text-lg md:text-xl lg:text-2xl rounded transition-colors"
            >
              =
            </button>
          </div>
        </div>

        {/* History Panel - Desktop */}
        {showHistory && (
          <div className="hidden lg:block w-1/5 bg-zinc-900 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-white text-lg font-semibold">History</h2>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="p-4 h-[calc(100vh-200px)] overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm text-center mt-8">
                  No history yet
                </p>
              ) : (
                <div className="space-y-3">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-zinc-800 rounded p-3 hover:bg-zinc-750 transition-colors"
                    >
                      <div className="text-gray-400 text-sm mb-1">
                        {entry.calculation}
                      </div>
                      <div className="text-white text-xl font-semibold">
                        = {entry.result}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* History Panel - Mobile Overlay */}
      {showHistory && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center sm:justify-center">
          <div className="bg-zinc-900 w-full sm:max-w-md sm:rounded-lg max-h-[80vh] sm:max-h-[70vh] flex flex-col animate-slide-up">
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-white text-lg font-semibold">History</h2>
              <div className="flex gap-2">
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={toggleHistory}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm text-center mt-8">
                  No history yet
                </p>
              ) : (
                <div className="space-y-3">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-zinc-800 rounded p-3 hover:bg-zinc-750 transition-colors"
                    >
                      <div className="text-gray-400 text-sm mb-1">
                        {entry.calculation}
                      </div>
                      <div className="text-white text-xl font-semibold">
                        = {entry.result}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalculatorApp;
