import React from 'react';

// You need to include this line in your main HTML or _app.js to import the Sora font
// <link href="https://fonts.googleapis.com/css2?family=Sora:wght@600&display=swap" rel="stylesheet" />

const teamData = [
  { name: 'Vikramm B Shroff', designation: 'Co-founder' },
  { name: 'Pooza Agarwal', designation: 'Co-founder' },
  { name: 'Namman Shroff', designation: 'Partner & Design Lead' },
  { name: 'Ajit Deka', designation: 'Office Assistant' },
  { name: 'Ayush Biswakarma', designation: 'Data Operator' },
  { name: 'Biplob Rabha', designation: 'Jr. Architect' },
  { name: 'Devid Barman', designation: 'Admin Assistant' },
  { name: 'Indrajit Choudhary', designation: 'Accountant' },
  { name: 'Kriti Ghiya', designation: 'Jr. Interior Designer' },
  { name: 'Luku Biswakarma', designation: 'Site Supervisor' },
  { name: 'Mr. John Doe', designation: 'Architect' },
  { name: 'Mr. John Doe', designation: 'Architect' },
  { name: 'Mr. John Doe', designation: 'Architect' },
  { name: 'Mr. John Doe', designation: 'Architect' },
  { name: 'Mr. John Doe', designation: 'Architect' },
  { name: 'Mr. John Doe', designation: 'Architect' },
  { name: 'Mr. John Doe', designation: 'Architect' },
];

const TeamMembers = () => {
  return (
    <div style={{ padding: '40px 50px', backgroundColor: '#f5f4f3', minHeight: '100vh' }}>
      <h1
        style={{
          fontFamily: "'Sora', sans-serif",
          fontWeight: 600,
          fontSize: '56px',
          lineHeight: '64px',
          letterSpacing: '-1%',
          color: '#3E3C3C',
          marginBottom: '30px',
        }}
      >
        TEAM MEMBERS
      </h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Sora', sans-serif", color: '#3E3C3C' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #d6d6d6', fontWeight: 600, fontSize: '14px', textAlign: 'left' }}>
            <th style={{ paddingBottom: '15px', width: '45%' }}>TEAM MEMBER</th>
            <th style={{ paddingBottom: '15px', width: '55%' }}>DESIGNATION</th>
          </tr>
        </thead>
        <tbody>
          {teamData.map(({ name, designation }, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #d6d6d6' }}>
              <td style={{ padding: '10px 0', fontSize: '14px' }}>{name}</td>
              <td style={{ padding: '10px 0', fontSize: '14px' }}>{designation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamMembers;
