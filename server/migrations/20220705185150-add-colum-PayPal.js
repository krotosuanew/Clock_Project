'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.addColumn('orders', 'payPalId', {
                    type: Sequelize.DataTypes.STRING
                }, {transaction: t}),
            ]);
        });
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.removeColumn('orders', 'payPalId', {transaction: t}),
            ]);
        });
    }
};
