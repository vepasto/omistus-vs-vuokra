import React from 'react';
import type { YearResult } from '../utils/calculateWealth';

interface Props {
    data: YearResult[];
}

export const ResultsSummary: React.FC<Props> = ({ data }) => {
    if (data.length === 0) return null;

    const finalResult = data[data.length - 1];
    const ownerWin = finalResult.ownerWealth > finalResult.renterWealth;

    return (
        <div className="results-summary card">
            <h2>Tulokset {finalResult.year} vuoden jälkeen</h2>

            <div className="summary-grid">
                <div className="summary-item">
                    <div>Omistusasunto</div>
                    <div className="value">{finalResult.ownerWealth.toLocaleString()} €</div>
                </div>
                <div className="summary-item">
                    <div>Vuokra-asuminen</div>
                    <div className="value">{finalResult.renterWealth.toLocaleString()} €</div>
                </div>
            </div>

            <div className="details-grid">
                <div className="detail-row">
                    <span>Nettovarallisuus (Omistaja):</span>
                    <span>{finalResult.ownerEquity.toLocaleString()} €</span>
                </div>
                <div className="detail-row">
                    <span>Jäljellä oleva laina:</span>
                    <span>{finalResult.ownerDebt.toLocaleString()} €</span>
                </div>
                <div className="detail-row">
                    <span>Säästöt & Sijoitukset (Vuokralainen):</span>
                    <span>{finalResult.renterSavings.toLocaleString()} €</span>
                </div>
            </div>

            <div className={`winner-banner ${ownerWin ? 'win-owner' : 'win-renter'}`}>
                {ownerWin
                    ? 'Omistusasuminen on taloudellisesti kannattavampaa.'
                    : 'Vuokralla asuminen on taloudellisesti kannattavampaa.'}
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Linkki kopioitu leikepöydälle!');
                    }}
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid var(--color-border)',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        color: 'var(--color-text)',
                        fontSize: '0.9rem'
                    }}
                >
                    Jaa laskelma (Kopioi linkki)
                </button>
            </div>
        </div>
    );
};
