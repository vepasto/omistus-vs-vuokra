import React from 'react';
import type { CalculationInputs } from '../utils/calculateWealth';

interface Props {
    inputs: CalculationInputs;
    onChange: (inputs: CalculationInputs) => void;
}

export const InputForm: React.FC<Props> = ({ inputs, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Allow empty string to become NaN
        const newValue = value === '' ? NaN : parseFloat(value);

        onChange({
            ...inputs,
            // If it's NaN, it stays NaN in state so input can be empty.
            // logic must handle NaN (treat as 0)
            [name]: newValue,
        });
    };

    // Helper to render value: NaN -> ''
    const val = (v: number) => (Number.isNaN(v) ? '' : v);

    return (
        <div className="input-form-grid">
            <section className="input-group">
                <h3>Asunto & Laina</h3>
                <div className="input-item">
                    <label>Asunnon Hinta (€)</label>
                    <input
                        type="number"
                        name="homePrice"
                        value={val(inputs.homePrice)}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-item">
                    <label>Omarahoitusosuus (%)</label>
                    <input
                        type="number"
                        name="downPaymentPercent"
                        value={val(inputs.downPaymentPercent)}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-item">
                    <label>Lainan Korko (%)</label>
                    <input
                        type="number"
                        step="0.1"
                        name="loanInterestRate"
                        value={val(inputs.loanInterestRate)}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-item">
                    <label>Lainaaika (vuotta)</label>
                    <input
                        type="number"
                        name="loanTermYears"
                        value={val(inputs.loanTermYears)}
                        onChange={handleChange}
                    />
                </div>
            </section>

            <section className="input-group">
                <h3>Asumiskulut</h3>
                <div className="input-item">
                    <label>Hoitovastike (€/kk)</label>
                    <input
                        type="number"
                        name="maintenanceFeeMonthly"
                        value={val(inputs.maintenanceFeeMonthly)}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-item">
                    <label>Varainsiirtovero (%)</label>
                    <input
                        type="number"
                        step="0.1"
                        name="transferTaxPercent"
                        value={val(inputs.transferTaxPercent)}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-item">
                    <label>Verrokkivuokra (€/kk)</label>
                    <input
                        type="number"
                        name="rentMonthly"
                        value={val(inputs.rentMonthly)}
                        onChange={handleChange}
                    />
                </div>
            </section>

            <section className="input-group">
                <h3>Markkina</h3>
                <div className="input-item">
                    <label>Asunnon Arvonnousu (%/v)</label>
                    <input
                        type="number"
                        step="0.1"
                        name="appreciationRate"
                        value={val(inputs.appreciationRate)}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-item">
                    <label>Sijoitustuotto (%/v)</label>
                    <input
                        type="number"
                        step="0.1"
                        name="investmentReturnRate"
                        value={val(inputs.investmentReturnRate)}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-item">
                    <label>Tarkastelujakso (vuotta)</label>
                    <input
                        type="number"
                        name="years"
                        value={val(inputs.years)}
                        max="50"
                        onChange={handleChange}
                    />
                </div>
            </section>
        </div>
    );
};
