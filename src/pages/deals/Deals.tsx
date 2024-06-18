import React, { useState } from 'react';
import Leads from '../leads/Leads';
import Opportunities from '../opportunities/Opportunities';
import Card from './Card';

const Deals: React.FC = () => {
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
    
    // Define inline styles as JavaScript objects
    const containerStyle: React.CSSProperties = {
        padding: '20px',
        marginLeft: '1em',
        marginTop: '3em',
    };

    const columnsStyle: React.CSSProperties = {
        display: 'flex',
        gap: '0'
    };

    const columnStyle: React.CSSProperties = {
        flex: 1,
        margin: '0 -2%',
        border: 0,
        overflow: 'hidden',
        position: 'relative',
    };

    const headerStyleBase: React.CSSProperties = {
        textAlign: 'center',
        paddingLeft: '18%',
        padding: '9px',
        color: 'white',
        position: 'relative',
        clipPath: 'polygon(0 0, 75% 0, 100% 50%, 75% 100%, 0 100%, 25% 50%)',
        cursor: 'pointer',
    };

    const displayAreaStyle: React.CSSProperties = {
        marginTop: '20px',
        padding: '20px',
        border: '1px solid #1C4D4D',
        borderRadius: '5px'
    };

    // Function to handle header click
    const handleHeaderClick = (component: string) => {
        setSelectedComponent(component);
    };

    // Function to handle back click to show the columns again
    const handleBackClick = () => {
        setSelectedComponent(null);
    };

    // Function to render the selected component
    const renderComponent = () => {
        if (selectedComponent === 'Leads') return <Leads />;
        if (selectedComponent === 'Opportunities') return <Opportunities />;
        if (selectedComponent === 'Meeting') return <div>Meeting Component Content</div>;
        if (selectedComponent === 'Qualified') return <div>Qualified Component Content</div>;
        if (selectedComponent === 'Negotiation') return <div>Negotiation Component Content</div>;
        if (selectedComponent === 'Won') return <div>Won Component Content</div>;
        return null;
    };

    return (
        <div style={containerStyle}>
            {selectedComponent ? (
                <div style={displayAreaStyle}>
                    <button onClick={handleBackClick}>Back</button>
                    <h2>{selectedComponent}</h2>
                    {renderComponent()}
                </div>
            ) : (
                <div style={columnsStyle}>
                    <div style={columnStyle}>
                        <div style={{ ...headerStyleBase, backgroundColor: '#AC80A0' }} onClick={() => handleHeaderClick('Leads')}>Leads</div>
                        <Card title="Lead" content="Lead details here..." />
                        <Card title="Lead" content="Lead details here..." />
                    </div>
                    <div style={columnStyle}>
                        <div style={{ ...headerStyleBase, backgroundColor: '#89AAE6' }} onClick={() => handleHeaderClick('Meeting')}>Meeting</div>
                        <Card title="Meeting" content="Meeting details here..." />
                        <Card title="Meeting" content="Meeting details here..." />
                    </div>
                    <div style={columnStyle}>
                        <div style={{ ...headerStyleBase, backgroundColor: '#3685B5' }} onClick={() => handleHeaderClick('Opportunities')}>Opportunity</div>
                        <Card title="Opportunity" content="Opportunity details here..." />
                        <Card title="Opportunity" content="Opportunity details here..." />
                    </div>
                    <div style={columnStyle}>
                        <div style={{ ...headerStyleBase, backgroundColor: '#0471A6' }} onClick={() => handleHeaderClick('Qualified')}>Qualified</div>
                        <Card title="Qualified" content="Qualified details here..." />
                        <Card title="Qualified" content="Qualified details here..." />
                    </div>
                    <div style={columnStyle}>
                        <div style={{ ...headerStyleBase, backgroundColor: '#023d5a' }} onClick={() => handleHeaderClick('Negotiation')}>Negotiation</div>
                        <Card title="Negotiation" content="Negotiation details here..." />
                        <Card title="Negotiation" content="Negotiation details here..." />
                    </div>
                    <div style={columnStyle}>
                        <div style={{ ...headerStyleBase, backgroundColor: '#1C4D4D' }} onClick={() => handleHeaderClick('Won')}>Won</div>
                        <Card title="Won" content="Won details here..." />
                        <Card title="Won" content="Won details here..." />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Deals;