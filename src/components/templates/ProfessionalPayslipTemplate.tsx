import React from 'react';

interface EmployeeData {
  [key: string]: any;
  'EMPLOYEE NAME': string;
  'EMPLOYEE ID': string;
  'NET PAY': number;
  'GROSS SALARY': number;
  'TOTAL DEDUCTIONS': number;
  'EARNED BASIC': number;
  'HRA': number;
  'LOCAN CONVEY': number;
  'MEDICAL ALLOW': number;
  'CITY COMPENSATORY ALLOWANCE (CCA)': number;
  'CHILDREN EDUCATION ALLOWANCE (CEA)': number;
  'OTHER ALLOWANCE': number;
  'INCENTIVE': number;
  'PF': number;
  'ESI': number;
  'TDS': number;
  'PT': number;
  'STAFF WELFARE': number;
  'SALARY ADVANCE': number;
  'TOTAL DAYS': number;
  'PRESENT DAYS': number;
  'SALARY DAYS': number;
  'LOP': number;
  'DESIGNATION': string;
  'DEPARTMENT': string;
  'BRANCH': string;
  'PF NO': string;
  'ESI NO': string;
  'UAN': string;
  'DOJ': string;
  'AS ON': string;
  'STATUS': string;
}

interface ProfessionalPayslipTemplateProps {
  employee: EmployeeData;
  processedLogoUrl: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount || 0);
};

const formatMonthYear = (dateString: string) => {
  if (!dateString) return 'N/A';
  
  let date;
  if (dateString.includes('/')) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
  } else if (dateString.includes('-')) {
    date = new Date(dateString);
  } else {
    date = new Date(dateString);
  }
  
  if (date && !isNaN(date.getTime())) {
    return date.toLocaleDateString('en-IN', { 
      month: 'long', 
      year: 'numeric' 
    });
  }
  
  return dateString;
};

// Helper method to convert number to words (simplified version)
const convertToWords = (num: number): string => {
  if (num === 0) return "Zero";
  
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  
  const convertHundreds = (n: number): string => {
    let result = "";
    if (n > 99) {
      result += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n > 19) {
      result += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    } else if (n > 9) {
      result += teens[n - 10] + " ";
      return result;
    }
    if (n > 0) {
      result += ones[n] + " ";
    }
    return result;
  };
  
  let result = "";
  let crore = Math.floor(num / 10000000);
  if (crore > 0) {
    result += convertHundreds(crore) + "Crore ";
    num %= 10000000;
  }
  
  let lakh = Math.floor(num / 100000);
  if (lakh > 0) {
    result += convertHundreds(lakh) + "Lakh ";
    num %= 100000;
  }
  
  let thousand = Math.floor(num / 1000);
  if (thousand > 0) {
    result += convertHundreds(thousand) + "Thousand ";
    num %= 1000;
  }
  
  if (num > 0) {
    result += convertHundreds(num);
  }
  
  return result.trim();
};

const ProfessionalPayslipTemplate = React.forwardRef<HTMLDivElement, ProfessionalPayslipTemplateProps>(
  ({ employee, processedLogoUrl }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white"
        style={{ 
          width: '794px', 
          height: '1123px',
          fontSize: '12px', 
          lineHeight: '1.4', 
          fontFamily: "'Times New Roman', serif",
          border: '1px solid #000'
        }} 
      >
        <div className="h-full" style={{ padding: '40px' }}>
          {/* Header with Logo and Company Name */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              {processedLogoUrl && (
                <img 
                  src={processedLogoUrl}
                  alt="Company Logo"
                  className="w-16 h-16 object-contain mr-4"
                />
              )}
              <div>
                <h1 
                  className="text-blue-900 mb-1"
                  style={{ 
                    fontSize: '20px',
                    fontWeight: 'bold',
                    letterSpacing: '2px',
                    fontFamily: "'Times New Roman', serif"
                  }}
                >
                  NAVACHETANA VIVIDODDESHA SOUHARDA SAHAKARI NIYAMIT
                </h1>
                <p 
                  className="text-gray-700"
                  style={{ 
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  HITAISHI PALACE,SHIRUR GROUP BUILDING P B ROAD,HAVERI.
                </p>
                <p 
                  className="text-gray-700"
                  style={{ 
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  HAVERI - 581110, KARNATAKA
                </p>
              </div>
            </div>
            
            <div 
              className="bg-gray-100 py-2 px-4 rounded"
              style={{ 
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#333',
                border: '1px solid #ccc'
              }}
            >
              Payslip for {formatMonthYear(employee['AS ON'])}
            </div>
          </div>

          {/* Employee Information Grid */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-3">
                <div className="flex">
                  <span 
                    className="font-bold w-32 text-gray-700"
                    style={{ fontSize: '11px' }}
                  >
                    Employee Code
                  </span>
                  <span className="mx-2">:</span>
                  <span style={{ fontSize: '11px' }}>{employee['EMPLOYEE ID']}</span>
                </div>
                <div className="flex">
                  <span 
                    className="font-bold w-32 text-gray-700"
                    style={{ fontSize: '11px' }}
                  >
                    Name
                  </span>
                  <span className="mx-2">:</span>
                  <span style={{ fontSize: '11px', fontWeight: '600' }}>{employee['EMPLOYEE NAME']}</span>
                </div>
                <div className="flex">
                  <span 
                    className="font-bold w-32 text-gray-700"
                    style={{ fontSize: '11px' }}
                  >
                    Designation
                  </span>
                  <span className="mx-2">:</span>
                  <span style={{ fontSize: '11px' }}>{employee['DESIGNATION']}</span>
                </div>
                <div className="flex">
                  <span 
                    className="font-bold w-32 text-gray-700"
                    style={{ fontSize: '11px' }}
                  >
                    Department
                  </span>
                  <span className="mx-2">:</span>
                  <span style={{ fontSize: '11px' }}>{employee['DEPARTMENT']}</span>
                </div>
                <div className="flex">
                  <span 
                    className="font-bold w-32 text-gray-700"
                    style={{ fontSize: '11px' }}
                  >
                    Gender
                  </span>
                  <span className="mx-2">:</span>
                  <span style={{ fontSize: '11px' }}>Male</span>
                </div>
                <div className="flex">
                  <span 
                    className="font-bold w-32 text-gray-700"
                    style={{ fontSize: '11px' }}
                  >
                    Date of Birth
                  </span>
                  <span className="mx-2">:</span>
                  <span style={{ fontSize: '11px' }}>02-Jul-1992</span>
                </div>
                <div className="flex">
                  <span 
                    className="font-bold w-32 text-gray-700"
                    style={{ fontSize: '11px' }}
                  >
                    Date of Joining
                  </span>
                  <span className="mx-2">:</span>
                  <span style={{ fontSize: '11px' }}>{employee['DOJ']}</span>
                </div>
                <div className="flex">
                  <span 
                    className="font-bold w-32 text-gray-700"
                    style={{ fontSize: '11px' }}
                  >
                    Attendance: Base,Elig
                  </span>
                  <span className="mx-2">:</span>
                  <span style={{ fontSize: '11px' }}>{employee['TOTAL DAYS']}.00, {employee['PRESENT DAYS']}.00</span>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                <div className="flex">
                  <span 
                    className="font-bold w-32 text-gray-700"
                    style={{ fontSize: '11px' }}
                  >
                    Bank
                  </span>
                  <span className="mx-2">:</span>
                  <span style={{ fontSize: '11px' }}>UJJIVAN SMALL FINANCE BANK</span>
                </div>
                <div className="flex">
                  <span 
                    className="font-bold w-32 text-gray-700"
                    style={{ fontSize: '11px' }}
                  >
                    Bank A/C No.
                  </span>
                  <span className="mx-2">:</span>
                  <span style={{ fontSize: '11px' }}>113111008005134</span>
                </div>
                <div className="flex">
                  <span 
                    className="font-bold w-32 text-gray-700"
                    style={{ fontSize: '11px' }}
                  >
                    Location
                  </span>
                  <span className="mx-2">:</span>
                  <span style={{ fontSize: '11px' }}>HAVERI</span>
                </div>
                <div className="flex">
                  <span 
                    className="font-bold w-32 text-gray-700"
                    style={{ fontSize: '11px' }}
                  >
                    PAN
                  </span>
                  <span className="mx-2">:</span>
                  <span style={{ fontSize: '11px' }}>DZXPM7034M</span>
                </div>
                <div className="flex">
                  <span 
                    className="font-bold w-32 text-gray-700"
                    style={{ fontSize: '11px' }}
                  >
                    UAN
                  </span>
                  <span className="mx-2">:</span>
                  <span style={{ fontSize: '11px' }}>{employee['UAN']}</span>
                </div>
                <div className="flex">
                  <span 
                    className="font-bold w-32 text-gray-700"
                    style={{ fontSize: '11px' }}
                  >
                    PF A/C No.
                  </span>
                  <span className="mx-2">:</span>
                  <span style={{ fontSize: '11px' }}>{employee['PF NO']}</span>
                </div>
                <div className="flex">
                  <span 
                    className="font-bold w-32 text-gray-700"
                    style={{ fontSize: '11px' }}
                  >
                    ESI No.
                  </span>
                  <span className="mx-2">:</span>
                  <span style={{ fontSize: '11px' }}>{employee['ESI NO']}</span>
                </div>
                <div className="flex">
                  <span 
                    className="font-bold w-32 text-gray-700"
                    style={{ fontSize: '11px' }}
                  >
                    Previous Period LOP, LOP Reversal Days
                  </span>
                  <span className="mx-2">:</span>
                  <span style={{ fontSize: '11px' }}>{employee['LOP']}.0, 0.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Salary Table */}
          <div className="mb-8">
            <table className="w-full border-collapse border border-black">
              <thead>
                <tr className="bg-teal-500 text-white">
                  <th 
                    className="border border-black p-2 text-left font-bold"
                    style={{ fontSize: '12px' }}
                  >
                    Earnings
                  </th>
                  <th 
                    className="border border-black p-2 text-center font-bold"
                    style={{ fontSize: '12px' }}
                  >
                    Fixed Amount
                  </th>
                  <th 
                    className="border border-black p-2 text-center font-bold"
                    style={{ fontSize: '12px' }}
                  >
                    Earning Amount
                  </th>
                  <th 
                    className="border border-black p-2 text-left font-bold"
                    style={{ fontSize: '12px' }}
                  >
                    Deductions
                  </th>
                  <th 
                    className="border border-black p-2 text-center font-bold"
                    style={{ fontSize: '12px' }}
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Basic Salary Row */}
                <tr>
                  <td 
                    className="border border-black p-2"
                    style={{ fontSize: '11px' }}
                  >
                    Basic
                  </td>
                  <td 
                    className="border border-black p-2 text-right"
                    style={{ fontSize: '11px' }}
                  >
                    {employee['EARNED BASIC'].toFixed(2)}
                  </td>
                  <td 
                    className="border border-black p-2 text-right"
                    style={{ fontSize: '11px' }}
                  >
                    {employee['EARNED BASIC'].toFixed(2)}
                  </td>
                  <td 
                    className="border border-black p-2"
                    style={{ fontSize: '11px' }}
                  >
                    Employees StateInsurance
                  </td>
                  <td 
                    className="border border-black p-2 text-right"
                    style={{ fontSize: '11px' }}
                  >
                    {employee['ESI'].toFixed(2)}
                  </td>
                </tr>
                
                {/* HRA Row */}
                <tr>
                  <td 
                    className="border border-black p-2"
                    style={{ fontSize: '11px' }}
                  >
                    HouseRentAllowance
                  </td>
                  <td 
                    className="border border-black p-2 text-right"
                    style={{ fontSize: '11px' }}
                  >
                    {employee['HRA'].toFixed(2)}
                  </td>
                  <td 
                    className="border border-black p-2 text-right"
                    style={{ fontSize: '11px' }}
                  >
                    {employee['HRA'].toFixed(2)}
                  </td>
                  <td 
                    className="border border-black p-2"
                    style={{ fontSize: '11px' }}
                  >
                    Staff Welfare Fund
                  </td>
                  <td 
                    className="border border-black p-2 text-right"
                    style={{ fontSize: '11px' }}
                  >
                    {employee['STAFF WELFARE'].toFixed(2)}
                  </td>
                </tr>
                
                {/* Conveyance Row */}
                <tr>
                  <td 
                    className="border border-black p-2"
                    style={{ fontSize: '11px' }}
                  >
                    Local ConveyanceAllowance
                  </td>
                  <td 
                    className="border border-black p-2 text-right"
                    style={{ fontSize: '11px' }}
                  >
                    {employee['LOCAN CONVEY'].toFixed(2)}
                  </td>
                  <td 
                    className="border border-black p-2 text-right"
                    style={{ fontSize: '11px' }}
                  >
                    {employee['LOCAN CONVEY'].toFixed(2)}
                  </td>
                  <td 
                    className="border border-black p-2"
                    style={{ fontSize: '11px' }}
                  >
                    Staff Security Deposit
                  </td>
                  <td 
                    className="border border-black p-2 text-right"
                    style={{ fontSize: '11px' }}
                  >
                    200.00
                  </td>
                </tr>
                
                {/* Medical Row */}
                <tr>
                  <td 
                    className="border border-black p-2"
                    style={{ fontSize: '11px' }}
                  >
                    MedicalAllowance
                  </td>
                  <td 
                    className="border border-black p-2 text-right"
                    style={{ fontSize: '11px' }}
                  >
                    {employee['MEDICAL ALLOW'].toFixed(2)}
                  </td>
                  <td 
                    className="border border-black p-2 text-right"
                    style={{ fontSize: '11px' }}
                  >
                    {employee['MEDICAL ALLOW'].toFixed(2)}
                  </td>
                  <td 
                    className="border border-black p-2"
                    style={{ fontSize: '11px' }}
                  >
                    ProfessionalTax
                  </td>
                  <td 
                    className="border border-black p-2 text-right"
                    style={{ fontSize: '11px' }}
                  >
                    {employee['PT'].toFixed(2)}
                  </td>
                </tr>
                
                {/* Incentive Pay Row */}
                <tr>
                  <td 
                    className="border border-black p-2"
                    style={{ fontSize: '11px' }}
                  >
                    Incentive Pay
                  </td>
                  <td 
                    className="border border-black p-2 text-right"
                    style={{ fontSize: '11px' }}
                  >
                  </td>
                  <td 
                    className="border border-black p-2 text-right"
                    style={{ fontSize: '11px' }}
                  >
                    {employee['INCENTIVE'].toFixed(2)}
                  </td>
                  <td 
                    className="border border-black p-2"
                    style={{ fontSize: '11px' }}
                  >
                    ProvidentFund
                  </td>
                  <td 
                    className="border border-black p-2 text-right"
                    style={{ fontSize: '11px' }}
                  >
                    {employee['PF'].toFixed(2)}
                  </td>
                </tr>
                
                {/* Totals Row */}
                <tr className="bg-teal-500 text-white font-bold">
                  <td 
                    className="border border-black p-2"
                    style={{ fontSize: '12px' }}
                  >
                    Total Earnings
                  </td>
                  <td 
                    className="border border-black p-2 text-right"
                    style={{ fontSize: '12px' }}
                  >
                    {(employee['EARNED BASIC'] + employee['HRA'] + employee['LOCAN CONVEY'] + employee['MEDICAL ALLOW']).toFixed(2)}
                  </td>
                  <td 
                    className="border border-black p-2 text-right"
                    style={{ fontSize: '12px' }}
                  >
                    {employee['GROSS SALARY'].toFixed(2)}
                  </td>
                  <td 
                    className="border border-black p-2"
                    style={{ fontSize: '12px' }}
                  >
                    Total Deductions
                  </td>
                  <td 
                    className="border border-black p-2 text-right"
                    style={{ fontSize: '12px' }}
                  >
                    {employee['TOTAL DEDUCTIONS'].toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Net Salary */}
          <div className="mb-8">
            <div 
              className="text-left p-4 font-bold"
              style={{ 
                fontSize: '14px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #ccc'
              }}
            >
              Net Salary : {formatCurrency(employee['NET PAY'])} (Rupees {convertToWords(employee['NET PAY'])})
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8">
            <p 
              className="text-gray-700 text-justify"
              style={{ 
                fontSize: '10px',
                lineHeight: '1.4'
              }}
            >
              <strong>Note :</strong> This is system generated payslip signature or company seal not required, your salary is confidential and should not be shared with other colleague.
            </p>
          </div>

          {/* Page Footer */}
          <div className="absolute bottom-8 left-8 right-8 flex justify-between text-gray-500" style={{ fontSize: '10px' }}>
            <span>Page 1 of 1</span>
            <span>Downloaded On {new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString('en-GB', { hour12: true })}</span>
          </div>
        </div>
      </div>
    );
  }
);

ProfessionalPayslipTemplate.displayName = 'ProfessionalPayslipTemplate';

export default ProfessionalPayslipTemplate;
