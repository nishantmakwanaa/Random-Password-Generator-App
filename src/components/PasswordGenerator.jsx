import { useState, useEffect } from "react";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [passLength, setPassLength] = useState(10);
  const [checkCount, setCheckCount] = useState(0);
  const [isUpperCase, setIsUpperCase] = useState(false);
  const [isLowerCase, setIsLowerCase] = useState(false);
  const [isNumbers, setIsNumbers] = useState(false);
  const [isSymbols, setIsSymbols] = useState(false);

  const symbols = '~!@#$%^&*()_-+={[}]|:;"<,>.?/';

  useEffect(() => {
    handleSlider();
  }, [passLength]);

  const handleSlider = () => {
    const inputSlider =
      document.querySelector < HTMLInputElement > "[data-lengthSlider]";
    const lengthDisplay = document.querySelector("[data-lengthNumber]");
    if (inputSlider && lengthDisplay) {
      inputSlider.value = passLength.toString();
      lengthDisplay.textContent = passLength.toString();
      const percentage =
        ((passLength - parseInt(inputSlider.min)) * 100) /
        (parseInt(inputSlider.max) - parseInt(inputSlider.min));
      inputSlider.style.backgroundSize = `${percentage}% 100%`;
    }
  };

  const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min)) + min;
  const generateRandomNo = () => getRandomInt(0, 9).toString();
  const generateUpperCase = () => String.fromCharCode(getRandomInt(65, 91));
  const generateLowerCase = () => String.fromCharCode(getRandomInt(97, 123));
  const generateSymbol = () => symbols.charAt(getRandomInt(0, symbols.length));

  const calcStrength = () => {
    if (
      isUpperCase &&
      isLowerCase &&
      (isNumbers || isSymbols) &&
      passLength >= 8
    ) {
      return "bg-green-500";
    } else if (
      (isLowerCase || isUpperCase) &&
      (isNumbers || isSymbols) &&
      passLength >= 6
    ) {
      return "bg-yellow-500";
    } else {
      return "bg-red-500";
    }
  };

  const handleGenerate = () => {
    if (checkCount === 0) return;

    if (passLength < checkCount) {
      setPassLength(checkCount);
      handleSlider();
    }

    let password = "";
    const funcArr = [];

    if (isUpperCase) funcArr.push(generateUpperCase);
    if (isLowerCase) funcArr.push(generateLowerCase);
    if (isNumbers) funcArr.push(generateRandomNo);
    if (isSymbols) funcArr.push(generateSymbol);

    for (let i = 0; i < funcArr.length; i++) {
      password += funcArr[i]();
    }

    for (let i = 0; i < passLength - funcArr.length; i++) {
      let randIndex = getRandomInt(0, funcArr.length);
      password += funcArr[randIndex]();
    }

    password = shufflePassword(Array.from(password));

    setPassword(password);
    handleSlider();
  };

  const shufflePassword = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array.join("");
  };

  const handleCheckBoxChange = () => {
    setCheckCount(
      [isUpperCase, isLowerCase, isNumbers, isSymbols].filter(Boolean).length
    );
    if (passLength < checkCount) {
      setPassLength(checkCount);
      handleSlider();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password).then(
      () => alert("Password copied!"),
      () => alert("Failed to copy")
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500">
      <div className="w-11/12 max-w-md">
        <h1 className="text-2xl font-bold text-white opacity-75 uppercase tracking-wide text-center mb-4">
          Password Generator
        </h1>

        <div className="relative bg-purple-900 rounded-lg border-b-4 border-purple-600 mb-4">
          <input
            value={password}
            readOnly
            placeholder="Password"
            className="w-full bg-transparent py-4 px-4 text-yellow-300 font-semibold text-xl tracking-wide placeholder-yellow-300 placeholder-opacity-65 focus:outline-none"
            data-passwordDisplay
          />
          <button
            className="absolute top-1/2 right-4 transform -translate-y-1/2 focus:outline-none"
            onClick={handleCopy}
          >
            <span className="sr-only">Copy password</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-cyan-400 hover:text-cyan-300 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>

        <div className="bg-purple-900 rounded-lg p-8 border-b-4 border-purple-600">
          <div className="flex justify-between items-center mb-4">
            <p className="text-white text-lg">Password Length</p>
            <p className="text-yellow-300 text-lg" data-lengthNumber>
              {passLength}
            </p>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={passLength}
            data-lengthSlider
            onChange={(e) => setPassLength(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
          />

          <div className="space-y-4 mt-6">
            {[
              {
                id: "uppercase",
                label: "Includes Uppercase Letters",
                state: isUpperCase,
                setState: setIsUpperCase,
              },
              {
                id: "lowercase",
                label: "Includes Lowercase Letters",
                state: isLowerCase,
                setState: setIsLowerCase,
              },
              {
                id: "numbers",
                label: "Includes Numbers",
                state: isNumbers,
                setState: setIsNumbers,
              },
              {
                id: "symbols",
                label: "Includes Symbols",
                state: isSymbols,
                setState: setIsSymbols,
              },
            ].map(({ id, label, state, setState }) => (
              <div key={id} className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  id={id}
                  checked={state}
                  onChange={() => {
                    setState(!state);
                    handleCheckBoxChange();
                  }}
                  className="w-5 h-5 text-cyan-400 bg-purple-700 border-purple-600 rounded focus:ring-cyan-400"
                />
                <label htmlFor={id} className="text-white text-lg">
                  {label}
                </label>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-8 mb-6">
            <p className="text-white text-lg">Strength</p>
            <div className={`w-6 h-6 rounded-full ${calcStrength()}`}></div>
          </div>

          <button
            className="w-full py-4 bg-purple-600 text-center rounded-lg border-b-4 border-yellow-300 uppercase tracking-wide text-yellow-300 font-semibold text-lg hover:bg-purple-500 transition-colors focus:outline-none"
            onClick={handleGenerate}
          >
            Generate Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;