import React from 'react';
import './Input.css';

function Input({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    error = '',
    name
}) {
    return(
        <div className="input-wrapper">
      {label && (
        <label className="input-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field ${error ? 'input-error' : ''}`}
        required={required}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
    );
}

export default Input;