import React from 'react'

const Spectator = ({ user, i }) => {

  return (
    <li key={i}>
      {user.name}
    </li>
  );
};

export default Spectator