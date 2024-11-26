import React, { useEffect } from 'react';
import styled from 'styled-components';

// Styled Components for the homepage
const HomeContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const BackgroundVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75); /* Darker overlay */
  z-index: 10;
`;

const TitleContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 20;
`;

const Title = styled.h1`
  font-family: 'Monster Hunter Condensed', sans-serif;
  font-size: 8rem; /* Increased title size */
  color: white;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.8); /* Stronger shadow for better contrast */
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: white;
  margin-top: 1rem;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.8); /* Adding shadow for readability */
`;

const HomePage = () => {
  // Disable scrolling on the page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto'; // Re-enable scrolling when the component is unmounted
    };
  }, []);

  return (
    <HomeContainer>
      <BackgroundVideo autoPlay loop muted>
        <source src="/homepage/trailerhome.mp4" type="video/mp4" />
      </BackgroundVideo>
      <Overlay />
      <TitleContainer>
        <Title>Hunter's Book</Title>
        <Subtitle>Search all things Monster Hunter!</Subtitle>
      </TitleContainer>
    </HomeContainer>
  );
};

export default HomePage;
