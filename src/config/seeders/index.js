const Role = require('../../components/roles/rolesSeeder');
const Ticket = require('../../components/tickets/ticketsSeeders');
const User = require('../../components/users/usersSeeders');

module.exports = async () => {
    try {
        await Role().then(() => console.log('Seed Role loaded')).catch(e => { throw 'Seed Role error : ' + e.message } ),
        await User().then(() => console.log('Seed User loaded')).catch(e => { throw 'Seed User error : ' + e.message } ),
        await Ticket().then(() => console.log('Seed Ticket loaded')).catch(e => { throw 'Seed Ticket error : ' + e } ),
        console.log('All seeds loaded successfully');
    } catch (e) {
        console.log(e, e.message);
    }
}