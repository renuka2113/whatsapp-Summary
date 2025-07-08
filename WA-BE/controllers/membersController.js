import Member from '../models/Member.js';
import fs from 'fs';

export const uploadMember = async (req, res) => {
  try {
    const data = req.body;
    console.log(data)
    // const data = JSON.parse(fs.readFileSync(req.file.path));
    await Member.insertMany(data);
    // fs.unlinkSync(req.file.path);
    res.send({ message: '✅ Member data uploaded' });
  } catch (err) {
    res.status(500).send({ error: 'Failed to upload member data', details: err.message });
  }
};

export const getMember = async (req, res) => {
  try {
    const data = req.body;
    const members = await Member.find(); // you can use filters from req.body if needed
    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve members', details: err.message });
  }
};


export const loginByName = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const officer = await Member.findOne({ Officer_Name: new RegExp(`^${name}$`, 'i') });

    if (!officer) {
      return res.status(404).json({ error: 'Officer not found' });
    }

    res.status(200).json({ message: 'Login successful', officer });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};


export const addPreference = async (req, res) => {
  try {
    const { mem_id, rule } = req.body;
    if (!mem_id || !rule) {
      return res.status(400).json({ error: 'Missing mem_id or rule' });
    }

    const updated = await Member.findOneAndUpdate(
      { mem_id },
      { $addToSet: { Preferences: rule } }, // prevents duplicate rules
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.status(200).json({ message: 'Rule added successfully', member: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add rule', details: err.message });
  }
};
