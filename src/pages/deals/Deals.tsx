import React, { useState } from 'react';
import Leads from '../leads/Leads';
import Opportunities from '../opportunities/Opportunities';
import Card from './Card';

const Deals: React.FC = () => {
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
    
    // Define inline styles as JavaScript objects
    const containerStyle: React.CSSProperties = {
        padding: '20px'
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
        transition: 'color 0.3s ease-in-out'
    };

    const displayAreaStyle: React.CSSProperties = {
        marginTop: '20px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '5px'
    };

    // Function to handle header click
    const handleHeaderClick = (component: string) => {
        setSelectedComponent(component);
    };

    return (
        <div style={containerStyle}>
            <h1>Deals</h1>
            <div style={columnsStyle}>
                <div style={columnStyle}>
                    <div style={{ ...headerStyleBase, backgroundColor: '#AC80A0' }} onClick={() => handleHeaderClick('Leads')}>Leads</div>
                    {/* Generate cards for Leads */}
                    <Card title="Lead" content="Lead details here..." />
                    <Card title="Lead" content="Lead details here..." />
                </div>
                <div style={columnStyle}>
                    <div style={{ ...headerStyleBase, backgroundColor: '#89AAE6' }} onClick={() => handleHeaderClick('Meeting')}>Meeting</div>
                    {/* Generate cards for Meeting */}
                    <Card title="Meeting" content="Meeting details here..." />
                    <Card title="Meeting" content="Meeting details here..." />
                </div>
                <div style={columnStyle}>
                    <div style={{ ...headerStyleBase, backgroundColor: '#3685B5' }} onClick={() => handleHeaderClick('Opportunities')}>Opportunity</div>
                    {/* Generate cards for Opportunities */}
                    <Card title="Opportunity" content="Opportunity details here..." />
                    <Card title="Opportunity" content="Opportunity details here..." />
                </div>
                <div style={columnStyle}>
                    <div style={{ ...headerStyleBase, backgroundColor: '#0471A6' }} onClick={() => handleHeaderClick('Qualified')}>Qualified</div>
                    {/* Generate cards for Qualified */}
                    <Card title="Qualified" content="Qualified details here..." />
                    <Card title="Qualified" content="Qualified details here..." />
                </div>
                <div style={columnStyle}>
                    <div style={{ ...headerStyleBase, backgroundColor: '#023d5a' }} onClick={() => handleHeaderClick('Negotiation')}>Negotiation</div>
                    {/* Generate cards for Negotiation */}
                    <Card title="Negotiation" content="Negotiation details here..." />
                    <Card title="Negotiation" content="Negotiation details here..." />
                </div>
                <div style={columnStyle}>
                    <div style={{ ...headerStyleBase, backgroundColor: '#061826' }} onClick={() => handleHeaderClick('Won')}>Won</div>
                    {/* Generate cards for Won */}
                    <Card title="Won" content="Won details here..." />
                    <Card title="Won" content="Won details here..." />
                </div>
            </div>

            {selectedComponent && (
                <div style={displayAreaStyle}>
                    <h2>{selectedComponent}</h2>
                    {selectedComponent === 'Leads' && <Leads />}
                    {selectedComponent === 'Opportunities' && <Opportunities />}
                    {selectedComponent === 'Meeting' && <div>Meeting Component Content</div>}
                    {selectedComponent === 'Qualified' && <div>Qualified Component Content</div>}
                    {selectedComponent === 'Negotiation' && <div>Negotiation Component Content</div>}
                    {selectedComponent === 'Won' && <div>Won Component Content</div>}
                </div>
            )}
        </div>
    );
}

export default Deals;