export function firstOpen() {
  const typeSelector = document.getElementById("unitconverter-type");
  const inputField = document.getElementById("unitconverter-input");
  const resultDiv = document.getElementById("unitconverter-result");
  const convertButton = document.getElementById("unitconverter-convert");

  const converters = {
    temperature: (value) => ({
      celsius: `${value}°C = ${((value * 9) / 5 + 32).toFixed(2)}°F`,
      fahrenheit: `${value}°F = ${(((value - 32) * 5) / 9).toFixed(2)}°C`,
    }),
    length: (value) => ({
      meters: `${value}m = ${(value * 3.281).toFixed(2)}ft`,
      feet: `${value}ft = ${(value / 3.281).toFixed(2)}m`,
    }),
    weight: (value) => ({
      kilograms: `${value}kg = ${(value * 2.205).toFixed(2)}lbs`,
      pounds: `${value}lbs = ${(value / 2.205).toFixed(2)}kg`,
    }),
  };

  const handleConvert = () => {
    const type = typeSelector.value;
    const value = parseFloat(inputField.value);

    if (isNaN(value)) {
      resultDiv.textContent = "Please enter a valid number.";
      return;
    }

    const results = converters[type](value);
    resultDiv.innerHTML = Object.values(results).join("<br>");
  };

  convertButton.addEventListener("click", handleConvert);
}
