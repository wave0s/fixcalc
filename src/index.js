var screen = document.querySelector('#screen');
    var btn = document.querySelectorAll('.btn');

    for (item of btn) {
        item.addEventListener('click', (e) => {
            btntext = e.target.innerText;

            if (btntext == '×') {
                btntext = '*';
            }

            if (btntext == '÷') {
                btntext = '/';
            }
            screen.value += btntext;
        });
    }
     function backspc() {
        screen.value = screen.value.substr(0, screen.value.length - 1);
    }

    function pow() {
        screen.value = Math.pow(screen.value, 2);
    }
    //// Pos-Negative toggle btn 
    function toggleSign() {
    if (screen.value === '0' || screen.value === '') return;

    /// checks the if last number is valid 
    const lastNumberMatch = screen.value.match(/([-+]?\d*\.?\d+)$/);

    if (lastNumberMatch) {
        /// this smwhat ensures na once you click the sign button 
        const lastNumber = lastNumberMatch[1];
        const beforeLastNumber = screen.value.slice(0, screen.value.lastIndexOf(lastNumber));

        let newNumber;
        //gna check nya if the input is either positive/negative then changes its sign after 
        if (lastNumber.startsWith('-')) {
            newNumber = lastNumber.slice(1);
        } else {
            newNumber = '-' + lastNumber;
        }

        screen.value = beforeLastNumber + newNumber;
    } else {
        /// safety net if toggle algo cnat find valid num
        if (screen.value.startsWith('-')) {
            screen.value = screen.value.slice(1);
        } else {
            screen.value = '-' + screen.value;
        }
    }
}
/// history **
/// Main algo -notation func