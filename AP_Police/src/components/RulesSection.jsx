import React, { useState } from 'react';
import { Trash2, Edit, Plus, Eye } from 'lucide-react';

// Priority options
const priorities = ['High', 'Medium', 'Low'];

const defaultTemplates = [
  'Only show risk items',
  'Bullet action points only',
  'Include full conversational context',
  'Summarize by sender role',
];

const RulesSection = () => {
  const [rules, setRules] = useState([
    { id: 1, text: 'Only show risk items', priority: 'High' },
    { id: 2, text: 'Bullet action points only', priority: 'Medium' },
  ]);
  const [newRule, setNewRule] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState('');

const handleAddOrUpdate = async () => {
  if (!newRule.trim()) return;

  const ruleObj = { id: Date.now(), text: newRule, priority };

  if (editId) {
    setRules(rules.map(rule =>
      rule.id === editId ? { ...rule, text: newRule, priority } : rule
    ));
    setEditId(null);
  } else {
    setRules([...rules, ruleObj]);

    // 🔁 Send rule to backend
    const mem_id = localStorage.getItem('memberId');
    try {
      const response = await fetch('http://localhost:5000/api/addPreference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mem_id, rule: `${newRule} (Priority: ${priority})` }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      console.log('✅ Rule added to DB:', data);
    } catch (err) {
      console.error('❌ Failed to store rule in DB:', err.message);
    }
  }

  setNewRule('');
  setPriority('Medium');
};

  const handleEdit = (id) => {
    const rule = rules.find(r => r.id === id);
    setNewRule(rule.text);
    setPriority(rule.priority);
    setEditId(id);
  };

  const handleDelete = (id) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const handleTemplateInsert = (template) => {
    setNewRule(template);
  };

  const handlePreview = () => {
    setPreview(`🔍 AI will now summarize chats as per rule: "${newRule}" with [${priority}] priority.`);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto h-full overflow-auto">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-blue-800">Summarization Rule Engine</h2>
        <p className="text-blue-600">Set your personal chat summarization preferences</p>
      </div>

      {/* Rule Input Area */}
      <div className="bg-white border border-blue-200 rounded-xl p-6 shadow space-y-4">
        <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Define a New Rule
        </h3>
        <textarea
          className="w-full rounded-md border border-blue-300 p-2 text-sm focus:ring-2 focus:ring-blue-600"
          rows={3}
          placeholder="e.g., Only summarize tasks marked urgent"
          value={newRule}
          onChange={(e) => setNewRule(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="text-sm text-blue-700 font-medium">Priority:</label>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              {priorities.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-blue-800 text-white px-4 py-1 rounded hover:bg-blue-900"
              onClick={handleAddOrUpdate}
            >
              {editId ? 'Update Rule' : 'Add Rule'}
            </button>
            <button
              className="border border-blue-200 text-blue-800 px-4 py-1 rounded hover:bg-blue-100"
              onClick={handlePreview}
            >
              <Eye className="h-4 w-4 inline mr-1" /> Preview
            </button>
          </div>
        </div>

        {preview && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4 text-sm text-blue-800 rounded">
            {preview}
          </div>
        )}
      </div>

      {/* Template Library */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
        <h4 className="font-medium text-blue-800 mb-2">Templates</h4>
        <div className="flex flex-wrap gap-2">
          {defaultTemplates.map((tpl, index) => (
            <button
              key={index}
              onClick={() => handleTemplateInsert(tpl)}
              className="text-sm px-3 py-1 bg-white border border-blue-200 rounded hover:bg-blue-100"
            >
              {tpl}
            </button>
          ))}
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-blue-800">Your Rules</h3>
        {rules.length === 0 ? (
          <p className="text-sm text-blue-600">No rules defined yet.</p>
        ) : (
          rules.map(rule => (
            <div key={rule.id} className="flex justify-between items-center bg-blue-100 p-3 rounded-lg">
              <div>
                <div className="text-sm font-medium text-blue-900">{rule.text}</div>
                <div className="text-xs text-blue-700">Priority: {rule.priority}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(rule.id)} title="Edit">
                  <Edit className="w-4 h-4 text-blue-800" />
                </button>
                <button onClick={() => handleDelete(rule.id)} title="Delete">
                  <Trash2 className="w-4 h-4 text-blue-800" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RulesSection;
