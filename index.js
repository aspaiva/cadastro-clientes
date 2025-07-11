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

async function updateClient() {
    console.clear();
    const aClients = db.getClients(); // Fetching clients from the db module
    if (aClients.length === 0) {
        console.log('Nenhum cliente cadastrado para atualizar.');
        return;
    }

    const id = parseInt(await rl.question('Informe o ID do cliente a ser atualizado: '), 10);
    const client = db.getClientById(id);
    if (!client) {
        console.log(`Cliente com ID ${id} não encontrado.`);
        return;
    }

    console.log(`Atualizando cliente: ${client.name}`);
    const newName = await rl.question(`Informe o novo nome (atual: ${client.name}): `) || client.name;
    const newAddress = await rl.question(`Informe o novo endereço (atual: ${client.address}): `) || client.address;   
    db.updateClient(id, { name: newName, address: newAddress });
    console.log(`Cliente ${id} atualizado com sucesso!`);
}

async function deleteClient() {
    console.clear();
    const id = parseInt(await rl.question('Informe o ID do cliente a ser excluído: '), 10);
    const client = db.getClientById(id);
    if (!client) {
        console.log(`Cliente com ID ${id} não encontrado.`);
        return;
    }

    const confirmation = await rl.question(`Tem certeza que deseja excluir o cliente ${client.name}? (s/n): `);
    if (confirmation.toLowerCase() === 's') {
        if (db.deleteClient(id)) {
            console.log(`Cliente ${client.name} excluído com sucesso!`);
        }
        else {
            console.log(`Erro ao excluir o cliente ${client.name}.`);
        }
    }
}

async function searchClient() {
    console.clear();
    const textSearch = await rl.question('Informe o nome do cliente a ser pesquisado: ');
    
    const aClients = db.getClients(); // Fetching clients from the db module
    const foundClients = aClients.filter(client => client.name.toLowerCase().includes(textSearch.toLowerCase()));
    if (foundClients.length === 0) {
        console.log(`Nenhum cliente encontrado com o nome "${textSearch}".`);
    } else {
        console.log('Nomes encontrados:');
        foundClients.forEach(client => {
            console.log(`ID: ${client.id}, Nome: ${client.name}, Endereço: ${client.address}`);
        });
    }
    console.log('\nPesquisando por endereços...');

    const foundAddress = aClients.filter(client => client.address.toLowerCase().includes(textSearch.toLowerCase()));
    if (foundAddress.length === 0) {
        console.log(`Nenhum endereço encontrado com o texto "${textSearch}".`);
    } else {
        console.log('Endereços encontrados:');
        foundAddress.forEach(client => {
            console.log(`ID: ${client.id}, Nome: ${client.name}, Endereço: ${client.address}`);
        });
    }
    console.log('\nPesquisa concluída.');
}

async function showMenu() {
    console.clear();
    console.log('Menu (async version of readline):');
    console.log('1. Listar clientes');
    console.log('2. Cadastrar cliente');
    console.log('3. Atualizar cliente');
    console.log('4. Excluir cliente');
    console.log('5. Pesquisar cliente');
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
        await updateClient();
    } else if (number === 4) {
        await deleteClient();
    } else if (number === 5) {
        await searchClient();
    }
    else {
        console.log('Invalid option. Please try again.');
    }

    await rl.question('Press Enter to continue...');
    showMenu(); // Show the menu again after processing the input
    //return exitFlag; // Return the exit flag to control the loop
}

async function login() {
    const password = '1234';
    const tries = 3; // Number of attempts allowed
    let attempts = 0;   

    while (attempts < tries) {
        const inputPassword = await rl.question('Enter password: ');
        if (inputPassword === password) {
            console.log('Login successful!');
            showMenu();
        } else {
            console.log(`Incorrect password. You have ${tries - attempts - 1} attempts left.`);
        }   
        attempts++;
        if (attempts >= tries) {
            console.log('Too many failed attempts. Exiting...');
            process.exit(1); // Exit the program after too many failed attempts
        }   
    }

}   

login();