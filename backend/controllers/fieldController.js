const Field = require('../models/Field');

exports.getAllFields = async (req, res) => {
    try {
        const [fields] = await Field.findAll();
        res.json(fields);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addField = async (req, res) => {
    try {
        await Field.create(req.body);
        res.status(201).json({ message: "Lapangan berhasil ditambahkan!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateField = async (req, res) => {
    try {
        await Field.update(req.params.id, req.body);
        res.json({ message: "Data lapangan berhasil diperbarui!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteField = async (req, res) => {
    try {
        await Field.delete(req.params.id);
        res.json({ message: "Lapangan berhasil dihapus!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};