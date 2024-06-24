import React from 'react';

interface CardProps {
    title: string;
    content: string;
}

const Card: React.FC<CardProps> = ({ title, content }) => {
    const cardStyle: React.CSSProperties = {
        border: '1px solid',
        boxShadow: '5px',
        borderRadius: '15px',
        padding: '10px',
        margin: '10px 20% 10px 10px',
    };

    return (
        <div style={cardStyle}>
            <h3>{title}</h3>
            <p>{content}</p>
        </div>
    );
}
export default Card;