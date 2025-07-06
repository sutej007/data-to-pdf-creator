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
  console.log('AS ON raw data:', dateString); // Debug log to see the actual data
  
  if (!dateString) {
    const now = new Date();
    return now.toLocaleDateString('en-IN', { 
      month: 'long', 
      year: 'numeric' 
    });
  }
  
  // Convert to string and trim whitespace
  const cleanDateString = String(dateString).trim();
  console.log('Cleaned AS ON data:', cleanDateString); // Debug log
  
  // Handle various date formats from Excel
  let date;
  
  // Check if it's already in Month Year format (e.g., "FEB 2023", "February 2023", "Feb 2023")
  if (cleanDateString.match(/^[A-Za-z]{3,9}\s+\d{4}$/)) {
    const parts = cleanDateString.split(/\s+/);
    if (parts.length === 2) {
      const monthAbbr = parts[0].toUpperCase();
      const year = parts[1];
      
      const monthMap: {[key: string]: string} = {
        'JAN': 'January', 'JANUARY': 'January',
        'FEB': 'February', 'FEBRUARY': 'February',
        'MAR': 'March', 'MARCH': 'March',
        'APR': 'April', 'APRIL': 'April',
        'MAY': 'May',
        'JUN': 'June', 'JUNE': 'June',
        'JUL': 'July', 'JULY': 'July',
        'AUG': 'August', 'AUGUST': 'August',
        'SEP': 'September', 'SEPTEMBER': 'September',
        'OCT': 'October', 'OCTOBER': 'October',
        'NOV': 'November', 'NOVEMBER': 'November',
        'DEC': 'December', 'DECEMBER': 'December'
      };
      
      const fullMonth = monthMap[monthAbbr] || monthAbbr;
      console.log('Formatted month year:', `${fullMonth} ${year}`); // Debug log
      return `${fullMonth} ${year}`;
    }
    return cleanDateString;
  }
  
  // Handle MM/YYYY format (e.g., "02/2023")
  if (cleanDateString.match(/^\d{1,2}\/\d{4}$/)) {
    const parts = cleanDateString.split('/');
    const month = parseInt(parts[0]);
    const year = parts[1];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    if (month >= 1 && month <= 12) {
      return `${monthNames[month - 1]} ${year}`;
    }
  }
  
  // Handle DD/MM/YYYY format
  if (cleanDateString.includes('/')) {
    const parts = cleanDateString.split('/');
    if (parts.length === 3) {
      // Assuming DD/MM/YYYY format
      date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
  } 
  // Handle YYYY-MM-DD format
  else if (cleanDateString.includes('-')) {
    date = new Date(cleanDateString);
  } 
  // Handle Excel serial date number
  else if (!isNaN(Number(cleanDateString))) {
    // Excel date serial number (days since 1900-01-01)
    const excelEpoch = new Date(1900, 0, 1);
    date = new Date(excelEpoch.getTime() + (Number(cleanDateString) - 2) * 24 * 60 * 60 * 1000);
  }
  else {
    date = new Date(cleanDateString);
  }
  
  if (date && !isNaN(date.getTime())) {
    return date.toLocaleDateString('en-IN', { 
      month: 'long', 
      year: 'numeric' 
    });
  }
  
  // Fallback to current month/year
  console.log('Using fallback date'); // Debug log
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
        className="bg-white shadow-lg"
        style={{ 
          width: '210mm',
          minHeight: '297mm',
          fontSize: '11px', 
          lineHeight: '1.4', 
          fontFamily: '"Segoe UI", "Inter", system-ui, -apple-system, sans-serif',
          padding: '20mm',
          margin: '0 auto',
          color: '#1f2937',
          position: 'relative',
          border: '2px solid #e5e7eb',
          borderRadius: '8px'
        }} 
      >
        {/* Enhanced Header with Professional Layout */}
        <div className="border-b-2 border-blue-200 pb-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            {processedLogoUrl && (
              <div className="flex-shrink-0">
                <img 
                  src={processedLogoUrl}
                  alt="Company Logo"
                  className="w-16 h-16 object-contain border border-gray-200 rounded-lg shadow-sm"
                />
              </div>
            )}
            
            <div className="text-center flex-1 ml-4">
              <h1 
                className="font-bold text-blue-800 mb-2"
                style={{ 
                  fontSize: '18px',
                  letterSpacing: '0.5px',
                  lineHeight: '1.2'
                }}
              >
                NAVACHETANA VIVIDODDESHA SOUHARDA SAHAKARI NIYAMIT
              </h1>
              <div className="text-gray-700 text-xs font-medium leading-tight">
                <div>HITAISHI PALACE, SHIRUR GROUP BUILDING P B ROAD, HAVERI</div>
                <div>HAVERI - 581110, KARNATAKA</div>
              </div>
            </div>
          </div>
          
          {/* Payslip Title with Clean Border */}
          <div 
            className="text-center py-3 mt-4 border-2 border-blue-300 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100"
            style={{ 
              fontSize: '14px',
              fontWeight: '700',
              color: '#1e40af',
              letterSpacing: '0.5px'
            }}
          >
            SALARY SLIP FOR {formatMonthYear(employee['AS ON']).toUpperCase()}
          </div>
        </div>

        {/* Employee Information Section with Clean Borders */}
        <div className="border border-gray-300 rounded-lg p-4 mb-6 bg-gray-50">
          <div className="grid grid-cols-2 gap-6" style={{ fontSize: '10px' }}>
            {/* Left Column */}
            <div className="space-y-2">
              <div className="flex">
                <span className="font-semibold text-gray-700 w-32">Employee Code</span>
                <span className="mx-2">:</span>
                <span className="font-medium text-gray-900">{employee['EMPLOYEE ID']}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-32">Name</span>
                <span className="mx-2">:</span>
                <span className="font-bold text-blue-800">{employee['EMPLOYEE NAME']}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-32">Designation</span>
                <span className="mx-2">:</span>
                <span className="text-gray-900">{employee['DESIGNATION'] || 'Staff'}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-32">Department</span>
                <span className="mx-2">:</span>
                <span className="text-gray-900">{employee['DEPARTMENT'] || 'General'}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-32">Gender</span>
                <span className="mx-2">:</span>
                <span className="text-gray-900">Male</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-32">Date of Birth</span>
                <span className="mx-2">:</span>
                <span className="text-gray-900">{formatDateOfBirth(employee['DOB'])}</span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-2">
              <div className="flex">
                <span className="font-semibold text-gray-700 w-32">Bank</span>
                <span className="mx-2">:</span>
                <span className="text-gray-900">UJJIVAN SMALL FINANCE BANK</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-32">Bank A/C No.</span>
                <span className="mx-2">:</span>
                <span className="text-gray-900">113111008005134</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-32">Location</span>
                <span className="mx-2">:</span>
                <span className="text-gray-900">{employee['BRANCH'] || 'HAVERI'}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-32">PAN</span>
                <span className="mx-2">:</span>
                <span className="text-gray-900">DZXPM7034M</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-32">UAN</span>
                <span className="mx-2">:</span>
                <span className="text-gray-900">{employee['UAN'] || '100123456789'}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-32">PF A/C No.</span>
                <span className="mx-2">:</span>
                <span className="text-gray-900">{employee['PF NO'] || 'KA/HVR/12345/123456'}</span>
              </div>
            </div>
          </div>

          {/* Additional Information Row */}
          <div className="grid grid-cols-4 gap-4 mt-4 pt-3 border-t border-gray-300" style={{ fontSize: '10px' }}>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">Date of Joining</span>
              <span className="text-gray-900 font-medium">{formatDateOfJoining(employee['DOJ'])}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">ESI No.</span>
              <span className="text-gray-900">{employee['ESI NO'] || '1234567890'}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">Attendance</span>
              <span className="text-gray-900">{employee['TOTAL DAYS'] || 30}.00, {employee['PRESENT DAYS'] || 30}.00</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">LOP Days</span>
              <span className="text-gray-900">{employee['LOP'] || 0}.0, 0.0</span>
            </div>
          </div>
        </div>

        {/* Professional Salary Table with Clean Borders */}
        <div className="border border-gray-300 rounded-lg overflow-hidden mb-6 shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 text-left font-bold border-r border-blue-500" style={{ fontSize: '11px', width: '25%' }}>
                  EARNINGS
                </th>
                <th className="p-3 text-center font-bold border-r border-blue-500" style={{ fontSize: '11px', width: '15%' }}>
                  FIXED AMOUNT
                </th>
                <th className="p-3 text-center font-bold border-r border-blue-500" style={{ fontSize: '11px', width: '15%' }}>
                  EARNING AMOUNT
                </th>
                <th className="p-3 text-left font-bold border-r border-blue-500" style={{ fontSize: '11px', width: '25%' }}>
                  DEDUCTIONS
                </th>
                <th className="p-3 text-center font-bold" style={{ fontSize: '11px', width: '20%' }}>
                  AMOUNT
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '10px' }}>
              <tr className="border-b border-gray-200 bg-white hover:bg-gray-50">
                <td className="p-3 font-medium border-r border-gray-200">Basic Salary</td>
                <td className="p-3 text-right font-medium border-r border-gray-200">
                  {(employee['EARNED BASIC'] || 6500).toFixed(2)}
                </td>
                <td className="p-3 text-right font-semibold text-green-700 border-r border-gray-200">
                  {(employee['EARNED BASIC'] || 6500).toFixed(2)}
                </td>
                <td className="p-3 font-medium border-r border-gray-200">Employee State Insurance</td>
                <td className="p-3 text-right font-semibold text-red-700">
                  {(employee['ESI'] || 105).toFixed(2)}
                </td>
              </tr>
              
              <tr className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
                <td className="p-3 font-medium border-r border-gray-200">House Rent Allowance</td>
                <td className="p-3 text-right font-medium border-r border-gray-200">
                  {(employee['HRA'] || 1000).toFixed(2)}
                </td>
                <td className="p-3 text-right font-semibold text-green-700 border-r border-gray-200">
                  {(employee['HRA'] || 1000).toFixed(2)}
                </td>
                <td className="p-3 font-medium border-r border-gray-200">Staff Welfare Fund</td>
                <td className="p-3 text-right font-semibold text-red-700">
                  {(employee['STAFF WELFARE'] || 100).toFixed(2)}
                </td>
              </tr>
              
              <tr className="border-b border-gray-200 bg-white hover:bg-gray-50">
                <td className="p-3 font-medium border-r border-gray-200">Conveyance Allowance</td>
                <td className="p-3 text-right font-medium border-r border-gray-200">
                  {(employee['LOCAN CONVEY'] || 500).toFixed(2)}
                </td>
                <td className="p-3 text-right font-semibold text-green-700 border-r border-gray-200">
                  {(employee['LOCAN CONVEY'] || 500).toFixed(2)}
                </td>
                <td className="p-3 font-medium border-r border-gray-200">Staff Security Deposit</td>
                <td className="p-3 text-right font-semibold text-red-700">200.00</td>
              </tr>
              
              <tr className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
                <td className="p-3 font-medium border-r border-gray-200">Medical Allowance</td>
                <td className="p-3 text-right font-medium border-r border-gray-200">
                  {(employee['MEDICAL ALLOW'] || 500).toFixed(2)}
                </td>
                <td className="p-3 text-right font-semibold text-green-700 border-r border-gray-200">
                  {(employee['MEDICAL ALLOW'] || 500).toFixed(2)}
                </td>
                <td className="p-3 font-medium border-r border-gray-200">Professional Tax</td>
                <td className="p-3 text-right font-semibold text-red-700">
                  {(employee['PT'] || 0).toFixed(2)}
                </td>
              </tr>
              
              <tr className="border-b border-gray-200 bg-white hover:bg-gray-50">
                <td className="p-3 font-medium border-r border-gray-200">Incentive Pay</td>
                <td className="p-3 text-right font-medium border-r border-gray-200"></td>
                <td className="p-3 text-right font-semibold text-green-700 border-r border-gray-200">
                  {(employee['INCENTIVE'] || 5450).toFixed(2)}
                </td>
                <td className="p-3 font-medium border-r border-gray-200">Provident Fund</td>
                <td className="p-3 text-right font-semibold text-red-700">
                  {(employee['PF'] || 780).toFixed(2)}
                </td>
              </tr>
              
              <tr className="bg-blue-600 text-white font-bold border-t-2 border-blue-700">
                <td className="p-3 border-r border-blue-500" style={{ fontSize: '11px' }}>
                  TOTAL EARNINGS
                </td>
                <td className="p-3 text-right border-r border-blue-500" style={{ fontSize: '11px' }}>
                  {((employee['EARNED BASIC'] || 6500) + (employee['HRA'] || 1000) + (employee['LOCAN CONVEY'] || 500) + (employee['MEDICAL ALLOW'] || 500)).toFixed(2)}
                </td>
                <td className="p-3 text-right border-r border-blue-500" style={{ fontSize: '11px' }}>
                  {(employee['GROSS SALARY'] || 13950).toFixed(2)}
                </td>
                <td className="p-3 border-r border-blue-500" style={{ fontSize: '11px' }}>
                  TOTAL DEDUCTIONS
                </td>
                <td className="p-3 text-right" style={{ fontSize: '11px' }}>
                  {(employee['TOTAL DEDUCTIONS'] || 1185).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Net Salary Section with Professional Design */}
        <div className="border-2 border-green-300 rounded-lg p-4 mb-6 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="text-center">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-green-800">NET SALARY:</span>
              <span className="text-2xl font-bold text-green-700">
                {employee['NET PAY'] ? formatCurrency(employee['NET PAY']) : '₹12,765.00'}
              </span>
            </div>
            <div className="text-sm text-green-700 font-medium">
              (Rupees {convertToWords(employee['NET PAY'] || 12765)} Only)
            </div>
          </div>
        </div>

        {/* Note Section */}
        <div className="border border-amber-300 rounded-lg p-3 mb-6 bg-amber-50">
          <div className="flex items-start text-xs">
            <span className="font-bold text-amber-800 mr-2">📋 NOTE:</span>
            <span className="text-amber-800 leading-relaxed">
              This is a system-generated payslip. No signature or company seal is required. 
              Your salary information is confidential and should not be shared with colleagues.
            </span>
          </div>
        </div>

        {/* Footer with Timestamp and Page Info */}
        <div className="absolute bottom-5 left-5 right-5">
          <div className="border-t border-gray-300 pt-3">
            <div className="flex justify-between items-center text-gray-600" style={{ fontSize: '9px' }}>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="font-medium">Page 1 of 1</span>
              </div>
              <div className="text-center font-medium">
                Generated on {new Date().toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })} at {new Date().toLocaleTimeString('en-GB', { 
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true 
                })}
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Professional Payslip</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ProfessionalPayslipTemplate.displayName = 'ProfessionalPayslipTemplate';

export default ProfessionalPayslipTemplate;
