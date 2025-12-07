export interface CalculationInputs {
    homePrice: number;
    downPaymentPercent: number;
    loanInterestRate: number;
    loanTermYears: number;
    maintenanceFeeMonthly: number; // Hoitovastike
    transferTaxPercent: number; // Varainsiirtovero
    appreciationRate: number; // Asunnon arvonnousu
    rentMonthly: number;
    investmentReturnRate: number; // Sijoitusten tuotto-odotus
    years: number;
}

export interface YearResult {
    year: number;
    ownerWealth: number;
    renterWealth: number;
    ownerEquity: number;
    renterSavings: number;
    ownerDebt: number;
}

export const calculateWealth = (inputs: CalculationInputs): YearResult[] => {
    const safe = (val: number) => (Number.isNaN(val) ? 0 : val);

    const homePrice = safe(inputs.homePrice);
    const downPaymentPercent = safe(inputs.downPaymentPercent);
    const loanInterestRate = safe(inputs.loanInterestRate);
    const loanTermYears = safe(inputs.loanTermYears);
    const maintenanceFeeMonthly = safe(inputs.maintenanceFeeMonthly);
    const transferTaxPercent = safe(inputs.transferTaxPercent);
    const appreciationRate = safe(inputs.appreciationRate);
    const rentMonthly = safe(inputs.rentMonthly);
    const investmentReturnRate = safe(inputs.investmentReturnRate);
    const years = safe(inputs.years);

    const results: YearResult[] = [];

    // Initial Values
    const downPayment = homePrice * (downPaymentPercent / 100);
    const loanAmount = homePrice - downPayment;
    const transferTax = homePrice * (transferTaxPercent / 100);
    const initialCashNeeded = downPayment + transferTax;

    // Owner starts with Home Equity (Down Payment) - Transfer Tax (Lost cost)
    // Wait, wealth calculation:
    // Owner Wealth = Home Value - Remaining Loan + Investments
    // Renter Wealth = Investments (Initial Cash + Monthly Savings)

    // Scenario: Both start with `initialCashNeeded` amount of cash.
    // Owner spends it on DownPayment + Tax.
    // Renter invests it all.

    let ownerHomeValue = homePrice;
    let ownerLoanBalance = loanAmount;
    let ownerInvestments = 0;

    let renterInvestments = initialCashNeeded;

    // Monthly Calculations
    const monthlyRate = loanInterestRate / 100 / 12;
    const numberOfPayments = loanTermYears * 12;

    // Mortgage Payment (Annuity)
    let monthlyMortgagePayment = 0;
    if (monthlyRate > 0) {
        monthlyMortgagePayment =
            (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } else {
        monthlyMortgagePayment = loanAmount / numberOfPayments;
    }

    // Monthly investment return rates
    const monthlyInvReturn = Math.pow(1 + investmentReturnRate / 100, 1 / 12) - 1;
    const monthlyAppreciation = Math.pow(1 + appreciationRate / 100, 1 / 12) - 1;

    for (let year = 1; year <= years; year++) {
        for (let month = 1; month <= 12; month++) {
            // 1. Owner Costs
            // Interest portion
            const interestPayment = ownerLoanBalance * monthlyRate;
            const principalPayment = monthlyMortgagePayment - interestPayment;

            // If loan is paid off
            let actualMortgagePayment = monthlyMortgagePayment;
            if (ownerLoanBalance <= 0) {
                actualMortgagePayment = 0;
            } else if (ownerLoanBalance < principalPayment) {
                actualMortgagePayment = ownerLoanBalance + interestPayment;
            }

            const ownerTotalMonthlyCost = actualMortgagePayment + maintenanceFeeMonthly;

            // 2. Renter Costs
            const renterTotalMonthlyCost = rentMonthly;
            // Note: Rent increases? Keep simple for now, or add inflation? 
            // Let's assume rent stays constant or strictly user input for simplicity unless asked.

            // 3. Difference
            const diff = renterTotalMonthlyCost - ownerTotalMonthlyCost;

            if (diff > 0) {
                // Renter costs more -> Owner saves/invests difference
                ownerInvestments = (ownerInvestments * (1 + monthlyInvReturn)) + diff;
                renterInvestments = (renterInvestments * (1 + monthlyInvReturn));
            } else {
                // Owner costs more -> Renter saves/invests difference (Positive diff for renter)
                // diff is negative here, so we subtract it (add positive value) to renter
                renterInvestments = (renterInvestments * (1 + monthlyInvReturn)) + (-diff);
                ownerInvestments = (ownerInvestments * (1 + monthlyInvReturn));
            }

            // 4. Update Loan & Home Value
            if (ownerLoanBalance > 0) {
                ownerLoanBalance -= (actualMortgagePayment - interestPayment);
                if (ownerLoanBalance < 0) ownerLoanBalance = 0;
            }

            ownerHomeValue = ownerHomeValue * (1 + monthlyAppreciation);
        }

        results.push({
            year,
            ownerWealth: Math.round(ownerHomeValue - ownerLoanBalance + ownerInvestments),
            renterWealth: Math.round(renterInvestments),
            ownerEquity: Math.round(ownerHomeValue - ownerLoanBalance),
            renterSavings: Math.round(renterInvestments),
            ownerDebt: Math.round(ownerLoanBalance),
        });
    }

    return results;
};
