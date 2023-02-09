'use strict';

const bcrypt = require("bcrypt");
const {ROLES} = require("../dist/dto/global");
module.exports = {
    async up(queryInterface, Sequelize) {
        return await queryInterface.bulkInsert('users', [{
            email: process.env.ADMIN_EMAIL,
            password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 5),
            isActivated: true,
            role: ROLES.ADMIN
        }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        return await queryInterface.bulkDelete('users', null, {});
    }
};
