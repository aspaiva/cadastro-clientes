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

module.exports = {
    getClients
    , addClient
};
