import React, { useState, useEffect } from 'react';
import { calculateWealth, type CalculationInputs, type YearResult, type MonthlyAnalysis } from '../utils/calculateWealth';
import { MonthlyAnalysisCard } from './MonthlyAnalysisCard';
import { InputForm } from './InputForm';
import { WealthChart } from './WealthChart';
import { ResultsSummary } from './ResultsSummary';

const initialInputs: CalculationInputs = {
    homePrice: 200000,
    downPaymentPercent: 5,
    loanInterestRate: 3.5,
    loanTermYears: 25,
    maintenanceFeeMonthly: 300,
    transferTaxPercent: 1.5, // Check default for apartment? 1.5% for shares in housing company is common
    appreciationRate: 2.0,
    rentMonthly: 900,
    investmentReturnRate: 5.0,
    years: 30,
};

export const Calculator: React.FC = () => {
    const [inputs, setInputs] = useState<CalculationInputs>(initialInputs);
    const [results, setResults] = useState<YearResult[]>([]);
    const [monthlyAnalysis, setMonthlyAnalysis] = useState<MonthlyAnalysis | null>(null);

    useEffect(() => {
        const { yearlyResults, monthlyAnalysis } = calculateWealth(inputs);
        setResults(yearlyResults);
        setMonthlyAnalysis(monthlyAnalysis);
    }, [inputs]);

    return (
        <div className="calculator-container">
            <div className="sidebar">
                <InputForm inputs={inputs} onChange={setInputs} />
            </div>
            <div className="main-content">
                <ResultsSummary data={results} />

                {monthlyAnalysis && (
                    <MonthlyAnalysisCard analysis={monthlyAnalysis} />
                )}

                <div className="chart-container card">
                    <h3>Varallisuuden kehitys</h3>
                    <WealthChart data={results} />
                </div>
            </div>
        </div>
    );
};
