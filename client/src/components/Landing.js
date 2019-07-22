import React from 'react';

class Landing extends React.Component {
  render() {
    return (
      <div
        style={{
          textAlign: 'center',
          backgroundImage:
            'url(' +
            'https://images.unsplash.com/photo-1555421689-491a97ff2040?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&w=1650&q=80' +
            ')',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh'
        }}
      >
        <h1 style={{ marginTop: '0' }}>Emailfc</h1>
        <h5 style={{ bottom: '0' }}>
          An App can send emails and collect feedbacks
        </h5>
      </div>
    );
  }
}

export default Landing;
