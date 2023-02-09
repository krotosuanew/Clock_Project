'use strict';

const {DataTypes} = require("sequelize");
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.addColumn('orders', 'photoLinks', {
                    type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING)

                }, {transaction: t}),
            ]);
        });
    },
    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.removeColumn('orders', 'photoLinks', {transaction: t}),
            ]);
        });
    }
};