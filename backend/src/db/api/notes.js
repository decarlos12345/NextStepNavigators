
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class NotesDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const notes = await db.notes.create(
            {
                id: data.id || undefined,

        title: data.title
        ||
        null
            ,

        content: data.content
        ||
        null
            ,

        is_public: data.is_public
        ||
        false

            ,

        reminder: data.reminder
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return notes;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const notesData = data.map((item, index) => ({
                id: item.id || undefined,

                title: item.title
            ||
            null
            ,

                content: item.content
            ||
            null
            ,

                is_public: item.is_public
            ||
            false

            ,

                reminder: item.reminder
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const notes = await db.notes.bulkCreate(notesData, { transaction });

        return notes;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const notes = await db.notes.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.title !== undefined) updatePayload.title = data.title;

        if (data.content !== undefined) updatePayload.content = data.content;

        if (data.is_public !== undefined) updatePayload.is_public = data.is_public;

        if (data.reminder !== undefined) updatePayload.reminder = data.reminder;

        updatePayload.updatedById = currentUser.id;

        await notes.update(updatePayload, {transaction});

        return notes;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const notes = await db.notes.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of notes) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of notes) {
                await record.destroy({transaction});
            }
        });

        return notes;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const notes = await db.notes.findByPk(id, options);

        await notes.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await notes.destroy({
            transaction
        });

        return notes;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const notes = await db.notes.findOne(
            { where },
            { transaction },
        );

        if (!notes) {
            return notes;
        }

        const output = notes.get({plain: true});

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

                if (filter.title) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'notes',
                            'title',
                            filter.title,
                        ),
                    };
                }

                if (filter.content) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'notes',
                            'content',
                            filter.content,
                        ),
                    };
                }

            if (filter.reminderRange) {
                const [start, end] = filter.reminderRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    reminder: {
                    ...where.reminder,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    reminder: {
                    ...where.reminder,
                            [Op.lte]: end,
                    },
                };
                }
            }

            if (filter.active !== undefined) {
                where = {
                    ...where,
                    active: filter.active === true || filter.active === 'true'
                };
            }

            if (filter.is_public) {
                where = {
                    ...where,
                is_public: filter.is_public,
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
            const { rows, count } = await db.notes.findAndCountAll(queryOptions);

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
                        'notes',
                        'title',
                        query,
                    ),
                ],
            };
        }

        const records = await db.notes.findAll({
            attributes: [ 'id', 'title' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['title', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.title,
        }));
    }

};

