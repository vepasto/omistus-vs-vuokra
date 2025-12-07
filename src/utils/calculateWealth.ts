export interface CalculationInputs {
    homePrice: number;
    downPaymentPercent: number;
    loanInterestRate: number;
    loanTermYears: number;
    maintenanceFeeMonthly: number; // Hoitovastike
    transferTaxPercent: number; // Varainsiirtovero
    appreciationRate: number; // Asunnon arvonnousu
    rentMonthly: number;
    rentIncreasePercent: number; // Vuokrankorotus
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

export interface MonthlyAnalysis {
    ownerTotalMonthly: number;
    interestPayment: number;
    principalPayment: number;
    maintenance: number;
    renterTotalMonthly: number;
    difference: number;
    saver: 'owner' | 'renter';
}

export const calculateWealth = (inputs: CalculationInputs): { yearlyResults: YearResult[]; monthlyAnalysis: MonthlyAnalysis } => {
    const safe = (val: number) => (Number.isNaN(val) ? 0 : val);

    const homePrice = safe(inputs.homePrice);
    const downPaymentPercent = safe(inputs.downPaymentPercent);
    const loanInterestRate = safe(inputs.loanInterestRate);
    const loanTermYears = safe(inputs.loanTermYears);
    const maintenanceFeeMonthly = safe(inputs.maintenanceFeeMonthly);
    const transferTaxPercent = safe(inputs.transferTaxPercent);
    const appreciationRate = safe(inputs.appreciationRate);
    const initialRentMonthly = safe(inputs.rentMonthly);
    const rentIncreasePercent = safe(inputs.rentIncreasePercent);
    const investmentReturnRate = safe(inputs.investmentReturnRate);
    const years = safe(inputs.years);

    const results: YearResult[] = [];

    // Initial Values
    const downPayment = homePrice * (downPaymentPercent / 100);
    const loanAmount = homePrice - downPayment;
    const transferTax = homePrice * (transferTaxPercent / 100);
    const initialCashNeeded = downPayment + transferTax;

    let ownerHomeValue = homePrice;
    let ownerLoanBalance = loanAmount;
    let ownerInvestments = 0;
    let renterInvestments = initialCashNeeded;

    // Monthly Calculations
    const monthlyRate = loanInterestRate / 100 / 12;
    const numberOfPayments = loanTermYears * 12;

    // Mortgage Payment (Annuity) - Initial
    let monthlyMortgagePayment = 0;
    if (monthlyRate > 0) {
        monthlyMortgagePayment =
            (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } else {
        monthlyMortgagePayment = loanAmount / numberOfPayments;
    }

    // Capture the initial monthly breakdown for the analysis
    const initialInterest = loanAmount * monthlyRate;
    const initialPrincipal = monthlyMortgagePayment - initialInterest;

    const initialOwnerTotal = monthlyMortgagePayment + maintenanceFeeMonthly;
    const initialRenterTotal = initialRentMonthly;
    const initialDiff = initialRenterTotal - initialOwnerTotal;

    const monthlyAnalysis: MonthlyAnalysis = {
        ownerTotalMonthly: Math.round(initialOwnerTotal),
        interestPayment: Math.round(initialInterest),
        principalPayment: Math.round(initialPrincipal),
        maintenance: Math.round(maintenanceFeeMonthly),
        renterTotalMonthly: Math.round(initialRenterTotal),
        difference: Math.round(Math.abs(initialDiff)),
        saver: initialDiff > 0 ? 'owner' : 'renter'
    };

    // Push Year 0 (Starting Position)
    results.push({
        year: 0,
        ownerWealth: Math.round(homePrice - loanAmount), // Equity (Down Payment)
        renterWealth: Math.round(initialCashNeeded), // Cash (Down Payment + Tax)
        ownerEquity: Math.round(homePrice - loanAmount),
        renterSavings: Math.round(initialCashNeeded),
        ownerDebt: Math.round(loanAmount),
    });

    // Monthly investment return rates
    const monthlyInvReturn = Math.pow(1 + investmentReturnRate / 100, 1 / 12) - 1;
    const monthlyAppreciation = Math.pow(1 + appreciationRate / 100, 1 / 12) - 1;

    let currentRentMonthly = initialRentMonthly;

    for (let year = 1; year <= years; year++) {
        // Apply rent increase at the start of each year (except very first month of year 1? 
        // Usually rent increases happen once a year. Let's say it increases AT THE END of the year for next year,
        // or starting from year 2. Let's keep year 1 flat as per input, then increase.)
        if (year > 1) {
            currentRentMonthly = currentRentMonthly * (1 + rentIncreasePercent / 100);
        }

        for (let month = 1; month <= 12; month++) {
            // 1. Owner Costs
            const interestPayment = ownerLoanBalance * monthlyRate;
            const principalPayment = monthlyMortgagePayment - interestPayment;

            let actualMortgagePayment = monthlyMortgagePayment;
            if (ownerLoanBalance <= 0) {
                actualMortgagePayment = 0;
            } else if (ownerLoanBalance < principalPayment) {
                actualMortgagePayment = ownerLoanBalance + interestPayment;
            }

            const ownerTotalMonthlyCost = actualMortgagePayment + maintenanceFeeMonthly;

            // 2. Renter Costs
            const renterTotalMonthlyCost = currentRentMonthly;

            // 3. Difference
            const diff = renterTotalMonthlyCost - ownerTotalMonthlyCost;

            if (diff > 0) {
                ownerInvestments = (ownerInvestments * (1 + monthlyInvReturn)) + diff;
                renterInvestments = (renterInvestments * (1 + monthlyInvReturn));
            } else {
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

    return { yearlyResults: results, monthlyAnalysis };
};
