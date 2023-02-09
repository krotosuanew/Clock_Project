'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.addColumn('users', 'facebookId', {
                    type: Sequelize.DataTypes.BIGINT
                }, {transaction: t}),
            ]);
        });
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.removeColumn('users', 'facebookId', {transaction: t}),
            ]);
        });
    }
};
