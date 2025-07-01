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
        className="bg-white"
        style={{ 
          width: '794px', 
          height: '1123px',
          fontSize: '11px', 
          lineHeight: '1.4', 
          fontFamily: '"Segoe UI", "Inter", system-ui, -apple-system, sans-serif',
          padding: '32px',
          color: '#1f2937',
          position: 'relative'
        }} 
      >
        {/* Enhanced Header with Modern Design */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            {processedLogoUrl && (
              <div className="mr-6">
                <img 
                  src={processedLogoUrl}
                  alt="Company Logo"
                  className="w-20 h-20 object-contain rounded-lg shadow-sm"
                />
              </div>
            )}
            <div className="text-center">
              <h1 
                className="font-bold mb-2"
                style={{ 
                  fontSize: '20px',
                  letterSpacing: '0.5px',
                  lineHeight: '1.3',
                  color: '#1e40af',
                  textTransform: 'uppercase'
                }}
              >
                NAVACHETANA VIVIDODDESHA SOUHARDA SAHAKARI NIYAMIT
              </h1>
              <div 
                className="text-gray-600 mb-1"
                style={{ fontSize: '11px', fontWeight: '500' }}
              >
                HITAISHI PALACE, SHIRUR GROUP BUILDING P B ROAD, HAVERI
              </div>
              <div 
                className="text-gray-600"
                style={{ fontSize: '11px', fontWeight: '500' }}
              >
                HAVERI - 581110, KARNATAKA
              </div>
            </div>
          </div>
          
          {/* Modern Payslip Title */}
          <div 
            className="text-center py-4 mb-6 rounded-lg"
            style={{ 
              fontSize: '14px',
              fontWeight: '700',
              color: '#ffffff',
              background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              letterSpacing: '0.5px'
            }}
          >
            SALARY SLIP FOR {formatMonthYear(employee['AS ON']).toUpperCase()}
          </div>
        </div>

        {/* Enhanced Employee Information with Modern Cards */}
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-8" style={{ fontSize: '10px' }}>
            {/* Left Column Card */}
            <div 
              className="space-y-3 p-4 rounded-lg"
              style={{ 
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="flex items-center">
                <span className="font-semibold w-32" style={{ color: '#374151' }}>Employee Code</span>
                <span className="mx-2" style={{ color: '#6b7280' }}>:</span>
                <span className="font-medium" style={{ color: '#1f2937' }}>{employee['EMPLOYEE ID']}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-32" style={{ color: '#374151' }}>Name</span>
                <span className="mx-2" style={{ color: '#6b7280' }}>:</span>
                <span className="font-bold" style={{ color: '#1e40af' }}>{employee['EMPLOYEE NAME']}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-32" style={{ color: '#374151' }}>Designation</span>
                <span className="mx-2" style={{ color: '#6b7280' }}>:</span>
                <span style={{ color: '#1f2937' }}>{employee['DESIGNATION'] || 'Staff'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-32" style={{ color: '#374151' }}>Department</span>
                <span className="mx-2" style={{ color: '#6b7280' }}>:</span>
                <span style={{ color: '#1f2937' }}>{employee['DEPARTMENT'] || 'General'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-32" style={{ color: '#374151' }}>Gender</span>
                <span className="mx-2" style={{ color: '#6b7280' }}>:</span>
                <span style={{ color: '#1f2937' }}>Male</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-32" style={{ color: '#374151' }}>Date of Birth</span>
                <span className="mx-2" style={{ color: '#6b7280' }}>:</span>
                <span style={{ color: '#1f2937' }}>{formatDateOfBirth(employee['DOB'])}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-32" style={{ color: '#374151' }}>Date of Joining</span>
                <span className="mx-2" style={{ color: '#6b7280' }}>:</span>
                <span style={{ color: '#1f2937' }}>{formatDateOfJoining(employee['DOJ'])}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-32" style={{ color: '#374151' }}>Attendance</span>
                <span className="mx-2" style={{ color: '#6b7280' }}>:</span>
                <span style={{ color: '#1f2937' }}>{employee['TOTAL DAYS'] || 30}.00, {employee['PRESENT DAYS'] || 30}.00</span>
              </div>
            </div>

            {/* Right Column Card */}
            <div 
              className="space-y-3 p-4 rounded-lg"
              style={{ 
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="flex items-center">
                <span className="font-semibold w-32" style={{ color: '#374151' }}>Bank</span>
                <span className="mx-2" style={{ color: '#6b7280' }}>:</span>
                <span style={{ color: '#1f2937' }}>UJJIVAN SMALL FINANCE BANK</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-32" style={{ color: '#374151' }}>Bank A/C No.</span>
                <span className="mx-2" style={{ color: '#6b7280' }}>:</span>
                <span style={{ color: '#1f2937' }}>113111008005134</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-32" style={{ color: '#374151' }}>Location</span>
                <span className="mx-2" style={{ color: '#6b7280' }}>:</span>
                <span style={{ color: '#1f2937' }}>{employee['BRANCH'] || 'HAVERI'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-32" style={{ color: '#374151' }}>PAN</span>
                <span className="mx-2" style={{ color: '#6b7280' }}>:</span>
                <span style={{ color: '#1f2937' }}>DZXPM7034M</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-32" style={{ color: '#374151' }}>UAN</span>
                <span className="mx-2" style={{ color: '#6b7280' }}>:</span>
                <span style={{ color: '#1f2937' }}>{employee['UAN'] || '100123456789'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-32" style={{ color: '#374151' }}>PF A/C No.</span>
                <span className="mx-2" style={{ color: '#6b7280' }}>:</span>
                <span style={{ color: '#1f2937' }}>{employee['PF NO'] || 'KA/HVR/12345/123456'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-32" style={{ color: '#374151' }}>ESI No.</span>
                <span className="mx-2" style={{ color: '#6b7280' }}>:</span>
                <span style={{ color: '#1f2937' }}>{employee['ESI NO'] || '1234567890'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-32" style={{ color: '#374151' }}>LOP Days</span>
                <span className="mx-2" style={{ color: '#6b7280' }}>:</span>
                <span style={{ color: '#1f2937' }}>{employee['LOP'] || 0}.0, 0.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Modern Salary Table */}
        <div className="mb-8">
          <table className="w-full border-collapse rounded-lg overflow-hidden" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)', color: 'white' }}>
                <th 
                  className="p-3 text-left font-bold"
                  style={{ fontSize: '11px', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  EARNINGS
                </th>
                <th 
                  className="p-3 text-center font-bold"
                  style={{ fontSize: '11px', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  FIXED AMOUNT
                </th>
                <th 
                  className="p-3 text-center font-bold"
                  style={{ fontSize: '11px', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  EARNING AMOUNT
                </th>
                <th 
                  className="p-3 text-left font-bold"
                  style={{ fontSize: '11px', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  DEDUCTIONS
                </th>
                <th 
                  className="p-3 text-center font-bold"
                  style={{ fontSize: '11px', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  AMOUNT
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '10px' }}>
              <tr style={{ backgroundColor: '#ffffff' }}>
                <td className="p-3 font-medium" style={{ border: '1px solid #e5e7eb', color: '#374151' }}>Basic Salary</td>
                <td className="p-3 text-right font-medium" style={{ border: '1px solid #e5e7eb', color: '#1f2937' }}>
                  {(employee['EARNED BASIC'] || 6500).toFixed(2)}
                </td>
                <td className="p-3 text-right font-semibold" style={{ border: '1px solid #e5e7eb', color: '#059669' }}>
                  {(employee['EARNED BASIC'] || 6500).toFixed(2)}
                </td>
                <td className="p-3 font-medium" style={{ border: '1px solid #e5e7eb', color: '#374151' }}>Employee State Insurance</td>
                <td className="p-3 text-right font-semibold" style={{ border: '1px solid #e5e7eb', color: '#dc2626' }}>
                  {(employee['ESI'] || 105).toFixed(2)}
                </td>
              </tr>
              
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <td className="p-3 font-medium" style={{ border: '1px solid #e5e7eb', color: '#374151' }}>House Rent Allowance</td>
                <td className="p-3 text-right font-medium" style={{ border: '1px solid #e5e7eb', color: '#1f2937' }}>
                  {(employee['HRA'] || 1000).toFixed(2)}
                </td>
                <td className="p-3 text-right font-semibold" style={{ border: '1px solid #e5e7eb', color: '#059669' }}>
                  {(employee['HRA'] || 1000).toFixed(2)}
                </td>
                <td className="p-3 font-medium" style={{ border: '1px solid #e5e7eb', color: '#374151' }}>Staff Welfare Fund</td>
                <td className="p-3 text-right font-semibold" style={{ border: '1px solid #e5e7eb', color: '#dc2626' }}>
                  {(employee['STAFF WELFARE'] || 100).toFixed(2)}
                </td>
              </tr>
              
              <tr style={{ backgroundColor: '#ffffff' }}>
                <td className="p-3 font-medium" style={{ border: '1px solid #e5e7eb', color: '#374151' }}>Conveyance Allowance</td>
                <td className="p-3 text-right font-medium" style={{ border: '1px solid #e5e7eb', color: '#1f2937' }}>
                  {(employee['LOCAN CONVEY'] || 500).toFixed(2)}
                </td>
                <td className="p-3 text-right font-semibold" style={{ border: '1px solid #e5e7eb', color: '#059669' }}>
                  {(employee['LOCAN CONVEY'] || 500).toFixed(2)}
                </td>
                <td className="p-3 font-medium" style={{ border: '1px solid #e5e7eb', color: '#374151' }}>Staff Security Deposit</td>
                <td className="p-3 text-right font-semibold" style={{ border: '1px solid #e5e7eb', color: '#dc2626' }}>200.00</td>
              </tr>
              
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <td className="p-3 font-medium" style={{ border: '1px solid #e5e7eb', color: '#374151' }}>Medical Allowance</td>
                <td className="p-3 text-right font-medium" style={{ border: '1px solid #e5e7eb', color: '#1f2937' }}>
                  {(employee['MEDICAL ALLOW'] || 500).toFixed(2)}
                </td>
                <td className="p-3 text-right font-semibold" style={{ border: '1px solid #e5e7eb', color: '#059669' }}>
                  {(employee['MEDICAL ALLOW'] || 500).toFixed(2)}
                </td>
                <td className="p-3 font-medium" style={{ border: '1px solid #e5e7eb', color: '#374151' }}>Professional Tax</td>
                <td className="p-3 text-right font-semibold" style={{ border: '1px solid #e5e7eb', color: '#dc2626' }}>
                  {(employee['PT'] || 0).toFixed(2)}
                </td>
              </tr>
              
              <tr style={{ backgroundColor: '#ffffff' }}>
                <td className="p-3 font-medium" style={{ border: '1px solid #e5e7eb', color: '#374151' }}>Incentive Pay</td>
                <td className="p-3 text-right font-medium" style={{ border: '1px solid #e5e7eb', color: '#1f2937' }}></td>
                <td className="p-3 text-right font-semibold" style={{ border: '1px solid #e5e7eb', color: '#059669' }}>
                  {(employee['INCENTIVE'] || 5450).toFixed(2)}
                </td>
                <td className="p-3 font-medium" style={{ border: '1px solid #e5e7eb', color: '#374151' }}>Provident Fund</td>
                <td className="p-3 text-right font-semibold" style={{ border: '1px solid #e5e7eb', color: '#dc2626' }}>
                  {(employee['PF'] || 780).toFixed(2)}
                </td>
              </tr>
              
              <tr style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: 'white', fontWeight: 'bold' }}>
                <td className="p-3" style={{ border: '1px solid rgba(255,255,255,0.2)', fontSize: '11px' }}>
                  TOTAL EARNINGS
                </td>
                <td className="p-3 text-right" style={{ border: '1px solid rgba(255,255,255,0.2)', fontSize: '11px' }}>
                  {((employee['EARNED BASIC'] || 6500) + (employee['HRA'] || 1000) + (employee['LOCAN CONVEY'] || 500) + (employee['MEDICAL ALLOW'] || 500)).toFixed(2)}
                </td>
                <td className="p-3 text-right" style={{ border: '1px solid rgba(255,255,255,0.2)', fontSize: '11px' }}>
                  {(employee['GROSS SALARY'] || 13950).toFixed(2)}
                </td>
                <td className="p-3" style={{ border: '1px solid rgba(255,255,255,0.2)', fontSize: '11px' }}>
                  TOTAL DEDUCTIONS
                </td>
                <td className="p-3 text-right" style={{ border: '1px solid rgba(255,255,255,0.2)', fontSize: '11px' }}>
                  {(employee['TOTAL DEDUCTIONS'] || 1185).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Enhanced Net Salary Section */}
        <div className="mb-8">
          <div 
            className="text-left p-4 rounded-lg"
            style={{ 
              fontSize: '13px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
              letterSpacing: '0.3px'
            }}
          >
            <div className="flex items-center justify-between">
              <span>NET SALARY:</span>
              <span className="text-lg font-bold">
                {employee['NET PAY'] ? formatCurrency(employee['NET PAY']) : '₹12,765.00'}
              </span>
            </div>
            <div className="mt-2 text-xs opacity-90">
              (Rupees {convertToWords(employee['NET PAY'] || 12765)} Only)
            </div>
          </div>
        </div>

        {/* Enhanced Footer Note */}
        <div className="mt-8">
          <div 
            className="p-4 rounded-lg"
            style={{ 
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              fontSize: '9px',
              lineHeight: '1.5'
            }}
          >
            <div className="flex items-start">
              <span className="font-bold text-amber-800 mr-2">📋 NOTE:</span>
              <span className="text-amber-800">
                This is a system-generated payslip. No signature or company seal is required. 
                Your salary information is confidential and should not be shared with colleagues.
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Page Footer with Timestamp */}
        <div className="absolute bottom-6 left-8 right-8 flex justify-between items-center text-gray-500" style={{ fontSize: '9px' }}>
          <span className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Page 1 of 1
          </span>
          <span className="flex items-center">
            Generated on {new Date().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })} at {new Date().toLocaleTimeString('en-GB', { 
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true 
            })}
            <span className="w-2 h-2 bg-green-500 rounded-full ml-2"></span>
          </span>
        </div>
      </div>
    );
  }
);

ProfessionalPayslipTemplate.displayName = 'ProfessionalPayslipTemplate';

export default ProfessionalPayslipTemplate;
