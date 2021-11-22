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
	lastResult: 0,
};

//--------------- Functions -----------------

/**
 * Clear equation screen if it's new equation
 * @param {string} value
 * @param {boolean} force clear at all costs
 */
const clearEquationScreen = (value, force = false) => {
	// calculate using previous result
	if (EquationSigns.includes(value) && state.clearPrevEquation) {
		state.clearPrevEquation = false;
		equationScreen.innerHTML = "";
		state.equation = `${state.lastResult}`;

		updateEquationScreen(`${state.lastResult}`);
	}

	if ((state.clearPrevEquation && CalcChar.includes(value)) || force) {
		equationScreen.innerHTML = "";
		state.clearPrevEquation = false;
		// reset state equation
		state.equation = "";
	}
};

/**
 * clear result and equation from calculator header
 * @returns {undefined} undefined
 */
const clearScreen = () => {
	clearEquationScreen(null, true);
	resultScreen.querySelector(".result__content").innerText = "";
};

/**
 * handler for clear All or remove last enter buttons [AC, DEL]
 * @param {string} value
 * @returns {undefined} undefined
 */
const clearAllRemoveHandler = (value) => {
	// TODO manage DEL
	if (value.toLowerCase() === "del") {
		alert("Not implemented yet");
	}
	if (value.toLowerCase() === "ac") {
		clearScreen();
	}
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
			state.lastResult = eval(state.equation).toLocaleString();
			result.innerText = state.lastResult.toString().replace(/\./, ",");
		} catch (exception) {
			result.innerText = "0";
			alert("Equation invalid.");
		}
		// reset state equation
		state.equation = "";
	}
};

/**
 * active touch select effect on click or keyboard event
 * @param {HTMLElement} touch
 * @returns {undefined} undefined
 */
const clickTouchEffect = (touch) => {
	touch?.classList.add("active");
	const timer = window.setTimeout(() => {
		touch?.classList.remove("active");
		clearTimeout(timer);
	}, 200);
	return;
};

/**
 * Add action on calculator touch selected
 * @param {HTMLElement} touch calculator touch
 * @param {string} value touch value
 * @returns {undefined}
 */
const touchSelectHandler = (touch, value) => {
	if (ALLOW_CHAR.includes(value.toUpperCase())) {
		clickTouchEffect(touch);

		if (value === "=") {
			state.clearPrevEquation = true;
			updateResult();
			return;
		}

		clearEquationScreen(value);

		if (NotEquationSigns.includes(value)) {
			clearAllRemoveHandler(value);
			return;
		}

		state.previousEquationChar = value;

		state.equation += value;

		preventSeveralSignsInRow();

		updateEquationScreen(value === "." ? "," : value);
	} else {
		alert("Invalid button value");
	}
	return;
};

//--------------- Keyboard Handler ---------------
// TODO
document.body.addEventListener("keydown", (e) => {
	console.log(e.key);
	const keyCodes = {
		BACKSPACE: "DEL",
		ENTER: "=",
		DELETE: "AC",
	};
	const key = e.key.toUpperCase();
	const value = keyCodes.hasOwnProperty(key) ? keyCodes[key] : key;

	if (ALLOW_CHAR.includes(value)) {
		touchSelectHandler(
			document.querySelector(`[data-content="${value}"]`),
			value
		);
	}
});

//--------------- Mouse Handler ---------------
cells.forEach((cell) => {
	cell.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		const value = cell.dataset.content.trim();

		touchSelectHandler(cell, value);
	});
});
