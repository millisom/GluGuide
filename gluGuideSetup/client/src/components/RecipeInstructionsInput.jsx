import { useState } from 'react';
import searchStyles from '../styles/SearchFoodItem.module.css';
import styles from '../styles/LogMealPage.module.css';

const RecipeInstructionsInput = ({ instructions, setInstructions }) => {
  const [newStep, setNewStep] = useState('');

  const handleChange = (e, index) => {
    const updated = [...instructions];
    updated[index] = e.target.value;
    setInstructions(updated);
  };

  const removeStep = (index) => {
    const updated = instructions.filter((_, i) => i !== index);
    setInstructions(updated);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newStep.trim()) {
      e.preventDefault();
      setInstructions([...instructions, newStep.trim()]);
      setNewStep('');
    }
  };

  return (
    <div className={searchStyles.container}>
      <div className={searchStyles.searchSection}>
        <input
          type="text"
          value={newStep}
          onChange={(e) => setNewStep(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a step and press Enter"
          className={searchStyles.searchInput}
        />
      </div>

      {instructions.length > 0 && (
        <>
          <h3 className={styles.title}>Instructions</h3>
          <div style={{ marginTop: '1rem' }}>
            {instructions.map((step, index) => (
              <div key={index} style={{ marginBottom: '12px' }}>
                <textarea
                  className={styles.textarea}
                  value={step}
                  onChange={(e) => handleChange(e, index)}
                  placeholder={`Step ${index + 1}`}
                />
                <button
                  onClick={() => removeStep(index)}
                  style={{
                    marginTop: '4px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Remove step
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecipeInstructionsInput;
