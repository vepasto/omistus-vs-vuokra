import { useState, useEffect } from 'react';
import type { CalculationInputs } from '../utils/calculateWealth';

const LOCAL_STORAGE_KEY = 'calculator-inputs';

export const useCalculatorState = (initialInputs: CalculationInputs) => {
    const [inputs, setInputs] = useState<CalculationInputs>(() => {
        // 1. Try to parse from URL
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('hP')) { // Check for a key param to verify URL usage
            try {
                return {
                    homePrice: Number(searchParams.get('hP')) || initialInputs.homePrice,
                    downPaymentPercent: Number(searchParams.get('dpp')) || initialInputs.downPaymentPercent,
                    loanInterestRate: Number(searchParams.get('lir')) || initialInputs.loanInterestRate,
                    loanTermYears: Number(searchParams.get('lty')) || initialInputs.loanTermYears,
                    maintenanceFeeMonthly: Number(searchParams.get('mfm')) || initialInputs.maintenanceFeeMonthly,
                    transferTaxPercent: Number(searchParams.get('ttp')) || initialInputs.transferTaxPercent,
                    appreciationRate: Number(searchParams.get('ar')) || initialInputs.appreciationRate,
                    rentMonthly: Number(searchParams.get('rm')) || initialInputs.rentMonthly,
                    rentIncreasePercent: Number(searchParams.get('ri')) || initialInputs.rentIncreasePercent,
                    investmentReturnRate: Number(searchParams.get('irr')) || initialInputs.investmentReturnRate,
                    years: Number(searchParams.get('y')) || initialInputs.years,
                };
            } catch (e) {
                console.warn('Failed to parse URL params', e);
            }
        }

        // 2. Try LocalStorage
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.warn('Failed to parse local storage', e);
            }
        }

        // 3. Fallback to initial
        return initialInputs;
    });

    // Sync to LocalStorage & URL
    useEffect(() => {
        // LocalStorage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(inputs));

        // URL (Debounce or direct? Direct is okay for now if not too heavy, 
        // but maybe just set searchParams without pushing history to avoid back-button hell?
        // Actually, replaceState is better to avoid history buildup)
        const params = new URLSearchParams();
        params.set('hP', String(inputs.homePrice));
        params.set('dpp', String(inputs.downPaymentPercent));
        params.set('lir', String(inputs.loanInterestRate));
        params.set('lty', String(inputs.loanTermYears));
        params.set('mfm', String(inputs.maintenanceFeeMonthly));
        params.set('ttp', String(inputs.transferTaxPercent));
        params.set('ar', String(inputs.appreciationRate));
        params.set('rm', String(inputs.rentMonthly));
        params.set('ri', String(inputs.rentIncreasePercent));
        params.set('irr', String(inputs.investmentReturnRate));
        params.set('y', String(inputs.years));

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({ path: newUrl }, '', newUrl);

    }, [inputs]);

    return [inputs, setInputs] as const;
};
