const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const users = await mongodb
            .getDatabase()
            .collection('users')
            .find()
            .toArray();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getSingle = async (req, res) => {
    //#swagger.tags=['Users']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid user id to find a user.');
    }

    try {
        const userId = new ObjectId(req.params.id);
        const user = await mongodb
            .getDatabase()
            .collection('users')
            .findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createUser = async (req, res) => {
    //#swagger.tags=['Users']
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    };

    try {
        const response = await mongodb
            .getDatabase()
            .collection('users')
            .insertOne(user);

        if (response.acknowledged) {
            res.status(201).json(response); // send back created info
        } else {
            res.status(500).json(response.error || 'Some error occurred while creating the user.');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateUser = async (req, res) => {
    //#swagger.tags=['Users']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid user id to update a user.');
    }

    const userId = new ObjectId(req.params.id);
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    };

    try {
        const response = await mongodb
            .getDatabase()
            .collection('users')
            .replaceOne({ _id: userId }, user);

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || 'Some error occurred while updating the user.');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteUser = async (req, res) => {
    //#swagger.tags=['Users']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid user id to delete a user.');
    }

    const userId = new ObjectId(req.params.id);

    try {
        const response = await mongodb
            .getDatabase()
            .collection('users')
            .deleteOne({ _id: userId });

        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || 'Some error occurred while deleting the user.');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAll, getSingle, createUser, updateUser, deleteUser };
