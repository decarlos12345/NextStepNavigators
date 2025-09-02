
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class MessagesDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const messages = await db.messages.create(
            {
                id: data.id || undefined,

        subject: data.subject
        ||
        null
            ,

        body: data.body
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return messages;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const messagesData = data.map((item, index) => ({
                id: item.id || undefined,

                subject: item.subject
            ||
            null
            ,

                body: item.body
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const messages = await db.messages.bulkCreate(messagesData, { transaction });

        return messages;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const messages = await db.messages.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.subject !== undefined) updatePayload.subject = data.subject;

        if (data.body !== undefined) updatePayload.body = data.body;

        updatePayload.updatedById = currentUser.id;

        await messages.update(updatePayload, {transaction});

        return messages;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const messages = await db.messages.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of messages) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of messages) {
                await record.destroy({transaction});
            }
        });

        return messages;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const messages = await db.messages.findByPk(id, options);

        await messages.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await messages.destroy({
            transaction
        });

        return messages;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const messages = await db.messages.findOne(
            { where },
            { transaction },
        );

        if (!messages) {
            return messages;
        }

        const output = messages.get({plain: true});

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

                if (filter.subject) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'messages',
                            'subject',
                            filter.subject,
                        ),
                    };
                }

                if (filter.body) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'messages',
                            'body',
                            filter.body,
                        ),
                    };
                }

            if (filter.active !== undefined) {
                where = {
                    ...where,
                    active: filter.active === true || filter.active === 'true'
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
            const { rows, count } = await db.messages.findAndCountAll(queryOptions);

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
                        'messages',
                        'subject',
                        query,
                    ),
                ],
            };
        }

        const records = await db.messages.findAll({
            attributes: [ 'id', 'subject' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['subject', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.subject,
        }));
    }

};

