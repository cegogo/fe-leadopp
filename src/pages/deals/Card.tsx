//This is where the design of Card is handled inside of Deals component.

import React from 'react';

interface CardProps {
    title: string;
    content: JSX.Element;
}

const PipelineCard: React.FC<CardProps> = ({ title, content }) => {
    const cardStyle: React.CSSProperties = {
        border: '1px',
        borderColor: 'lightgray 0.87',
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
        borderRadius: '4px',
        padding: '10px',
        margin: '10px 20px 10px 10px',
        background: 'white',
        overflow: 'hidden',
        color: 'black',
        marginRight: '10px',
        marginLeft: '30px',
        width: '75%',
            };

    const titleStyle: React.CSSProperties = {
        color: 'rgb(26, 51, 83)',
        fontSize: '1.2rem',
        fontWeight: '500',
        cursor: 'pointer',
        marginLeft: '10px',
            };
        
    const contentStyle: React.CSSProperties = {
        lineHeight: '1.5',
        color: 'gray',
        fontSize: '16px',
        textTransform: 'capitalize',
        marginLeft: '10px',
            };

    return (
        <div style={cardStyle}>
            <h3 style={titleStyle}>{title}</h3>
            <div style={contentStyle}>{content}</div>
        </div>
    );
}
export default PipelineCard;