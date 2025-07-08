import NestedChatGroup from '../models/messages.js';

export const insertNestedData = async (req, res) => {
  try {
    const data = req.body;

    if (!data.groupid) {
      return res.status(400).json({ error: 'Missing groupid' });
    }

    const doc = new NestedChatGroup(data);
    await doc.save();

    res.status(201).json({ message: 'Data inserted successfully' });
  } catch (err) {
    console.error('Insert failed:', err);
    res.status(500).json({ error: 'Failed to insert data' });
  }
};
