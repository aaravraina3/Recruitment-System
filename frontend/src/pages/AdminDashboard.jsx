import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { authAPI } from '../services/api';

function AdminDashboard() {
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [activeTab, setActiveTab] = useState('roster');
    const [loading, setLoading] = useState(false);
    
    // Data States
    const [roster, setRoster] = useState([]);
    const [questions, setQuestions] = useState({});
    const [jsonInput, setJsonInput] = useState('');
    const [resetConfirm, setResetConfirm] = useState('');

    // Roster Form
    const [newMember, setNewMember] = useState({ name: '', email: '', branch: '', role: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            const [rosterRes, questionsRes] = await Promise.all([
                fetch('/api/admin/roster', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
                fetch('/api/admin/questions', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
            ]);
            
            if (Array.isArray(rosterRes)) setRoster(rosterRes);
            setQuestions(questionsRes);
            setJsonInput(JSON.stringify(questionsRes, null, 2));
        } catch (e) {
            console.error(e);
            alert("Failed to load admin data. Are you an executive?");
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = () => {
        if (!newMember.name || !newMember.email) return alert("Name and Email required");
        const updatedRoster = [...roster, { ...newMember, level: 'Member' }]; // Default level
        setRoster(updatedRoster);
        saveRoster(updatedRoster);
        setNewMember({ name: '', email: '', branch: '', role: '' });
    };

    const handleDeleteMember = (email) => {
        if (!window.confirm("Remove this member?")) return;
        const updatedRoster = roster.filter(m => m.email !== email);
        setRoster(updatedRoster);
        saveRoster(updatedRoster);
    };

    const saveRoster = async (data) => {
        const token = await getToken();
        await fetch('/api/admin/roster', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(data)
        });
    };

    const handleSaveQuestions = async () => {
        try {
            const parsed = JSON.parse(jsonInput);
            const token = await getToken();
            await fetch('/api/admin/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: jsonInput
            });
            alert("Questions structure updated!");
        } catch (e) {
            alert("Invalid JSON: " + e.message);
        }
    };

    const handleSeasonalReset = async () => {
        if (resetConfirm !== "I CONFIRM SEASONAL RESET") return alert("Please type the confirmation phrase exactly.");
        
        const token = await getToken();
        const res = await fetch('/api/admin/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ confirm: resetConfirm })
        });
        
        const data = await res.json();
        alert(data.message);
        setResetConfirm('');
    };

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <h1>EXECUTIVE ADMIN PANEL</h1>
                <button onClick={() => navigate('/dashboard')}>Exit</button>
            </header>

            <div className="admin-tabs">
                <button className={activeTab === 'roster' ? 'active' : ''} onClick={() => setActiveTab('roster')}>Roster & Hiring</button>
                <button className={activeTab === 'questions' ? 'active' : ''} onClick={() => setActiveTab('questions')}>Form Builder</button>
                <button className={activeTab === 'reset' ? 'active' : ''} onClick={() => setActiveTab('reset')}>Seasonal Reset</button>
            </div>

            <div className="admin-content">
                {loading && <p>Loading...</p>}

                {activeTab === 'roster' && (
                    <div className="roster-manager">
                        <h3>Manual Hiring / Roster Management</h3>
                        <div className="add-member-form">
                            <input placeholder="Name" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} />
                            <input placeholder="Email" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} />
                            <select value={newMember.branch} onChange={e => setNewMember({...newMember, branch: e.target.value})}>
                                <option value="">Branch...</option>
                                <option value="Software">Software</option>
                                <option value="Hardware">Hardware</option>
                                <option value="Data">Data</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Finance">Finance</option>
                                <option value="Community">Community</option>
                                <option value="Executive">Executive</option>
                            </select>
                            <input placeholder="Role Title" value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})} />
                            <button onClick={handleAddMember}>+ Add Member</button>
                        </div>
                        <div className="roster-list">
                            <table>
                                <thead><tr><th>Name</th><th>Email</th><th>Branch</th><th>Role</th><th>Action</th></tr></thead>
                                <tbody>
                                    {roster.map((m, i) => (
                                        <tr key={i}>
                                            <td>{m.name}</td>
                                            <td>{m.email}</td>
                                            <td>{m.branch}</td>
                                            <td>{m.role}</td>
                                            <td><button onClick={() => handleDeleteMember(m.email)} style={{color: 'red'}}>Remove</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'questions' && (
                    <div className="form-builder">
                        <h3>Application Question Configuration</h3>
                        <p>Edit the JSON structure directly to update questions for all branches immediately.</p>
                        <textarea 
                            value={jsonInput} 
                            onChange={e => setJsonInput(e.target.value)} 
                            className="json-editor"
                        />
                        <button onClick={handleSaveQuestions} className="btn-save">Save Configuration</button>
                    </div>
                )}

                {activeTab === 'reset' && (
                    <div className="seasonal-reset">
                        <h3>⚠️ DANGER ZONE: Seasonal Reset</h3>
                        <p>This will <strong>permanently delete</strong> all submitted applications and decisions to prepare for a new semester. The roster will remain.</p>
                        
                        <div className="danger-box">
                            <label>Type "I CONFIRM SEASONAL RESET" to proceed:</label>
                            <input value={resetConfirm} onChange={e => setResetConfirm(e.target.value)} />
                            <button onClick={handleSeasonalReset} className="btn-danger">WIPE DATABASE</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;

