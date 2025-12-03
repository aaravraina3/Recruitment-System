import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser, useAuth, useClerk } from '@clerk/clerk-react';
import { reviewAPI, applicationAPI } from '../services/api';
import Modal from '../components/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import './ReviewDashboard.css';

function ReviewDashboard() {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();
  const { signOut } = useClerk();

  const [queue, setQueue] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [roleQuestions, setRoleQuestions] = useState([]);
  const [interviewMode, setInterviewMode] = useState(false);
  
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [branchNotes, setBranchNotes] = useState({});

  useEffect(() => {
    fetchQueue();
  }, [branchId, user]);

  useEffect(() => {
      if (selectedApp) {
          applicationAPI.getQuestions(selectedApp.branch, selectedApp.role, getToken)
            .then(qs => setRoleQuestions(qs))
            .catch(err => console.error(err));
      } else {
          setRoleQuestions([]);
      }
  }, [selectedApp, getToken]);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const data = await reviewAPI.getQueue(branchId || 'software', getToken);
      setQueue(data);
    } catch (error) {
      console.error("Failed to fetch queue", error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchBranchNotes = async () => {
      try {
          const data = await reviewAPI.getBranchNotes(branchId || 'software', getToken);
          setBranchNotes(data);
          setShowNotesModal(true);
      } catch(e) {
          alert("Error fetching notes report");
      }
  };

  const handleSelectApp = async (app) => {
    try {
      await reviewAPI.claim(app._id, getToken);
      setSelectedApp(app);
      setNotes('');
    } catch (error) {
      alert("Could not claim application: " + error.message);
      fetchQueue(); 
    }
  };

  const handleSaveNote = async () => {
      if(!notes.trim()) return;
      try {
          const result = await reviewAPI.addNote(selectedApp._id, notes, getToken);
          alert("Note added to shared document!");
          setNotes('');
          
          // Update local state to show new note immediately
          setSelectedApp(prev => ({
              ...prev,
              notes: [...(prev.notes || []), result.entry]
          }));
      } catch(e) { alert("Error saving note: " + e.message); }
  };

  const handleDecision = async (decision) => {
    if (!window.confirm(`Mark as ${decision.toUpperCase()}?`)) return;

    try {
      await reviewAPI.submitDecision(selectedApp._id, {
        decision: decision,
        notes: notes
      }, getToken);
      
      alert("Decision recorded!");
      setSelectedApp(null);
      setNotes('');
      fetchQueue();
      setInterviewMode(false);
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className={`review-dashboard ${interviewMode ? 'interview-mode' : ''}`}>
      {!interviewMode && (
          <header className="review-header">
            <div className="header-left">
                <h1>Review Dashboard: <span style={{textTransform: 'capitalize'}}>{branchId || 'Software'}</span></h1>
            </div>
            <div className="header-right">
              <button onClick={fetchBranchNotes} className="btn-secondary" style={{marginRight: '1rem'}}>📂 Branch Notes Hub</button>
              <button onClick={() => navigate('/dashboard')} style={{marginRight: '1rem'}}>Exit to Dashboard</button>
              <button onClick={() => signOut(() => navigate('/sign-in'))}>Sign Out</button>
            </div>
          </header>
      )}

      <div className="review-grid" style={interviewMode ? {gridTemplateColumns: '1fr'} : {}}>
        {!interviewMode && (
            <div className="queue-list">
              <h3>Review Queue ({queue.length})</h3>
              {loading ? <p>Loading...</p> : (
                queue.length === 0 ? <p className="empty-state">No pending applications!</p> :
                queue.map((app, index) => (
                  <motion.div 
                    key={app._id} 
                    className={`queue-item ${selectedApp?._id === app._id ? 'active' : ''}`}
                    onClick={() => handleSelectApp(app)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, backgroundColor: "#f0f7ff" }}
                  >
                    <h4>{app.role}</h4>
                    <div className="meta">
                      <span>{app.email}</span>
                      <span>{new Date(app.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
        )}

        <div className="review-panel">
          <AnimatePresence mode='wait'>
          {selectedApp ? (
            <motion.div 
                key={selectedApp._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
            >
              <div className="app-details">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h2>Application: {selectedApp.role}</h2>
                    <button 
                        onClick={() => setInterviewMode(!interviewMode)}
                        style={{background: '#333', color: 'white', padding: '5px 10px', borderRadius: '4px'}}
                    >
                        {interviewMode ? 'Exit Interview Mode' : 'Start Interview Mode'}
                    </button>
                </div>
                
                <div className="detail-section">
                  <h3>Candidate Info</h3>
                  <div className="detail-content">
                    <p><strong>Name:</strong> {selectedApp.formData.firstName} {selectedApp.formData.lastName}</p>
                    <p><strong>Email:</strong> {selectedApp.email}</p>
                    <p><strong>Major:</strong> {selectedApp.formData.major} ({selectedApp.formData.year})</p>
                    {selectedApp.formData.presentationLink && (
                         <p><strong>Presentation:</strong> <a href={selectedApp.formData.presentationLink} target="_blank" rel="noreferrer">Link</a></p>
                    )}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Why Generate?</h3>
                  <div className="detail-content">
                    {selectedApp.formData.whyGenerate}
                  </div>
                </div>
                
                {selectedApp.formData.vision && (
                    <div className="detail-section">
                    <h3>Vision / Changes</h3>
                    <div className="detail-content">
                        {selectedApp.formData.vision}
                        <hr/>
                        {selectedApp.formData.changes}
                    </div>
                    </div>
                )}

                {roleQuestions.length > 0 && (
                    <div className="detail-section">
                        <h3 style={{borderBottom: '1px solid #ddd', paddingBottom: '5px'}}>Role Specific Questions</h3>
                        {roleQuestions.map(q => (
                            <div key={q.id} style={{marginTop: '15px'}}>
                                <h4 style={{fontSize: '0.9rem', color: '#555', marginBottom: '5px'}}>{q.label}</h4>
                                <div className="detail-content">
                                    {q.type === 'checkbox' 
                                        ? (selectedApp.formData.answers?.[q.id] ? 'Yes' : 'No') 
                                        : (selectedApp.formData.answers?.[q.id] || '-')}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedApp.formData.resume && (
                   <div className="detail-section">
                     <h3>Resume</h3>
                     <p>Resume file attached (Download not implemented)</p>
                   </div>
                )}
                
                {/* Shared Notes Section */}
                <div className="detail-section">
                    <h3>Shared Notes</h3>
                    {selectedApp.notes && selectedApp.notes.length > 0 ? (
                        <div className="notes-list">
                            {selectedApp.notes.map((n, i) => (
                                <div key={i} className="note-item" style={{background: '#fff', padding: '10px', marginBottom: '10px', borderLeft: '3px solid #333'}}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666'}}>
                                        <strong>{n.author}</strong>
                                        <span>{new Date(n.timestamp).toLocaleString()}</span>
                                    </div>
                                    <p style={{marginTop: '5px'}}>{n.content}</p>
                                </div>
                            ))}
                        </div>
                    ) : <p style={{fontStyle: 'italic', color: '#888'}}>No notes yet.</p>}
                </div>

                <div className="detail-section">
                  <h3>Add Note / Score</h3>
                  <textarea 
                    rows="4" 
                    style={{width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px'}}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Type interview notes, scores, or feedback here..."
                  />
                  <button onClick={handleSaveNote} style={{padding: '5px 10px', cursor: 'pointer'}}>Save Note Only</button>
                </div>
              </div>

              <div className="action-bar">
                <button className="btn-decision btn-reject" onClick={() => handleDecision('rejected')}>Reject</button>
                <button className="btn-decision btn-interview" onClick={() => handleDecision('interview')}>Interview (Round 2)</button>
                <button className="btn-decision btn-accept" onClick={() => handleDecision('accepted')}>Accept</button>
              </div>
            </motion.div>
          ) : (
            <div className="empty-state">
              <h3>Select an application to review</h3>
              <p>Click on an item in the queue to claim it.</p>
            </div>
          )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Branch Notes Modal */}
      <Modal isOpen={showNotesModal} onClose={() => setShowNotesModal(false)} title={`Branch Notes Hub: ${branchId}`}>
        <div className="branch-notes-container">
            {Object.keys(branchNotes).length === 0 ? <p>No notes found for this branch.</p> : 
             Object.entries(branchNotes).map(([role, apps]) => (
              <div key={role} className="role-group" style={{marginBottom: '2rem'}}>
                  <h3 style={{borderBottom: '2px solid #eee', paddingBottom: '0.5rem', color: '#333'}}>{role}</h3>
                  {apps.length === 0 ? <p>No applications.</p> : apps.map(app => (
                      <div key={app.id} className="app-note-summary" style={{background: '#f9f9f9', padding: '1rem', marginBottom: '1rem', borderRadius: '8px'}}>
                         <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                            <strong>{app.name}</strong>
                            <span className={`status-badge status-${app.status}`}>{app.status}</span>
                         </div>
                         {app.notes.length > 0 ? (
                             <ul style={{paddingLeft: '20px', margin: 0}}>
                                {app.notes.map((n, i) => (
                                    <li key={i} style={{marginBottom: '5px'}}>
                                        {n.content} <span style={{color: '#888', fontSize: '0.8rem'}}>- {n.author}</span>
                                    </li>
                                ))}
                             </ul>
                         ) : <p style={{fontStyle: 'italic', color: '#999', margin: 0}}>No notes.</p>}
                      </div>
                  ))}
              </div>
            ))}
        </div>
      </Modal>
    </div>
  );
}

export default ReviewDashboard;
