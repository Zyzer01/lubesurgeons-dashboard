import { useState } from 'react';
import axios from 'axios';

function TestForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const formData = { name, email, template: 'appointment' };

    axios
      .post('http://localhost:3000/send-email', formData)
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        setMessage('An error occurred while sending the email');
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <h1>Email Form</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Send Email</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default TestForm;
