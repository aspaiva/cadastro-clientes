const fs = require('fs');
let aClients = [];

function getClients() {
    const fileData = fs.readFileSync('clients.json', 'utf8');
    if (fileData) {
        try {
            aClients = JSON.parse(fileData);
        } catch (error) {
            console.error('Error parsing clients data:', error);
            aClients = [];
        }
    } else {
        aClients = [];
    }

    return aClients;
}   

function addClient(name, address) {
    if (!name || !address) {
        throw new Error('Name and address are required to add a client.');
    }   

    let idClient = aClients.length > 0 ? aClients[aClients.length - 1].id : 0;
    
    if (aClients.some(client => client.name === name)) {
        throw new Error('Client with this name already exists.');
    }

    aClients.push({
        id: ++idClient,
        name: name,
        address: address
    });

    fs.writeFileSync('clients.json', JSON.stringify(aClients, null, 2), 'utf8');

    return aClients[aClients.length - 1];
}

function getClientById(id) {
    return aClients.find(client => client.id === id);
}

function updateClient(id, newData) {
    const clientIndex = aClients.findIndex(client => client.id === id);
    if (clientIndex === -1) {
        throw new Error('Client not found.');
    }

    if (newData.name) {
        aClients[clientIndex].name = newData.name;
    }
    if (newData.address) {
        aClients[clientIndex].address = newData.address;
    }

    fs.writeFileSync('clients.json', JSON.stringify(aClients, null, 2), 'utf8');
    return aClients[clientIndex];
}

function deleteClient(id) {
    const clientIndex = aClients.findIndex(client => client.id === id);
    if (clientIndex === -1) {
        throw new Error('Client not found.');
    }

    aClients.splice(clientIndex, 1);
    fs.writeFileSync('clients.json', JSON.stringify(aClients, null, 2), 'utf8');
    return true;
}

module.exports = {
    getClients
    , addClient
    , getClientById
    , updateClient
    , deleteClient
};
