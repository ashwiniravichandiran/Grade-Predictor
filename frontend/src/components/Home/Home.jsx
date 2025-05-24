import React from 'react';
import { useNavigate } from 'react-router-dom';
import img1 from '../../assets/grade3.jpg'; // Use your street view images instead
import './Home.css'; // We'll use your existing CSS with some modifications

const Home = () => {
  const navigate = useNavigate();

  const handleInstitutionCardClick = () => {
    navigate('/institution'); // Update with your actual route
  };

  const handleIndividualCardClick = () => {
    navigate('/individual'); // Update with your actual route
  };

  const cards = [
    {
      name: 'For Educational Institutions',
      image: img1,
      description: 'Upload student performance data in Excel format to analyze trends and predict grades for better academic planning.',
      onClick: handleInstitutionCardClick
    },
    {
      name: 'For Individual Student',
      image: img1,
      description: 'Enter your details to get a personalized grade prediction based on past performance and academic patterns.',
      onClick: handleIndividualCardClick
    },
  ];

  return (
    <div className="bg-dark">
      
      {/* Main content */}
      <div className="card-container">
        {cards.map((card, index) => (
          <div className="option-card" key={index} onClick={card.onClick}>
            <div className="image-container">
              <img src={card.image} alt={card.name} className="card-image" />
            </div>
            <h2 className="card-title">{card.name}</h2>
            <p className="card-description">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;