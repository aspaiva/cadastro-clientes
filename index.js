const readline = require('readline/promises');
const db = require('./db.js'); // Assuming db.js exports the aClients array

const { stdin: input, stdout: output, listenerCount } = require('process');
const rl = readline.createInterface({ input, output });
let exitFlag = false;


function ListClients() {
    console.clear();
    
    const aClients = db.getClients(); // Fetching clients from the db module

    if (aClients.length === 0) {
        console.log('Nenhum cliente cadastrado.');
    }
    else {
        console.log('Listando clientes...');
        console.log(aClients);
    }
}

function validateName(name) {
    if (!name || name.trim() === '') {
        return false
    }
    return true;
}

function validateAddress(address) {
    if (!address || address.trim() === '' || address.length < 5 ) return false;
    return true;
}

async function getRequiredData(variableName, validateFunction) {
    let answer = "";
    do {
        answer = await rl.question(`Informe o ${variableName}: `);
    } while (!validateFunction(answer));

    return answer.trim();
}

async function startRegistration() {
    console.clear();
    const name = await getRequiredData('nome', validateName);
    const address = await getRequiredData('endereço', validateAddress);
    
    db.addClient(name, address);
    console.log(`Cliente ${name} cadastrado com sucesso!`);
}

async function showMenu() {
    console.clear();
    console.log('Menu (async version of readline):');
    console.log('1. Listar clientes');
    console.log('2. Cadastrar cliente');
    console.log('3. reservado para futuro uso');
    console.log('0. finalizar');

    const theAnswer = await rl.question('Informe a opção: ');

    const number = parseFloat(theAnswer);

    if (isNaN(number)) {
        console.log('That is not a valid number.');
    } else {
        console.log(`You entered: ${number}`);
    }

    if (number === 0) {
        // rl.close();
        console.log('Program terminated.');
        exitFlag = true; // Set the exit flag to true
        process.exit(0); // Exit the program
    }
    else if (number === 1) {
        ListClients();
    } else if (number === 2) {
        await startRegistration();
    } else if (number === 3) {
        console.log('You selected Option 3');
    } else {
        console.log('Invalid option. Please try again.');
    }

    await rl.question('Press Enter to continue...');
    showMenu(); // Show the menu again after processing the input
    //return exitFlag; // Return the exit flag to control the loop
}

// do { 
//     exitFlag = await showMenu();
// } while (exitFlag !== true);

showMenu();


