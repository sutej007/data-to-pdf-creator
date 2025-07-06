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
          minHeight: '1123px',
          fontSize: '12px', 
          lineHeight: '1.4', 
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
          padding: '30px',
          margin: '0 auto',
          color: '#1f2937',
          position: 'relative',
          border: '2px solid #374151',
          printColorAdjust: 'exact',
          WebkitPrintColorAdjust: 'exact'
        }} 
      >
        {/* Header with Clean Borders */}
        <div 
          className="pb-4 mb-6"
          style={{
            borderBottom: '3px solid #2563eb',
            paddingBottom: '16px'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            {processedLogoUrl && (
              <div className="flex-shrink-0">
                <img 
                  src={processedLogoUrl}
                  alt="Company Logo"
                  style={{
                    width: '70px',
                    height: '70px',
                    objectFit: 'contain',
                    border: '2px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '4px'
                  }}
                />
              </div>
            )}
            
            <div className="text-center flex-1 ml-4">
              <h1 
                style={{ 
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1e40af',
                  letterSpacing: '0.3px',
                  lineHeight: '1.3',
                  marginBottom: '6px'
                }}
              >
                NAVACHETANA VIVIDODDESHA SOUHARDA SAHAKARI NIYAMIT
              </h1>
              <div style={{ color: '#4b5563', fontSize: '11px', fontWeight: '500', lineHeight: '1.3' }}>
                <div>HITAISHI PALACE, SHIRUR GROUP BUILDING P B ROAD, HAVERI</div>
                <div>HAVERI - 581110, KARNATAKA</div>
              </div>
            </div>
          </div>
          
          {/* Payslip Title */}
          <div 
            className="text-center py-3 mt-4"
            style={{ 
              fontSize: '15px',
              fontWeight: '700',
              color: '#1e40af',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              border: '2px solid #2563eb',
              borderRadius: '6px',
              backgroundColor: '#eff6ff'
            }}
          >
            SALARY SLIP FOR {formatMonthYear(employee['AS ON']).toUpperCase()}
          </div>
        </div>

        {/* Employee Information Section */}
        <div 
          className="p-4 mb-6"
          style={{
            border: '2px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: '#f9fafb'
          }}
        >
          <div className="grid grid-cols-2 gap-6" style={{ fontSize: '11px' }}>
            {/* Left Column */}
            <div className="space-y-2">
              <div className="flex" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontWeight: '600', color: '#374151', width: '130px', display: 'inline-block' }}>Employee Code</span>
                <span style={{ margin: '0 6px', fontWeight: '600' }}>:</span>
                <span style={{ fontWeight: '500', color: '#1f2937' }}>{employee['EMPLOYEE ID']}</span>
              </div>
              <div className="flex" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontWeight: '600', color: '#374151', width: '130px', display: 'inline-block' }}>Name</span>
                <span style={{ margin: '0 6px', fontWeight: '600' }}>:</span>
                <span style={{ fontWeight: '700', color: '#1e40af' }}>{employee['EMPLOYEE NAME']}</span>
              </div>
              <div className="flex" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontWeight: '600', color: '#374151', width: '130px', display: 'inline-block' }}>Designation</span>
                <span style={{ margin: '0 6px', fontWeight: '600' }}>:</span>
                <span style={{ color: '#1f2937', fontWeight: '500' }}>{employee['DESIGNATION'] || 'Staff'}</span>
              </div>
              <div className="flex" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontWeight: '600', color: '#374151', width: '130px', display: 'inline-block' }}>Department</span>
                <span style={{ margin: '0 6px', fontWeight: '600' }}>:</span>
                <span style={{ color: '#1f2937', fontWeight: '500' }}>{employee['DEPARTMENT'] || 'General'}</span>
              </div>
              <div className="flex" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontWeight: '600', color: '#374151', width: '130px', display: 'inline-block' }}>Date of Birth</span>
                <span style={{ margin: '0 6px', fontWeight: '600' }}>:</span>
                <span style={{ color: '#1f2937', fontWeight: '500' }}>{formatDateOfBirth(employee['DOB'])}</span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-2">
              <div className="flex" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontWeight: '600', color: '#374151', width: '130px', display: 'inline-block' }}>Bank</span>
                <span style={{ margin: '0 6px', fontWeight: '600' }}>:</span>
                <span style={{ color: '#1f2937', fontWeight: '500' }}>UJJIVAN SMALL FINANCE BANK</span>
              </div>
              <div className="flex" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontWeight: '600', color: '#374151', width: '130px', display: 'inline-block' }}>Bank A/C No.</span>
                <span style={{ margin: '0 6px', fontWeight: '600' }}>:</span>
                <span style={{ color: '#1f2937', fontWeight: '500' }}>113111008005134</span>
              </div>
              <div className="flex" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontWeight: '600', color: '#374151', width: '130px', display: 'inline-block' }}>Location</span>
                <span style={{ margin: '0 6px', fontWeight: '600' }}>:</span>
                <span style={{ color: '#1f2937', fontWeight: '500' }}>{employee['BRANCH'] || 'HAVERI'}</span>
              </div>
              <div className="flex" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontWeight: '600', color: '#374151', width: '130px', display: 'inline-block' }}>UAN</span>
                <span style={{ margin: '0 6px', fontWeight: '600' }}>:</span>
                <span style={{ color: '#1f2937', fontWeight: '500' }}>{employee['UAN'] || '100123456789'}</span>
              </div>
              <div className="flex" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontWeight: '600', color: '#374151', width: '130px', display: 'inline-block' }}>PF A/C No.</span>
                <span style={{ margin: '0 6px', fontWeight: '600' }}>:</span>
                <span style={{ color: '#1f2937', fontWeight: '500' }}>{employee['PF NO'] || 'KA/HVR/12345/123456'}</span>
              </div>
            </div>
          </div>

          {/* Additional Information Row */}
          <div 
            className="grid grid-cols-4 gap-4 mt-4 pt-3" 
            style={{ 
              fontSize: '11px',
              borderTop: '1px solid #d1d5db'
            }}
          >
            <div className="flex flex-col">
              <span style={{ fontWeight: '600', color: '#374151', marginBottom: '2px' }}>Date of Joining</span>
              <span style={{ color: '#1f2937', fontWeight: '500' }}>{formatDateOfJoining(employee['DOJ'])}</span>
            </div>
            <div className="flex flex-col">
              <span style={{ fontWeight: '600', color: '#374151', marginBottom: '2px' }}>ESI No.</span>
              <span style={{ color: '#1f2937', fontWeight: '500' }}>{employee['ESI NO'] || '1234567890'}</span>
            </div>
            <div className="flex flex-col">
              <span style={{ fontWeight: '600', color: '#374151', marginBottom: '2px' }}>Attendance</span>
              <span style={{ color: '#1f2937', fontWeight: '500' }}>{employee['TOTAL DAYS'] || 30}.00, {employee['PRESENT DAYS'] || 30}.00</span>
            </div>
            <div className="flex flex-col">
              <span style={{ fontWeight: '600', color: '#374151', marginBottom: '2px' }}>LOP Days</span>
              <span style={{ color: '#1f2937', fontWeight: '500' }}>{employee['LOP'] || 0}.0, 0.0</span>
            </div>
          </div>
        </div>

        {/* Salary Table with Clean Borders */}
        <div 
          className="mb-6"
          style={{
            border: '2px solid #374151',
            borderRadius: '6px',
            overflow: 'hidden'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#1e40af', color: 'white' }}>
                <th 
                  style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    fontWeight: '700', 
                    borderRight: '2px solid #3b82f6',
                    fontSize: '12px', 
                    width: '25%' 
                  }}
                >
                  EARNINGS
                </th>
                <th 
                  style={{ 
                    padding: '12px', 
                    textAlign: 'center', 
                    fontWeight: '700', 
                    borderRight: '2px solid #3b82f6',
                    fontSize: '12px', 
                    width: '15%' 
                  }}
                >
                  FIXED AMOUNT
                </th>
                <th 
                  style={{ 
                    padding: '12px', 
                    textAlign: 'center', 
                    fontWeight: '700', 
                    borderRight: '2px solid #3b82f6',
                    fontSize: '12px', 
                    width: '15%' 
                  }}
                >
                  EARNING AMOUNT
                </th>
                <th 
                  style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    fontWeight: '700', 
                    borderRight: '2px solid #3b82f6',
                    fontSize: '12px', 
                    width: '25%' 
                  }}
                >
                  DEDUCTIONS
                </th>
                <th 
                  style={{ 
                    padding: '12px', 
                    textAlign: 'center', 
                    fontWeight: '700',
                    fontSize: '12px', 
                    width: '20%' 
                  }}
                >
                  AMOUNT
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '11px' }}>
              <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: 'white' }}>
                <td style={{ padding: '10px', fontWeight: '600', borderRight: '1px solid #e5e7eb' }}>Basic Salary</td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: '500', borderRight: '1px solid #e5e7eb' }}>
                  {(employee['EARNED BASIC'] || 6500).toFixed(2)}
                </td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: '600', color: '#059669', borderRight: '1px solid #e5e7eb' }}>
                  {(employee['EARNED BASIC'] || 6500).toFixed(2)}
                </td>
                <td style={{ padding: '10px', fontWeight: '600', borderRight: '1px solid #e5e7eb' }}>Employee State Insurance</td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: '600', color: '#dc2626' }}>
                  {(employee['ESI'] || 105).toFixed(2)}
                </td>
              </tr>
              
              <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                <td style={{ padding: '10px', fontWeight: '600', borderRight: '1px solid #e5e7eb' }}>House Rent Allowance</td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: '500', borderRight: '1px solid #e5e7eb' }}>
                  {(employee['HRA'] || 1000).toFixed(2)}
                </td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: '600', color: '#059669', borderRight: '1px solid #e5e7eb' }}>
                  {(employee['HRA'] || 1000).toFixed(2)}
                </td>
                <td style={{ padding: '10px', fontWeight: '600', borderRight: '1px solid #e5e7eb' }}>Staff Welfare Fund</td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: '600', color: '#dc2626' }}>
                  {(employee['STAFF WELFARE'] || 100).toFixed(2)}
                </td>
              </tr>
              
              <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: 'white' }}>
                <td style={{ padding: '10px', fontWeight: '600', borderRight: '1px solid #e5e7eb' }}>Conveyance Allowance</td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: '500', borderRight: '1px solid #e5e7eb' }}>
                  {(employee['LOCAN CONVEY'] || 500).toFixed(2)}
                </td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: '600', color: '#059669', borderRight: '1px solid #e5e7eb' }}>
                  {(employee['LOCAN CONVEY'] || 500).toFixed(2)}
                </td>
                <td style={{ padding: '10px', fontWeight: '600', borderRight: '1px solid #e5e7eb' }}>Professional Tax</td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: '600', color: '#dc2626' }}>
                  {(employee['PT'] || 0).toFixed(2)}
                </td>
              </tr>
              
              <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                <td style={{ padding: '10px', fontWeight: '600', borderRight: '1px solid #e5e7eb' }}>Medical Allowance</td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: '500', borderRight: '1px solid #e5e7eb' }}>
                  {(employee['MEDICAL ALLOW'] || 500).toFixed(2)}
                </td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: '600', color: '#059669', borderRight: '1px solid #e5e7eb' }}>
                  {(employee['MEDICAL ALLOW'] || 500).toFixed(2)}
                </td>
                <td style={{ padding: '10px', fontWeight: '600', borderRight: '1px solid #e5e7eb' }}>Provident Fund</td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: '600', color: '#dc2626' }}>
                  {(employee['PF'] || 780).toFixed(2)}
                </td>
              </tr>
              
              <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: 'white' }}>
                <td style={{ padding: '10px', fontWeight: '600', borderRight: '1px solid #e5e7eb' }}>Incentive Pay</td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: '500', borderRight: '1px solid #e5e7eb' }}></td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: '600', color: '#059669', borderRight: '1px solid #e5e7eb' }}>
                  {(employee['INCENTIVE'] || 5450).toFixed(2)}
                </td>
                <td style={{ padding: '10px', fontWeight: '600', borderRight: '1px solid #e5e7eb' }}></td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: '600', color: '#dc2626' }}></td>
              </tr>
              
              <tr style={{ backgroundColor: '#1e40af', color: 'white', fontWeight: '700', borderTop: '2px solid #1e40af' }}>
                <td style={{ padding: '12px', borderRight: '2px solid #3b82f6', fontSize: '12px' }}>
                  TOTAL EARNINGS
                </td>
                <td style={{ padding: '12px', textAlign: 'right', borderRight: '2px solid #3b82f6', fontSize: '12px' }}>
                  {((employee['EARNED BASIC'] || 6500) + (employee['HRA'] || 1000) + (employee['LOCAN CONVEY'] || 500) + (employee['MEDICAL ALLOW'] || 500)).toFixed(2)}
                </td>
                <td style={{ padding: '12px', textAlign: 'right', borderRight: '2px solid #3b82f6', fontSize: '12px' }}>
                  {(employee['GROSS SALARY'] || 13950).toFixed(2)}
                </td>
                <td style={{ padding: '12px', borderRight: '2px solid #3b82f6', fontSize: '12px' }}>
                  TOTAL DEDUCTIONS
                </td>
                <td style={{ padding: '12px', textAlign: 'right', fontSize: '12px' }}>
                  {(employee['TOTAL DEDUCTIONS'] || 1185).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Net Salary Section */}
        <div 
          className="p-4 mb-6"
          style={{
            border: '2px solid #059669',
            borderRadius: '6px',
            backgroundColor: '#f0fdf4'
          }}
        >
          <div className="text-center">
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#065f46' }}>NET SALARY:</span>
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#059669' }}>
                {employee['NET PAY'] ? formatCurrency(employee['NET PAY']) : '₹12,765.00'}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#065f46', fontWeight: '600' }}>
              (Rupees {convertToWords(employee['NET PAY'] || 12765)} Only)
            </div>
          </div>
        </div>

        {/* Note Section */}
        <div 
          className="p-3 mb-6"
          style={{
            border: '1px solid #f59e0b',
            borderRadius: '6px',
            backgroundColor: '#fffbeb'
          }}
        >
          <div className="flex items-start" style={{ fontSize: '10px' }}>
            <span style={{ fontWeight: '700', color: '#92400e', marginRight: '6px' }}>NOTE:</span>
            <span style={{ color: '#92400e', lineHeight: '1.4', fontWeight: '500' }}>
              This is a system-generated payslip. No signature or company seal is required.
            </span>
          </div>
        </div>

        {/* Footer with Download Timestamp */}
        <div 
          style={{ 
            position: 'absolute', 
            bottom: '15px', 
            left: '30px', 
            right: '30px',
            borderTop: '1px solid #d1d5db',
            paddingTop: '10px'
          }}
        >
          <div className="flex justify-between items-center" style={{ fontSize: '10px', color: '#6b7280' }}>
            <div style={{ fontWeight: '600' }}>
              Page 1 of 1
            </div>
            <div style={{ textAlign: 'center', fontWeight: '600' }}>
              Downloaded on {new Date().toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })} at {new Date().toLocaleTimeString('en-GB', { 
                hour: '2-digit',
                minute: '2-digit',
                hour12: true 
              })}
            </div>
            <div style={{ fontWeight: '600' }}>
              Professional Payslip
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ProfessionalPayslipTemplate.displayName = 'ProfessionalPayslipTemplate';

export default ProfessionalPayslipTemplate;
