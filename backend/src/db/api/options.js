
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class OptionsDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const options = await db.options.create(
            {
                id: data.id || undefined,

        text: data.text
        ||
        null
            ,

        is_correct: data.is_correct
        ||
        false

            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return options;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const optionsData = data.map((item, index) => ({
                id: item.id || undefined,

                text: item.text
            ||
            null
            ,

                is_correct: item.is_correct
            ||
            false

            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const options = await db.options.bulkCreate(optionsData, { transaction });

        return options;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const options = await db.options.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.text !== undefined) updatePayload.text = data.text;

        if (data.is_correct !== undefined) updatePayload.is_correct = data.is_correct;

        updatePayload.updatedById = currentUser.id;

        await options.update(updatePayload, {transaction});

        return options;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const options = await db.options.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of options) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of options) {
                await record.destroy({transaction});
            }
        });

        return options;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const options = await db.options.findByPk(id, options);

        await options.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await options.destroy({
            transaction
        });

        return options;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const options = await db.options.findOne(
            { where },
            { transaction },
        );

        if (!options) {
            return options;
        }

        const output = options.get({plain: true});

        return output;
    }

    static async findAll(filter, options) {
        const limit = filter.limit || 0;
        let offset = 0;
        let where = {};
        const currentPage = +filter.page;

        const user = (options && options.currentUser) || null;

        offset = currentPage * limit;

        const orderBy = null;

        const transaction = (options && options.transaction) || undefined;

        let include = [];

        if (filter) {
            if (filter.id) {
                where = {
                    ...where,
                    ['id']: Utils.uuid(filter.id),
                };
            }

                if (filter.text) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'options',
                            'text',
                            filter.text,
                        ),
                    };
                }

            if (filter.active !== undefined) {
                where = {
                    ...where,
                    active: filter.active === true || filter.active === 'true'
                };
            }

            if (filter.is_correct) {
                where = {
                    ...where,
                is_correct: filter.is_correct,
            };
            }

            if (filter.createdAtRange) {
                const [start, end] = filter.createdAtRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.gte]: start,
                        },
                    };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.lte]: end,
                        },
                    };
                }
            }
        }

        const queryOptions = {
            where,
            include,
            distinct: true,
            order: filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction: options?.transaction,
            logging: console.log
        };

        if (!options?.countOnly) {
            queryOptions.limit = limit ? Number(limit) : undefined;
            queryOptions.offset = offset ? Number(offset) : undefined;
        }

        try {
            const { rows, count } = await db.options.findAndCountAll(queryOptions);

            return {
                rows: options?.countOnly ? [] : rows,
                count: count
            };
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }

    static async findAllAutocomplete(query, limit, offset) {
        let where = {};

        if (query) {
            where = {
                [Op.or]: [
                    { ['id']: Utils.uuid(query) },
                    Utils.ilike(
                        'options',
                        'text',
                        query,
                    ),
                ],
            };
        }

        const records = await db.options.findAll({
            attributes: [ 'id', 'text' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['text', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.text,
        }));
    }

};

