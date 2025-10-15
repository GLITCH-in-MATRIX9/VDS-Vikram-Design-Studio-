# Frontend reCAPTCHA Integration Example

## Your reCAPTCHA Keys:
- **SITE KEY**: `6Lezg-grAAAAAFWEp1Dn9kQ2IGa_JCe6-95VE53a`
- **SECRET KEY**: `6Lezg-grAAAAACHzdl-8xQ_UW0C-RwnvQ-a5e--4` (Backend only)

## Option 1: reCAPTCHA v2 (Checkbox) - Recommended for Contact Forms

### 1. Add to your HTML head:
```html
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
```

### 2. Add to your contact form:
```jsx
// In your Contact component
import { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    recaptchaToken: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get reCAPTCHA token
    const recaptchaToken = window.grecaptcha.getResponse();
    
    if (!recaptchaToken) {
      alert('Please complete the reCAPTCHA verification');
      return;
    }

    const submitData = {
      ...formData,
      recaptchaToken
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Message sent successfully!');
        // Reset form
        setFormData({ name: '', email: '', subject: '', message: '', recaptchaToken: '' });
        window.grecaptcha.reset(); // Reset reCAPTCHA
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      alert('Error sending message');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <input
        type="text"
        placeholder="Subject"
        value={formData.subject}
        onChange={(e) => setFormData({...formData, subject: e.target.value})}
        required
      />
      <textarea
        placeholder="Message"
        value={formData.message}
        onChange={(e) => setFormData({...formData, message: e.target.value})}
        required
      />
      
      {/* reCAPTCHA Widget */}
      <div 
        className="g-recaptcha" 
        data-sitekey="6Lezg-grAAAAAFWEp1Dn9kQ2IGa_JCe6-95VE53a"
      ></div>
      
      <button type="submit">Send Message</button>
    </form>
  );
};
```

## Option 2: reCAPTCHA v3 (Invisible) - Advanced

### 1. Add to your HTML head:
```html
<script src="https://www.google.com/recaptcha/api.js?render=6Lezg-grAAAAAFWEp1Dn9kQ2IGa_JCe6-95VE53a"></script>
```

### 2. React Component:
```jsx
import { useState, useEffect } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=6Lezg-grAAAAAFWEp1Dn9kQ2IGa_JCe6-95VE53a';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const executeRecaptcha = () => {
    return new Promise((resolve) => {
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute('6Lezg-grAAAAAFWEp1Dn9kQ2IGa_JCe6-95VE53a', {action: 'contact'})
          .then((token) => {
            resolve(token);
          });
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Execute reCAPTCHA
      const recaptchaToken = await executeRecaptcha();
      
      const submitData = {
        ...formData,
        recaptchaToken
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      alert('Error sending message');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <input
        type="text"
        placeholder="Subject"
        value={formData.subject}
        onChange={(e) => setFormData({...formData, subject: e.target.value})}
        required
      />
      <textarea
        placeholder="Message"
        value={formData.message}
        onChange={(e) => setFormData({...formData, message: e.target.value})}
        required
      />
      
      <button type="submit">Send Message</button>
    </form>
  );
};
```

## Testing Your Integration

### 1. Test Backend (Development Mode):
```bash
# This should work without reCAPTCHA in development
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "This is a test message"
  }'
```

### 2. Test with reCAPTCHA:
```bash
# This requires a valid reCAPTCHA token
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "subject": "Test Subject",
    "message": "This is a test message",
    "recaptchaToken": "valid-token-from-frontend"
  }'
```

## Important Notes:

1. **Development Mode**: reCAPTCHA is automatically skipped when `NODE_ENV=development`
2. **Production**: Full reCAPTCHA verification is enforced
3. **Error Handling**: The backend returns specific error codes for reCAPTCHA issues
4. **Security**: Never expose the SECRET KEY in frontend code
5. **Testing**: Use the test endpoint `/api/contact/test-recaptcha` for testing

## Next Steps:

1. Add `RECAPTCHA_SECRET_KEY=6Lezg-grAAAAACHzdl-8xQ_UW0C-RwnvQ-a5e--4` to your `.env` file
2. Choose either reCAPTCHA v2 or v3 for your frontend
3. Implement the frontend code above
4. Test the integration
5. Deploy to production with full reCAPTCHA protection
