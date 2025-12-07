import React from 'react';
import type { MonthlyAnalysis } from '../utils/calculateWealth';

interface Props {
    analysis: MonthlyAnalysis;
}

export const MonthlyAnalysisCard: React.FC<Props> = ({ analysis }) => {
    const {
        ownerTotalMonthly,
        interestPayment,
        principalPayment,
        maintenance,
        renterTotalMonthly,
        difference,
        saver
    } = analysis;

    return (
        <div className="card monthly-analysis">
            <h3>Kuukausitason erittely (Aluksi)</h3>
            <div className="analysis-grid">
                {/* Owner Side */}
                <div className="analysis-column">
                    <h4>Omistaja</h4>
                    <div className="cost-row">
                        <span>Korot:</span>
                        <span>{interestPayment} €</span>
                    </div>
                    <div className="cost-row">
                        <span>Lyhennys:</span>
                        <span>{principalPayment} €</span>
                    </div>
                    <div className="cost-row">
                        <span>Vastike:</span>
                        <span>{maintenance} €</span>
                    </div>
                    <div className="total-row">
                        <span>Yhteensä:</span>
                        <span className="highlight-owner">{ownerTotalMonthly} €</span>
                    </div>
                </div>

                {/* VS Divider */}
                <div className="vs-divider">VS</div>

                {/* Renter Side */}
                <div className="analysis-column">
                    <h4>Vuokralainen</h4>
                    <div className="cost-row">
                        <span>Vuokra:</span>
                        <span>{renterTotalMonthly} €</span>
                    </div>
                    <div className="total-row">
                        <span>Yhteensä:</span>
                        <span className="highlight-renter">{renterTotalMonthly} €</span>
                    </div>
                </div>
            </div>

            {/* Savings Conclusion */}
            <div className={`savings-conclusion ${saver === 'owner' ? 'save-owner' : 'save-renter'}`}>
                {saver === 'owner' ? (
                    <p>
                        Omistaja säästää <strong>{difference} €/kk</strong> enemmän, joka sijoitetaan.
                    </p>
                ) : (
                    <p>
                        Vuokralainen säästää <strong>{difference} €/kk</strong>, joka sijoitetaan.
                    </p>
                )}
            </div>
        </div>
    );
};
