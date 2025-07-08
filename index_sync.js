const readline = require('readline');
const {stdin: input, stdout: output} = require('process');

const rl = readline.createInterface({input, output});

function showMenu() {
    console.clear();
    console.log('Menu:');
    console.log('1. Option 1');
    console.log('2. Option 2');
    console.log('3. Option 3');
    console.log('0. finalizar');

    rl.question('Informe a opção: ', (answer) => {
        const number = parseFloat(answer);
        
        if (isNaN(number)) {
            console.log('That is not a valid number.');
        } else {
            console.log(`You entered: ${number}`);
        }

        if (number === 0) {
            rl.close();
            console.log('Program terminated.');
            process.exit(0); // Exit the program
        }
        else if (number === 1) {
            console.log('You selected Option 1');
        } else if (number === 2) {
            console.log('You selected Option 2');
        } else if (number === 3) {
            console.log('You selected Option 3');
        } else {
            console.log('Invalid option. Please try again.');
        }

        setTimeout(() => {
            showMenu();
        }, timeout = 2000);
        
    });
}

showMenu();


