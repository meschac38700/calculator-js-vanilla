//--------------- HTMLElements ---------------
const cells = document.querySelectorAll(".cell");
const equationScreen = document.querySelector(
	".calculate__head__content .equation"
);
const resultScreen = document.querySelector(
	".calculate__head__content .result"
);

//--------------- Constants ---------------
const NotEquationSigns = ["AC", "DEL", "="];
const EquationSigns = ["+", "/", "*", "-"];
const CalcChar = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
const ALLOW_CHAR = [...NotEquationSigns, ...EquationSigns, ...CalcChar];

//--------------- STATE ---------------
const state = {
	clearPrevEquation: false,
	previousEquationChar: "",
	equation: "",
};

//--------------- Functions -----------------

/**
 * Clear equation screen if it's new equation
 * @param {string} value
 * @param {boolean} force clear at all costs
 */
const clearEquationScreen = (value, force = false) => {
	if ((state.clearPrevEquation && CalcChar.includes(value)) || force) {
		equationScreen.innerHTML = "";
		state.clearPrevEquation = false;
		// reset state equation
		state.equation = "";
	}
};

const clearScreen = () => {
	clearEquationScreen(null, true);
	resultScreen.querySelector(".result__content").innerText = "";
};

/**
 * Prevent several signs in a row
 * by replace the last one with the current sign
 * @returns {undefined} undefined
 */
const preventSeveralSignsInRow = () => {
	if (EquationSigns.includes(state.previousEquationChar)) {
		equationScreen.querySelector(".operator:last-child")?.remove();
	}
};

/**
 * Update calculator displayed equation
 * @param {String} value current value
 * @returns {undefined} undefined
 */
const updateEquationScreen = (value) => {
	const span = document.createElement("SPAN");
	span.innerText = value === "*" ? "X" : value;
	if (EquationSigns.includes(value)) {
		span.setAttribute("class", "operator");
	}
	equationScreen.appendChild(span);
};

/**
 * Update calculator displayed result
 * @returns {undefined} undefined
 */
const updateResult = () => {
	console.log("Equation =", state.equation);
	if (state.equation !== "") {
		const result = resultScreen.querySelector(".result__content");
		try {
			result.innerText = eval(state.equation).toString().replace(/\./, ",");
		} catch (exception) {
			result.innerText = "0";
			alert("Equation invalid.");
		}
		// reset state equation
		state.equation = "";
	}
};

//--------------- Keyboard Handler ---------------
// TODO

//--------------- Mouse Handler ---------------
cells.forEach((cell) => {
	cell.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		const value = cell.dataset.content.trim();

		if (ALLOW_CHAR.includes(value.toUpperCase())) {
			if (value === "=") {
				state.clearPrevEquation = true;
				updateResult();
				return;
			}

			clearEquationScreen(value);

			if (![...CalcChar, ...EquationSigns].includes(value)) {
				// is not calculable char
				// TODO manage AC
				if (value.toLowerCase() === "del") {
					clearScreen();
				}
				console.log("==>", value);
				return;
			}

			state.previousEquationChar = value;

			state.equation += value;

			preventSeveralSignsInRow();

			updateEquationScreen(value === "." ? "," : value);
		} else {
			alert("Invalid button value");
		}
	});
});
