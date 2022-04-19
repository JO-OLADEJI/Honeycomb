import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      {navigate('/stake')}
    </>
  );
}

export default Home;