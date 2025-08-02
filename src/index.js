var screen = document.querySelector("#screen")
var btn = document.querySelectorAll(".btn")
var historyContent = document.querySelector("#history-content")
var calculatorHistory = []

screen.value = "0"
document.addEventListener("keydown", (event) => {
  const key = event.key

  if (
    "0123456789+-*/.=()^".includes(key) ||
    key === "Enter" ||
    key === "Backspace" ||
    key === "Delete" ||
    key === "Escape"
  ) {
    event.preventDefault()
  }

  ///NumKeys
  if ("0123456789".includes(key)) {
    handleInput(key)
  }

  ///Ops
  else if (key === "+") {
    handleInput("+")
  } else if (key === "-") {
    handleInput("-")
  } else if (key === "*") {
    handleInput("×")
  } else if (key === "/") {
    handleInput("÷")
  } else if (key === ".") {
    handleInput(".")
  } else if (key === "(") {
    handleInput("(")
  } else if (key === ")") {
    handleInput(")")
  } else if (key === "^") {
    addPowerOperator()
  } else if (key === "%") {
    handlePercentage()
  }

  /// specialKeys
  else if (key === "Enter" || key === "=") {
    calculateExpression()
  } else if (key === "Backspace") {
    backspc()
  } else if (key === "Delete" || key === "Escape") {
    clearScreen()
  }

  /// hotkeys
  else if (event.ctrlKey && key === "h") {
    // Ctrl+H to clear history
    event.preventDefault()
    clearHistory()
  }
})

// Uni-input handler
function handleInput(value) {
  if (value === "×") {
    value = "*"
  }
  if (value === "÷") {
    value = "/"
  }

  if (screen.value === "0" || screen.value === "Error") {
    if (value !== ".") {
      screen.value = value
    } else {
      screen.value = "0."
    }
  } else {
    screen.value += value
  }
}

function handlePercentage() {
  if (screen.value && screen.value !== "0" && screen.value !== "Error") {
    try {
      const result = Number.parseFloat(screen.value) / 100
      screen.value = result.toString()
    } catch (error) {
      screen.value = "Error"
    }
  }
}

// Update button event listeners to use the unihandler
for (const item of btn) {
  item.addEventListener("click", (e) => {
    const btntext = e.target.innerText

    if (btntext === "POST" || btntext === "PRE") {
      return // Do nothing for now
    }

    if (btntext == "%") {
      handlePercentage()
      return
    }

    handleInput(btntext)
  })
}

function calculateExpression() {
  try {
    if (!screen.value || screen.value === "Error") {
      screen.value = "Error"
      return
    }

    const originalExpression = screen.value
    let expression = screen.value.replace(/×/g, "*").replace(/÷/g, "/")

    /// powerfunc - supports any exponent
    while (expression.includes("^")) {
      const powerMatch = expression.match(/(\d+(?:\.\d+)?)\^(\d+(?:\.\d+)?)/)
      if (powerMatch) {
        const base = Number.parseFloat(powerMatch[1])
        const exponent = Number.parseFloat(powerMatch[2])
        const result = Math.pow(base, exponent)
        expression = expression.replace(powerMatch[0], result.toString())
      } else {
        break
      }
    }

    const result = eval(expression)

    // Check if result is valid
    if (!isFinite(result)) {
      throw new Error("Invalid!")
    }

    addToHistory(originalExpression, result.toString())
    screen.value = result.toString()
  } catch (error) {
    screen.value = "Error"
    console.error("Calculation error:", error)
  }
}

function backspc() {
  if (screen.value === "Error") {
    screen.value = "0"
    return
  }

  if (screen.value.length > 1) {
    screen.value = screen.value.substr(0, screen.value.length - 1)
  } else {
    screen.value = "0"
  }
}

function clearScreen() {
  screen.value = "0"
}

function addPowerOperator() {
  if (screen.value === "0" || screen.value === "Error") {
    screen.value = "^"
  } else {
    screen.value += "^"
  }
}

//// Posi-Negative toggle btn
function toggleSign() {
  if (screen.value === "0" || screen.value === "" || screen.value === "Error") return

  /// checks the if last number is valid
  const lastNumberMatch = screen.value.match(/([-+]?\d*\.?\d+)$/)

  if (lastNumberMatch) {
    /// this smwhat ensures na once you click the sign button, only the latest input is being process...
    ///not the whole expression
    const lastNumber = lastNumberMatch[1]
    const beforeLastNumber = screen.value.slice(0, screen.value.lastIndexOf(lastNumber))

    let newNumber
    //gna check nya if the input is either positive/negative then changes its sign after
    if (lastNumber.startsWith("-")) {
      newNumber = lastNumber.slice(1)
    } else {
      newNumber = "-" + lastNumber
    }

    screen.value = beforeLastNumber + newNumber
  } else {
    /// safety net if toggle algo cnat find valid num
    if (screen.value.startsWith("-")) {
      screen.value = screen.value.slice(1)
    } else {
      screen.value = "-" + screen.value
    }
  }
}

function addToHistory(expression, result) {
  const historyItem = {
    expression: expression,
    result: result,
    timestamp: new Date(),
  }

  calculatorHistory.unshift(historyItem)
  if (calculatorHistory.length > 10) {
    calculatorHistory = calculatorHistory.slice(0, 10)
  }

  updateHistoryDisplay()
}

function updateHistoryDisplay() {
  if (calculatorHistory.length === 0) {
    historyContent.innerHTML = `
            <div class="no-history">
                <p>No calculations yet</p>
                <p class="sub-text">Your calculation history will appear here</p>
            </div>
        `
    return
  }

  let historyHTML = ""
  calculatorHistory.forEach((item, index) => {
    historyHTML += `
            <div class="history-item" onclick="useHistoryResult('${item.result}')">
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">= ${item.result}</div>
            </div>
        `
  })

  historyContent.innerHTML = historyHTML
}

function useHistoryResult(result) {
  screen.value = result
}

function clearHistory() {
  calculatorHistory = []
  updateHistoryDisplay()
}

updateHistoryDisplay()

/// history **
/// Main algo -notation func
