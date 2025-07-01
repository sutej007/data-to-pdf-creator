
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
  'DOB'?: string;
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
  if (!dateString) {
    const now = new Date();
    return now.toLocaleDateString('en-IN', { 
      month: 'long', 
      year: 'numeric' 
    });
  }
  
  // Handle various date formats from Excel
  let date;
  
  // Check if it's already in Month Year format (e.g., "FEB 2023" or "February 2023")
  if (dateString.match(/^[A-Za-z]{3,9}\s+\d{4}$/)) {
    // If it's in short format like "FEB 2023", convert to full month name
    const parts = dateString.trim().split(/\s+/);
    if (parts.length === 2) {
      const monthAbbr = parts[0].toUpperCase();
      const year = parts[1];
      
      const monthMap: {[key: string]: string} = {
        'JAN': 'January', 'FEB': 'February', 'MAR': 'March', 'APR': 'April',
        'MAY': 'May', 'JUN': 'June', 'JUL': 'July', 'AUG': 'August',
        'SEP': 'September', 'OCT': 'October', 'NOV': 'November', 'DEC': 'December'
      };
      
      return `${monthMap[monthAbbr] || monthAbbr} ${year}`;
    }
    return dateString;
  }
  
  // Handle DD/MM/YYYY format
  if (dateString.includes('/')) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      // Assuming DD/MM/YYYY format
      date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
  } 
  // Handle YYYY-MM-DD format
  else if (dateString.includes('-')) {
    date = new Date(dateString);
  } 
  // Handle Excel serial date number
  else if (!isNaN(Number(dateString))) {
    // Excel date serial number (days since 1900-01-01)
    const excelEpoch = new Date(1900, 0, 1);
    date = new Date(excelEpoch.getTime() + (Number(dateString) - 2) * 24 * 60 * 60 * 1000);
  }
  else {
    date = new Date(dateString);
  }
  
  if (date && !isNaN(date.getTime())) {
    return date.toLocaleDateString('en-IN', { 
      month: 'long', 
      year: 'numeric' 
    });
  }
  
  // Fallback to current month/year
  const now = new Date();
  return now.toLocaleDateString('en-IN', { 
    month: 'long', 
    year: 'numeric' 
  });
};

const formatDateOfJoining = (dateString: string) => {
  if (!dateString) return '01-Jan-2020';
  
  let date;
  
  // Handle DD/MM/YYYY format
  if (dateString.includes('/')) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      // Assuming DD/MM/YYYY format
      date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
  } 
  // Handle YYYY-MM-DD format
  else if (dateString.includes('-')) {
    date = new Date(dateString);
  } 
  // Handle Excel serial date number
  else if (!isNaN(Number(dateString))) {
    // Excel date serial number (days since 1900-01-01)
    const excelEpoch = new Date(1900, 0, 1);
    date = new Date(excelEpoch.getTime() + (Number(dateString) - 2) * 24 * 60 * 60 * 1000);
  }
  else {
    date = new Date(dateString);
  }
  
  if (date && !isNaN(date.getTime())) {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
  
  return '01-Jan-2020';
};

const formatDateOfBirth = (dateString: string) => {
  if (!dateString) return '';
  
  let date;
  
  // Handle DD/MM/YYYY format
  if (dateString.includes('/')) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      // Assuming DD/MM/YYYY format
      date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
  } 
  // Handle YYYY-MM-DD format
  else if (dateString.includes('-')) {
    date = new Date(dateString);
  } 
  // Handle Excel serial date number
  else if (!isNaN(Number(dateString))) {
    // Excel date serial number (days since 1900-01-01)
    const excelEpoch = new Date(1900, 0, 1);
    date = new Date(excelEpoch.getTime() + (Number(dateString) - 2) * 24 * 60 * 60 * 1000);
  }
  else {
    date = new Date(dateString);
  }
  
  if (date && !isNaN(date.getTime())) {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
  
  return '';
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
          fontSize: '11px', 
          lineHeight: '1.3', 
          fontFamily: "Arial, sans-serif",
          padding: '30px',
          color: '#333'
        }} 
      >
        {/* Header with Logo and Company Name */}
        <div className="text-center mb-6">
          <div className="flex items-start justify-center mb-4">
            {processedLogoUrl && (
              <img 
                src={processedLogoUrl}
                alt="Company Logo"
                className="w-20 h-20 object-contain mr-4 mt-2"
              />
            )}
            <div className="text-center">
              <h1 
                className="text-blue-900 font-bold mb-1"
                style={{ 
                  fontSize: '18px',
                  letterSpacing: '1px',
                  lineHeight: '1.2'
                }}
              >
                NAVACHETANA VIVIDODDESHA SOUHARDA SAHAKARI NIYAMIT
              </h1>
              <p 
                className="text-gray-700 text-xs mb-1"
                style={{ fontSize: '10px' }}
              >
                HITAISHI PALACE,SHIRUR GROUP BUILDING P B ROAD,HAVERI.
              </p>
              <p 
                className="text-gray-700 text-xs"
                style={{ fontSize: '10px' }}
              >
                HAVERI - 581110, KARNATAKA
              </p>
            </div>
          </div>
          
          <div 
            className="text-center py-2 mb-6"
            style={{ 
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#333'
            }}
          >
            Payslip for {formatMonthYear(employee['AS ON'])}
          </div>
        </div>

        {/* Employee Information Grid */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-12" style={{ fontSize: '10px' }}>
            {/* Left Column */}
            <div className="space-y-2">
              <div className="flex">
                <span className="font-semibold w-28">Employee Code</span>
                <span className="mx-2">:</span>
                <span>{employee['EMPLOYEE ID']}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-28">Name</span>
                <span className="mx-2">:</span>
                <span className="font-semibold">{employee['EMPLOYEE NAME']}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-28">Designation</span>
                <span className="mx-2">:</span>
                <span>{employee['DESIGNATION'] || 'Staff'}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-28">Department</span>
                <span className="mx-2">:</span>
                <span>{employee['DEPARTMENT'] || 'General'}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-28">Gender</span>
                <span className="mx-2">:</span>
                <span>Male</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-28">Date of Birth</span>
                <span className="mx-2">:</span>
                <span>{formatDateOfBirth(employee['DOB'])}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-28">Date of Joining</span>
                <span className="mx-2">:</span>
                <span>{formatDateOfJoining(employee['DOJ'])}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-28">Attendance: Base,Elig</span>
                <span className="mx-2">:</span>
                <span>{employee['TOTAL DAYS'] || 30}.00, {employee['PRESENT DAYS'] || 30}.00</span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-2">
              <div className="flex">
                <span className="font-semibold w-32">Bank</span>
                <span className="mx-2">:</span>
                <span>UJJIVAN SMALL FINANCE BANK</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-32">Bank A/C No.</span>
                <span className="mx-2">:</span>
                <span>113111008005134</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-32">Location</span>
                <span className="mx-2">:</span>
                <span>{employee['BRANCH'] || 'HAVERI'}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-32">PAN</span>
                <span className="mx-2">:</span>
                <span>DZXPM7034M</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-32">UAN</span>
                <span className="mx-2">:</span>
                <span>{employee['UAN'] || '100123456789'}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-32">PF A/C No.</span>
                <span className="mx-2">:</span>
                <span>{employee['PF NO'] || 'KA/HVR/12345/123456'}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-32">ESI No.</span>
                <span className="mx-2">:</span>
                <span>{employee['ESI NO'] || '1234567890'}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-32">Previous Period LOP, LOP Reversal Days</span>
                <span className="mx-2">:</span>
                <span>{employee['LOP'] || 0}.0, 0.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Salary Table */}
        <div className="mb-6">
          <table className="w-full border-collapse" style={{ border: '1px solid #333' }}>
            <thead>
              <tr style={{ backgroundColor: '#4a9b9b', color: 'white' }}>
                <th 
                  className="p-2 text-left font-bold border-r border-white"
                  style={{ fontSize: '11px', border: '1px solid #333' }}
                >
                  Earnings
                </th>
                <th 
                  className="p-2 text-center font-bold border-r border-white"
                  style={{ fontSize: '11px', border: '1px solid #333' }}
                >
                  Fixed Amount
                </th>
                <th 
                  className="p-2 text-center font-bold border-r border-white"
                  style={{ fontSize: '11px', border: '1px solid #333' }}
                >
                  Earning Amount
                </th>
                <th 
                  className="p-2 text-left font-bold border-r border-white"
                  style={{ fontSize: '11px', border: '1px solid #333' }}
                >
                  Deductions
                </th>
                <th 
                  className="p-2 text-center font-bold"
                  style={{ fontSize: '11px', border: '1px solid #333' }}
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '10px' }}>
              <tr>
                <td className="p-2" style={{ border: '1px solid #333' }}>Basic</td>
                <td className="p-2 text-right" style={{ border: '1px solid #333' }}>
                  {(employee['EARNED BASIC'] || 6500).toFixed(2)}
                </td>
                <td className="p-2 text-right" style={{ border: '1px solid #333' }}>
                  {(employee['EARNED BASIC'] || 6500).toFixed(2)}
                </td>
                <td className="p-2" style={{ border: '1px solid #333' }}>Employees StateInsurance</td>
                <td className="p-2 text-right" style={{ border: '1px solid #333' }}>
                  {(employee['ESI'] || 105).toFixed(2)}
                </td>
              </tr>
              
              <tr>
                <td className="p-2" style={{ border: '1px solid #333' }}>HouseRentAllowance</td>
                <td className="p-2 text-right" style={{ border: '1px solid #333' }}>
                  {(employee['HRA'] || 1000).toFixed(2)}
                </td>
                <td className="p-2 text-right" style={{ border: '1px solid #333' }}>
                  {(employee['HRA'] || 1000).toFixed(2)}
                </td>
                <td className="p-2" style={{ border: '1px solid #333' }}>Staff Welfare Fund</td>
                <td className="p-2 text-right" style={{ border: '1px solid #333' }}>
                  {(employee['STAFF WELFARE'] || 100).toFixed(2)}
                </td>
              </tr>
              
              <tr>
                <td className="p-2" style={{ border: '1px solid #333' }}>Local ConveyanceAllowance</td>
                <td className="p-2 text-right" style={{ border: '1px solid #333' }}>
                  {(employee['LOCAN CONVEY'] || 500).toFixed(2)}
                </td>
                <td className="p-2 text-right" style={{ border: '1px solid #333' }}>
                  {(employee['LOCAN CONVEY'] || 500).toFixed(2)}
                </td>
                <td className="p-2" style={{ border: '1px solid #333' }}>Staff Security Deposit</td>
                <td className="p-2 text-right" style={{ border: '1px solid #333' }}>200.00</td>
              </tr>
              
              <tr>
                <td className="p-2" style={{ border: '1px solid #333' }}>MedicalAllowance</td>
                <td className="p-2 text-right" style={{ border: '1px solid #333' }}>
                  {(employee['MEDICAL ALLOW'] || 500).toFixed(2)}
                </td>
                <td className="p-2 text-right" style={{ border: '1px solid #333' }}>
                  {(employee['MEDICAL ALLOW'] || 500).toFixed(2)}
                </td>
                <td className="p-2" style={{ border: '1px solid #333' }}>ProfessionalTax</td>
                <td className="p-2 text-right" style={{ border: '1px solid #333' }}>
                  {(employee['PT'] || 0).toFixed(2)}
                </td>
              </tr>
              
              <tr>
                <td className="p-2" style={{ border: '1px solid #333' }}>Incentive Pay</td>
                <td className="p-2 text-right" style={{ border: '1px solid #333' }}></td>
                <td className="p-2 text-right" style={{ border: '1px solid #333' }}>
                  {(employee['INCENTIVE'] || 5450).toFixed(2)}
                </td>
                <td className="p-2" style={{ border: '1px solid #333' }}>ProvidentFund</td>
                <td className="p-2 text-right" style={{ border: '1px solid #333' }}>
                  {(employee['PF'] || 780).toFixed(2)}
                </td>
              </tr>
              
              <tr style={{ backgroundColor: '#4a9b9b', color: 'white', fontWeight: 'bold' }}>
                <td className="p-2" style={{ border: '1px solid #333', fontSize: '11px' }}>
                  Total Earnings
                </td>
                <td className="p-2 text-right" style={{ border: '1px solid #333', fontSize: '11px' }}>
                  {((employee['EARNED BASIC'] || 6500) + (employee['HRA'] || 1000) + (employee['LOCAN CONVEY'] || 500) + (employee['MEDICAL ALLOW'] || 500)).toFixed(2)}
                </td>
                <td className="p-2 text-right" style={{ border: '1px solid #333', fontSize: '11px' }}>
                  {(employee['GROSS SALARY'] || 13950).toFixed(2)}
                </td>
                <td className="p-2" style={{ border: '1px solid #333', fontSize: '11px' }}>
                  Total Deductions
                </td>
                <td className="p-2 text-right" style={{ border: '1px solid #333', fontSize: '11px' }}>
                  {(employee['TOTAL DEDUCTIONS'] || 1185).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Net Salary */}
        <div className="mb-8">
          <div 
            className="text-left p-3"
            style={{ 
              fontSize: '12px',
              fontWeight: 'bold',
              backgroundColor: '#f8f9fa',
              border: '1px solid #ccc'
            }}
          >
            Net Salary : {employee['NET PAY'] ? formatCurrency(employee['NET PAY']) : '₹12,765.00'} (Rupees {convertToWords(employee['NET PAY'] || 12765)})
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8">
          <p 
            className="text-gray-700 text-justify"
            style={{ 
              fontSize: '9px',
              lineHeight: '1.4'
            }}
          >
            <strong>Note :</strong> This is system generated payslip signature or company seal not required, your salary is confidential and should not be shared with other colleague.
          </p>
        </div>

        {/* Page Footer */}
        <div className="absolute bottom-6 left-8 right-8 flex justify-between text-gray-500" style={{ fontSize: '9px' }}>
          <span>Page 1 of 1</span>
          <span>Downloaded On {new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString('en-GB', { hour12: true })}</span>
        </div>
      </div>
    );
  }
);

ProfessionalPayslipTemplate.displayName = 'ProfessionalPayslipTemplate';

export default ProfessionalPayslipTemplate;
