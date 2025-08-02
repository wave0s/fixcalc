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
    /// Main algo -notation func