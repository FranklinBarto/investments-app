import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Home, PiggyBank, CreditCard, Settings } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('investment');
  const [currency, setCurrency] = useState('USD');
  const [showSettings, setShowSettings] = useState(false);
  
  const [principal, setPrincipal] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [years, setYears] = useState(20);
  const [investmentFees, setInvestmentFees] = useState(0.5);
  const [investmentTaxRate, setInvestmentTaxRate] = useState(15);
  
  const [loanAmount, setLoanAmount] = useState(300000);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanYears, setLoanYears] = useState(30);
  const [propertyTax, setPropertyTax] = useState(3000);
  const [homeInsurance, setHomeInsurance] = useState(1200);
  const [hoaFees, setHoaFees] = useState(0);
  
  const [savingsInitial, setSavingsInitial] = useState(5000);
  const [savingsMonthly, setSavingsMonthly] = useState(200);
  const [savingsRate, setSavingsRate] = useState(3);
  const [savingsYears, setSavingsYears] = useState(10);
  const [savingsTaxRate, setSavingsTaxRate] = useState(20);
  const [savingsFees, setSavingsFees] = useState(0);
  
  const [ccBalance, setCcBalance] = useState(5000);
  const [ccRate, setCcRate] = useState(18);
  const [ccPayment, setCcPayment] = useState(150);
  const [ccAnnualFee, setCcAnnualFee] = useState(0);

  const currencies = {
    USD: { symbol: '$', name: 'US Dollar' },
    EUR: { symbol: '€', name: 'Euro' },
    GBP: { symbol: '£', name: 'British Pound' },
    JPY: { symbol: '¥', name: 'Japanese Yen' },
    CAD: { symbol: 'C$', name: 'Canadian Dollar' },
    AUD: { symbol: 'A$', name: 'Australian Dollar' },
    CHF: { symbol: 'CHF', name: 'Swiss Franc' },
    CNY: { symbol: '¥', name: 'Chinese Yuan' },
    INR: { symbol: '₹', name: 'Indian Rupee' }
  };

  const investmentData = useMemo(() => {
    const data = [];
    let balance = principal;
    const monthlyRate = (annualReturn - investmentFees) / 100 / 12;
    
    for (let year = 0; year <= years; year++) {
      const totalContributions = principal + (monthlyContribution * 12 * year);
      const grossEarnings = balance - totalContributions;
      const taxes = grossEarnings > 0 ? grossEarnings * (investmentTaxRate / 100) : 0;
      const netBalance = balance - taxes;
      
      data.push({
        year,
        balance: Math.round(netBalance),
        contributions: Math.round(totalContributions),
        earnings: Math.round(grossEarnings),
        taxes: Math.round(taxes)
      });
      
      if (year < years) {
        for (let month = 0; month < 12; month++) {
          balance = balance * (1 + monthlyRate) + monthlyContribution;
        }
      }
    }
    return data;
  }, [principal, monthlyContribution, annualReturn, years, investmentFees, investmentTaxRate]);

  const mortgageData = useMemo(() => {
    const data = [];
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanYears * 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    const monthlyPropertyTax = propertyTax / 12;
    const monthlyInsurance = homeInsurance / 12;
    const totalMonthlyPayment = monthlyPayment + monthlyPropertyTax + monthlyInsurance + hoaFees;
    
    let remainingBalance = loanAmount;
    let totalInterest = 0;
    let totalExpenses = 0;
    
    for (let year = 0; year <= loanYears; year++) {
      const yearlyExpenses = (propertyTax + homeInsurance + (hoaFees * 12)) * year;
      totalExpenses = yearlyExpenses;
      
      data.push({
        year,
        principal: Math.round(loanAmount - remainingBalance),
        interest: Math.round(totalInterest),
        balance: Math.round(remainingBalance),
        expenses: Math.round(totalExpenses)
      });
      
      if (year < loanYears) {
        for (let month = 0; month < 12; month++) {
          const interestPayment = remainingBalance * monthlyRate;
          const principalPayment = monthlyPayment - interestPayment;
          totalInterest += interestPayment;
          remainingBalance -= principalPayment;
        }
      }
    }
    return { data, monthlyPayment, totalMonthlyPayment };
  }, [loanAmount, interestRate, loanYears, propertyTax, homeInsurance, hoaFees]);

  const savingsData = useMemo(() => {
    const data = [];
    let balance = savingsInitial;
    const monthlyRate = savingsRate / 100 / 12;
    const monthlyFee = savingsFees / 12;
    
    for (let year = 0; year <= savingsYears; year++) {
      const totalDeposits = savingsInitial + (savingsMonthly * 12 * year);
      const feesPaid = savingsFees * year;
      const grossInterest = balance - totalDeposits + feesPaid;
      const taxes = grossInterest > 0 ? grossInterest * (savingsTaxRate / 100) : 0;
      const netBalance = balance - taxes;
      
      data.push({
        year,
        balance: Math.round(netBalance),
        deposits: Math.round(totalDeposits),
        interest: Math.round(grossInterest),
        fees: Math.round(feesPaid),
        taxes: Math.round(taxes)
      });
      
      if (year < savingsYears) {
        for (let month = 0; month < 12; month++) {
          balance = (balance - monthlyFee) * (1 + monthlyRate) + savingsMonthly;
        }
      }
    }
    return data;
  }, [savingsInitial, savingsMonthly, savingsRate, savingsYears, savingsTaxRate, savingsFees]);

  const creditCardData = useMemo(() => {
    const data = [];
    const monthlyRate = ccRate / 100 / 12;
    let balance = ccBalance;
    let totalInterest = 0;
    let totalFees = 0;
    let month = 0;
    
    while (balance > 0 && month <= 120) {
      if (month % 12 === 0) {
        const annualFeesAccrued = Math.floor(month / 12) * ccAnnualFee;
        totalFees = annualFeesAccrued;
        
        data.push({
          year: month / 12,
          balance: Math.round(balance),
          totalPaid: Math.round(ccPayment * month),
          interest: Math.round(totalInterest),
          fees: Math.round(totalFees)
        });
        
        if (month > 0 && month % 12 === 0) {
          balance += ccAnnualFee;
        }
      }
      
      const interestCharge = balance * monthlyRate;
      totalInterest += interestCharge;
      balance = balance + interestCharge - ccPayment;
      month++;
    }
    
    if (balance <= 0) {
      const annualFeesAccrued = Math.floor(month / 12) * ccAnnualFee;
      totalFees = annualFeesAccrued;
      data.push({
        year: month / 12,
        balance: 0,
        totalPaid: Math.round(ccPayment * month),
        interest: Math.round(totalInterest),
        fees: Math.round(totalFees)
      });
    }
    
    return { data, months: month };
  }, [ccBalance, ccRate, ccPayment, ccAnnualFee]);

  const formatCurrency = (value) => {
    const isYen = currency === 'JPY';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: isYen ? 0 : 0,
      maximumFractionDigits: isYen ? 0 : 0
    }).format(value);
  };

  const EditableValue = ({ value, onChange, min = 0, max = 1000000, isPercentage = false, suffix = '' }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');

    const handleClick = () => {
      setIsEditing(true);
      setEditValue(value.toString());
    };

    const handleBlur = () => {
      const numValue = parseFloat(editValue);
      if (!isNaN(numValue) && numValue >= min && numValue <= max) {
        onChange(numValue);
      }
      setIsEditing(false);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleBlur();
      } else if (e.key === 'Escape') {
        setIsEditing(false);
      }
    };

    if (isEditing) {
      return (
        <input
          type="number"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="inline-block w-24 px-2 py-1 border border-indigo-500 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      );
    }

    return (
      <span
        onClick={handleClick}
        className="cursor-pointer hover:bg-indigo-50 px-2 py-1 rounded transition-colors border-b-2 border-dotted border-indigo-300"
        title="Click to edit"
      >
        {isPercentage ? value : formatCurrency(value)}{suffix}
      </span>
    );
  };

  const tabs = [
    { id: 'investment', label: 'Investment Growth', icon: TrendingUp },
    { id: 'mortgage', label: 'Mortgage', icon: Home },
    { id: 'savings', label: 'Savings', icon: PiggyBank },
    { id: 'credit', label: 'Credit Card', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Financial Calculator Suite</h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>

        {showSettings && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Global Settings</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {Object.entries(currencies).map(([code, { name, symbol }]) => (
                  <option key={code} value={code}>{symbol} - {name} ({code})</option>
                ))}
              </select>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-lg mb-6 p-2">
          <div className="flex space-x-2">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeTab === id ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'investment' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Investment Growth Calculator</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Investment: <EditableValue value={principal} onChange={setPrincipal} max={1000000} />
                  </label>
                  <input type="range" min="0" max="100000" step="1000" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Contribution: <EditableValue value={monthlyContribution} onChange={setMonthlyContribution} max={10000} />
                  </label>
                  <input type="range" min="0" max="2000" step="50" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Return: <EditableValue value={annualReturn} onChange={setAnnualReturn} max={30} isPercentage={true} suffix="%" />
                  </label>
                  <input type="range" min="0" max="15" step="0.5" value={annualReturn} onChange={(e) => setAnnualReturn(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Period: <EditableValue value={years} onChange={setYears} max={50} isPercentage={true} suffix=" years" />
                  </label>
                  <input type="range" min="1" max="40" step="1" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Fees: <EditableValue value={investmentFees} onChange={setInvestmentFees} max={5} isPercentage={true} suffix="%" />
                  </label>
                  <input type="range" min="0" max="3" step="0.1" value={investmentFees} onChange={(e) => setInvestmentFees(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capital Gains Tax: <EditableValue value={investmentTaxRate} onChange={setInvestmentTaxRate} max={50} isPercentage={true} suffix="%" />
                  </label>
                  <input type="range" min="0" max="40" step="1" value={investmentTaxRate} onChange={(e) => setInvestmentTaxRate(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Net Balance</p>
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(investmentData[investmentData.length - 1].balance)}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Contributions</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(investmentData[investmentData.length - 1].contributions)}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Earnings</p>
                  <p className="text-xl font-bold text-purple-600">{formatCurrency(investmentData[investmentData.length - 1].earnings)}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Taxes</p>
                  <p className="text-xl font-bold text-red-600">{formatCurrency(investmentData[investmentData.length - 1].taxes)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Growth Over Time</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={investmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                  <YAxis tickFormatter={(value) => `${currencies[currency].symbol}${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="balance" stroke="#4f46e5" strokeWidth={2} name="Net Balance" />
                  <Line type="monotone" dataKey="contributions" stroke="#10b981" strokeWidth={2} name="Contributions" />
                  <Line type="monotone" dataKey="earnings" stroke="#8b5cf6" strokeWidth={2} name="Earnings" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'mortgage' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Mortgage Calculator</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Amount: <EditableValue value={loanAmount} onChange={setLoanAmount} max={5000000} />
                  </label>
                  <input type="range" min="50000" max="1000000" step="10000" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate: <EditableValue value={interestRate} onChange={setInterestRate} max={20} isPercentage={true} suffix="%" />
                  </label>
                  <input type="range" min="2" max="10" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Term: <EditableValue value={loanYears} onChange={setLoanYears} max={40} isPercentage={true} suffix=" years" />
                  </label>
                  <input type="range" min="5" max="30" step="5" value={loanYears} onChange={(e) => setLoanYears(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Property Tax: <EditableValue value={propertyTax} onChange={setPropertyTax} max={50000} />
                  </label>
                  <input type="range" min="0" max="15000" step="500" value={propertyTax} onChange={(e) => setPropertyTax(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Home Insurance: <EditableValue value={homeInsurance} onChange={setHomeInsurance} max={10000} />
                  </label>
                  <input type="range" min="0" max="5000" step="100" value={homeInsurance} onChange={(e) => setHomeInsurance(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly HOA Fees: <EditableValue value={hoaFees} onChange={setHoaFees} max={1000} />
                  </label>
                  <input type="range" min="0" max="500" step="25" value={hoaFees} onChange={(e) => setHoaFees(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Monthly Payment</p>
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(mortgageData.monthlyPayment)}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Monthly</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(mortgageData.totalMonthlyPayment)}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Interest</p>
                  <p className="text-xl font-bold text-orange-600">{formatCurrency(mortgageData.data[mortgageData.data.length - 1].interest)}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="text-xl font-bold text-purple-600">{formatCurrency(mortgageData.data[mortgageData.data.length - 1].expenses)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Loan Breakdown Over Time</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={mortgageData.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                  <YAxis tickFormatter={(value) => `${currencies[currency].symbol}${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="balance" stroke="#ef4444" strokeWidth={2} name="Remaining Balance" />
                  <Line type="monotone" dataKey="principal" stroke="#10b981" strokeWidth={2} name="Principal Paid" />
                  <Line type="monotone" dataKey="interest" stroke="#f97316" strokeWidth={2} name="Interest Paid" />
                  <Line type="monotone" dataKey="expenses" stroke="#8b5cf6" strokeWidth={2} name="Total Expenses" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'savings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Savings Calculator</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Deposit: <EditableValue value={savingsInitial} onChange={setSavingsInitial} max={500000} />
                  </label>
                  <input type="range" min="0" max="50000" step="1000" value={savingsInitial} onChange={(e) => setSavingsInitial(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Deposit: <EditableValue value={savingsMonthly} onChange={setSavingsMonthly} max={10000} />
                  </label>
                  <input type="range" min="0" max="1000" step="25" value={savingsMonthly} onChange={(e) => setSavingsMonthly(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate: <EditableValue value={savingsRate} onChange={setSavingsRate} max={20} isPercentage={true} suffix="%" />
                  </label>
                  <input type="range" min="0" max="8" step="0.25" value={savingsRate} onChange={(e) => setSavingsRate(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Period: <EditableValue value={savingsYears} onChange={setSavingsYears} max={50} isPercentage={true} suffix=" years" />
                  </label>
                  <input type="range" min="1" max="30" step="1" value={savingsYears} onChange={(e) => setSavingsYears(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Fees: <EditableValue value={savingsFees} onChange={setSavingsFees} max={500} />
                  </label>
                  <input type="range" min="0" max="200" step="10" value={savingsFees} onChange={(e) => setSavingsFees(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Tax Rate: <EditableValue value={savingsTaxRate} onChange={setSavingsTaxRate} max={50} isPercentage={true} suffix="%" />
                  </label>
                  <input type="range" min="0" max="40" step="1" value={savingsTaxRate} onChange={(e) => setSavingsTaxRate(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Net Balance</p>
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(savingsData[savingsData.length - 1].balance)}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Deposits</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(savingsData[savingsData.length - 1].deposits)}</p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Interest Earned</p>
                  <p className="text-xl font-bold text-teal-600">{formatCurrency(savingsData[savingsData.length - 1].interest)}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Taxes + Fees</p>
                  <p className="text-xl font-bold text-red-600">{formatCurrency(savingsData[savingsData.length - 1].taxes + savingsData[savingsData.length - 1].fees)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Savings Growth</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={savingsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                  <YAxis tickFormatter={(value) => `${currencies[currency].symbol}${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="balance" stroke="#4f46e5" strokeWidth={2} name="Net Balance" />
                  <Line type="monotone" dataKey="deposits" stroke="#10b981" strokeWidth={2} name="Deposits" />
                  <Line type="monotone" dataKey="interest" stroke="#14b8a6" strokeWidth={2} name="Interest" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'credit' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Credit Card Payoff Calculator</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Balance: <EditableValue value={ccBalance} onChange={setCcBalance} max={100000} />
                  </label>
                  <input type="range" min="1000" max="50000" step="500" value={ccBalance} onChange={(e) => setCcBalance(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate (APR): <EditableValue value={ccRate} onChange={setCcRate} max={40} isPercentage={true} suffix="%" />
                  </label>
                  <input type="range" min="10" max="30" step="0.5" value={ccRate} onChange={(e) => setCcRate(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Payment: <EditableValue value={ccPayment} onChange={setCcPayment} max={10000} />
                  </label>
                  <input type="range" min="50" max="2000" step="25" value={ccPayment} onChange={(e) => setCcPayment(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Fee: <EditableValue value={ccAnnualFee} onChange={setCcAnnualFee} max={1000} />
                  </label>
                  <input type="range" min="0" max="500" step="25" value={ccAnnualFee} onChange={(e) => setCcAnnualFee(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Payoff Time</p>
                  <p className="text-xl font-bold text-blue-600">{creditCardData.months} months</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Interest</p>
                  <p className="text-xl font-bold text-orange-600">{formatCurrency(creditCardData.data[creditCardData.data.length - 1].interest)}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Annual Fees</p>
                  <p className="text-xl font-bold text-purple-600">{formatCurrency(creditCardData.data[creditCardData.data.length - 1].fees)}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Paid</p>
                  <p className="text-xl font-bold text-red-600">{formatCurrency(creditCardData.data[creditCardData.data.length - 1].totalPaid)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Payoff Progress</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={creditCardData.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                  <YAxis tickFormatter={(value) => `${currencies[currency].symbol}${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="balance" stroke="#ef4444" strokeWidth={2} name="Remaining Balance" />
                  <Line type="monotone" dataKey="totalPaid" stroke="#10b981" strokeWidth={2} name="Total Paid" />
                  <Line type="monotone" dataKey="interest" stroke="#f97316" strokeWidth={2} name="Interest Paid" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;