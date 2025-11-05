import React, { useState } from 'react';
import './App.css';
import Button from './components/Button';
import Input from './components/Input';
import BranchCard from './components/BranchCard';
import Spinner from './components/Spinner';
import Modal from './components/Modal';

function App() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const branches = [
    { name: 'Software', color: 'software' },
    { name: 'Hardware', color: 'hardware' },
    { name: 'Data', color: 'data' },
    { name: 'Finance', color: 'finance' },
    { name: 'Marketing', color: 'marketing' },
    { name: 'Community', color: 'community' }
  ];

  return (
    <div className="App">
      <div className="container">
        <h1>Beginning Design System</h1>
        <p className="subtitle">Component library(will improve aesthetics on the go)</p>

        <section className="section">
          <h2>Branch Buttons</h2>
          <div className="button-grid">
            {branches.map(branch => (
              <Button key={branch.name} variant={branch.color}>
                {branch.name}
              </Button>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Branch Cards</h2>
          <div className="branch-grid">
            {branches.map(branch => (
              <BranchCard
                key={branch.name}
                branch={branch.name}
                color={branch.color}
                onClick={() => alert(`Clicked ${branch.name}`)}
              />
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Action Buttons</h2>
          <div className="button-group">
            <Button variant="primary">Apply Now</Button>
            <Button variant="black">View Roles</Button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
