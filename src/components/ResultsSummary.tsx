import React from 'react';
import type { YearResult } from '../utils/calculateWealth';

interface Props {
    data: YearResult[];
}

export const ResultsSummary: React.FC<Props> = ({ data }) => {
    if (data.length === 0) return null;

    const finalYear = data[data.length - 1];
    const ownerWin = finalYear.ownerWealth > finalYear.renterWealth;
    const diff = Math.abs(finalYear.ownerWealth - finalYear.renterWealth);

    return (
        <div className="results-summary card">
            <h2>Tulokset {finalYear.year} vuoden jälkeen</h2>

            <div className="summary-grid">
                <div className="summary-item">
                    <small>Omistaja (Nettovarallisuus)</small>
                    <div className="value highlight-owner">{finalYear.ownerWealth.toLocaleString()} €</div>
                    <div className="sub-value">
                        Asunto: {(finalYear.ownerEquity + finalYear.ownerDebt).toLocaleString()} €
                        <br />
                        Velka: -{finalYear.ownerDebt.toLocaleString()} €
                        <br />
                        Sijoitukset: {(finalYear.ownerWealth - finalYear.ownerEquity).toLocaleString()} €
                    </div>
                </div>

                <div className="summary-item">
                    <small>Vuokralainen (Nettovarallisuus)</small>
                    <div className="value highlight-renter">{finalYear.renterWealth.toLocaleString()} €</div>
                    <div className="sub-value">
                        Sijoitukset: {finalYear.renterSavings.toLocaleString()} €
                    </div>
                </div>
            </div>

            <div className={`verdict ${ownerWin ? 'win-owner' : 'win-renter'}`}>
                {ownerWin
                    ? `Omistusasuminen oli kannattavampaa ${diff.toLocaleString()} €`
                    : `Vuokra-asuminen oli kannattavampaa ${diff.toLocaleString()} €`}
            </div>
        </div>
    );
};
