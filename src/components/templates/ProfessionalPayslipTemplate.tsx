
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
          width: '210mm',
          minHeight: '297mm',
          fontSize: '13px', 
          lineHeight: '1.5', 
          fontFamily: '"Poppins", "Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
          padding: '20mm',
          margin: '0 auto',
          color: '#1a202c',
          position: 'relative',
          border: '4px solid #2563eb',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(37, 99, 235, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          printColorAdjust: 'exact',
          WebkitPrintColorAdjust: 'exact',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
        }} 
      >
        {/* Premium Header with Gradient Background */}
        <div 
          className="pb-6 mb-8"
          style={{
            borderBottom: '4px solid #2563eb',
            borderRadius: '8px 8px 0 0',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
            margin: '-20mm -20mm 0 -20mm',
            padding: '25mm 20mm 15mm 20mm',
            color: 'white',
            position: 'relative'
          }}
        >
          {/* Decorative Pattern */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 2px, transparent 2px), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.08) 1px, transparent 1px)',
              backgroundSize: '40px 40px, 60px 60px',
              borderRadius: '8px 8px 0 0'
            }}
          />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            {processedLogoUrl && (
              <div className="flex-shrink-0">
                <div style={{
                  width: '85px',
                  height: '85px',
                  border: '3px solid rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                  padding: '8px',
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                }}>
                  <img 
                    src={processedLogoUrl}
                    alt="Company Logo"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: '6px'
                    }}
                  />
                </div>
              </div>
            )}
            
            <div className="text-center flex-1 ml-6">
              <h1 
                style={{ 
                  fontSize: '22px',
                  fontWeight: '900',
                  letterSpacing: '1px',
                  lineHeight: '1.2',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                NAVACHETANA VIVIDODDESHA SOUHARDA SAHAKARI NIYAMIT
              </h1>
              <div style={{ fontSize: '12px', fontWeight: '600', lineHeight: '1.4', opacity: '0.95' }}>
                <div style={{ marginBottom: '4px' }}>HITAISHI PALACE, SHIRUR GROUP BUILDING P B ROAD, HAVERI</div>
                <div>HAVERI - 581110, KARNATAKA</div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Payslip Title */}
          <div 
            className="text-center py-5 mt-6 relative z-10"
            style={{ 
              fontSize: '18px',
              fontWeight: '900',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              border: '3px solid rgba(255,255,255,0.3)',
              borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
            }}
          >
            💰 SALARY SLIP FOR {formatMonthYear(employee['AS ON']).toUpperCase()} 💰
          </div>
        </div>

        {/* Premium Employee Information Section */}
        <div 
          className="p-6 mb-8"
          style={{
            border: '3px solid #e2e8f0',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
            boxShadow: '0 4px 16px rgba(148, 163, 184, 0.1)'
          }}
        >
          <div 
            style={{
              fontSize: '16px',
              fontWeight: '800',
              color: '#1e40af',
              marginBottom: '20px',
              textAlign: 'center',
              borderBottom: '2px solid #e2e8f0',
              paddingBottom: '12px'
            }}
          >
            👤 EMPLOYEE INFORMATION
          </div>
          
          <div className="grid grid-cols-2 gap-10" style={{ fontSize: '12px' }}>
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontWeight: '800', color: '#475569', width: '150px', display: 'inline-block' }}>Employee Code</span>
                <span style={{ margin: '0 12px', fontWeight: '800', color: '#2563eb' }}>:</span>
                <span style={{ fontWeight: '700', color: '#1e293b' }}>{employee['EMPLOYEE ID']}</span>
              </div>
              <div className="flex" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontWeight: '800', color: '#475569', width: '150px', display: 'inline-block' }}>Name</span>
                <span style={{ margin: '0 12px', fontWeight: '800', color: '#2563eb' }}>:</span>
                <span style={{ fontWeight: '900', color: '#1e40af', fontSize: '13px' }}>{employee['EMPLOYEE NAME']}</span>
              </div>
              <div className="flex" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontWeight: '800', color: '#475569', width: '150px', display: 'inline-block' }}>Designation</span>
                <span style={{ margin: '0 12px', fontWeight: '800', color: '#2563eb' }}>:</span>
                <span style={{ color: '#1e293b', fontWeight: '700' }}>{employee['DESIGNATION'] || 'Staff'}</span>
              </div>
              <div className="flex" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontWeight: '800', color: '#475569', width: '150px', display: 'inline-block' }}>Department</span>
                <span style={{ margin: '0 12px', fontWeight: '800', color: '#2563eb' }}>:</span>
                <span style={{ color: '#1e293b', fontWeight: '700' }}>{employee['DEPARTMENT'] || 'General'}</span>
              </div>
              <div className="flex" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontWeight: '800', color: '#475569', width: '150px', display: 'inline-block' }}>Gender</span>
                <span style={{ margin: '0 12px', fontWeight: '800', color: '#2563eb' }}>:</span>
                <span style={{ color: '#1e293b', fontWeight: '700' }}>Male</span>
              </div>
              <div className="flex" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontWeight: '800', color: '#475569', width: '150px', display: 'inline-block' }}>Date of Birth</span>
                <span style={{ margin: '0 12px', fontWeight: '800', color: '#2563eb' }}>:</span>
                <span style={{ color: '#1e293b', fontWeight: '700' }}>{formatDateOfBirth(employee['DOB'])}</span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="flex" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontWeight: '800', color: '#475569', width: '150px', display: 'inline-block' }}>Bank</span>
                <span style={{ margin: '0 12px', fontWeight: '800', color: '#2563eb' }}>:</span>
                <span style={{ color: '#1e293b', fontWeight: '700' }}>UJJIVAN SMALL FINANCE BANK</span>
              </div>
              <div className="flex" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontWeight: '800', color: '#475569', width: '150px', display: 'inline-block' }}>Bank A/C No.</span>
                <span style={{ margin: '0 12px', fontWeight: '800', color: '#2563eb' }}>:</span>
                <span style={{ color: '#1e293b', fontWeight: '700' }}>113111008005134</span>
              </div>
              <div className="flex" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontWeight: '800', color: '#475569', width: '150px', display: 'inline-block' }}>Location</span>
                <span style={{ margin: '0 12px', fontWeight: '800', color: '#2563eb' }}>:</span>
                <span style={{ color: '#1e293b', fontWeight: '700' }}>{employee['BRANCH'] || 'HAVERI'}</span>
              </div>
              <div className="flex" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontWeight: '800', color: '#475569', width: '150px', display: 'inline-block' }}>PAN</span>
                <span style={{ margin: '0 12px', fontWeight: '800', color: '#2563eb' }}>:</span>
                <span style={{ color: '#1e293b', fontWeight: '700' }}>DZXPM7034M</span>
              </div>
              <div className="flex" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontWeight: '800', color: '#475569', width: '150px', display: 'inline-block' }}>UAN</span>
                <span style={{ margin: '0 12px', fontWeight: '800', color: '#2563eb' }}>:</span>
                <span style={{ color: '#1e293b', fontWeight: '700' }}>{employee['UAN'] || '100123456789'}</span>
              </div>
              <div className="flex" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontWeight: '800', color: '#475569', width: '150px', display: 'inline-block' }}>PF A/C No.</span>
                <span style={{ margin: '0 12px', fontWeight: '800', color: '#2563eb' }}>:</span>
                <span style={{ color: '#1e293b', fontWeight: '700' }}>{employee['PF NO'] || 'KA/HVR/12345/123456'}</span>
              </div>
            </div>
          </div>

          {/* Additional Information Row */}
          <div 
            className="grid grid-cols-4 gap-8 mt-6 pt-5" 
            style={{ 
              fontSize: '12px',
              borderTop: '3px solid #e2e8f0',
              background: 'linear-gradient(90deg, #f1f5f9 0%, #ffffff 100%)',
              padding: '16px',
              borderRadius: '8px'
            }}
          >
            <div className="flex flex-col text-center">
              <span style={{ fontWeight: '800', color: '#475569', marginBottom: '6px' }}>📅 Date of Joining</span>
              <span style={{ color: '#1e293b', fontWeight: '700' }}>{formatDateOfJoining(employee['DOJ'])}</span>
            </div>
            <div className="flex flex-col text-center">
              <span style={{ fontWeight: '800', color: '#475569', marginBottom: '6px' }}>🏥 ESI No.</span>
              <span style={{ color: '#1e293b', fontWeight: '700' }}>{employee['ESI NO'] || '1234567890'}</span>
            </div>
            <div className="flex flex-col text-center">
              <span style={{ fontWeight: '800', color: '#475569', marginBottom: '6px' }}>📊 Attendance</span>
              <span style={{ color: '#1e293b', fontWeight: '700' }}>{employee['TOTAL DAYS'] || 30}.00, {employee['PRESENT DAYS'] || 30}.00</span>
            </div>
            <div className="flex flex-col text-center">
              <span style={{ fontWeight: '800', color: '#475569', marginBottom: '6px' }}>❌ LOP Days</span>
              <span style={{ color: '#1e293b', fontWeight: '700' }}>{employee['LOP'] || 0}.0, 0.0</span>
            </div>
          </div>
        </div>

        {/* Premium Salary Table */}
        <div 
          className="mb-8"
          style={{
            border: '4px solid #2563eb',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(37, 99, 235, 0.15)'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', color: 'white' }}>
                <th 
                  style={{ 
                    padding: '16px 12px', 
                    textAlign: 'left', 
                    fontWeight: '900', 
                    borderRight: '3px solid rgba(255,255,255,0.2)',
                    fontSize: '13px', 
                    width: '25%' 
                  }}
                >
                  💰 EARNINGS
                </th>
                <th 
                  style={{ 
                    padding: '16px 12px', 
                    textAlign: 'center', 
                    fontWeight: '900', 
                    borderRight: '3px solid rgba(255,255,255,0.2)',
                    fontSize: '13px', 
                    width: '15%' 
                  }}
                >
                  FIXED AMOUNT
                </th>
                <th 
                  style={{ 
                    padding: '16px 12px', 
                    textAlign: 'center', 
                    fontWeight: '900', 
                    borderRight: '3px solid rgba(255,255,255,0.2)',
                    fontSize: '13px', 
                    width: '15%' 
                  }}
                >
                  EARNING AMOUNT
                </th>
                <th 
                  style={{ 
                    padding: '16px 12px', 
                    textAlign: 'left', 
                    fontWeight: '900', 
                    borderRight: '3px solid rgba(255,255,255,0.2)',
                    fontSize: '13px', 
                    width: '25%' 
                  }}
                >
                  📉 DEDUCTIONS
                </th>
                <th 
                  style={{ 
                    padding: '16px 12px', 
                    textAlign: 'center', 
                    fontWeight: '900',
                    fontSize: '13px', 
                    width: '20%' 
                  }}
                >
                  AMOUNT
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '12px' }}>
              <tr style={{ borderBottom: '2px solid #e2e8f0', background: 'linear-gradient(90deg, #ffffff 0%, #f8fafc 100%)' }}>
                <td style={{ padding: '14px 12px', fontWeight: '800', borderRight: '2px solid #e2e8f0' }}>💼 Basic Salary</td>
                <td style={{ padding: '14px 12px', textAlign: 'right', fontWeight: '700', borderRight: '2px solid #e2e8f0' }}>
                  {(employee['EARNED BASIC'] || 6500).toFixed(2)}
                </td>
                <td style={{ padding: '14px 12px', textAlign: 'right', fontWeight: '800', color: '#059669', borderRight: '2px solid #e2e8f0' }}>
                  {(employee['EARNED BASIC'] || 6500).toFixed(2)}
                </td>
                <td style={{ padding: '14px 12px', fontWeight: '800', borderRight: '2px solid #e2e8f0' }}>🏥 Employee State Insurance</td>
                <td style={{ padding: '14px 12px', textAlign: 'right', fontWeight: '800', color: '#dc2626' }}>
                  {(employee['ESI'] || 105).toFixed(2)}
                </td>
              </tr>
              
              <tr style={{ borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <td style={{ padding: '14px 12px', fontWeight: '800', borderRight: '2px solid #e2e8f0' }}>🏠 House Rent Allowance</td>
                <td style={{ padding: '14px 12px', textAlign: 'right', fontWeight: '700', borderRight: '2px solid #e2e8f0' }}>
                  {(employee['HRA'] || 1000).toFixed(2)}
                </td>
                <td style={{ padding: '14px 12px', textAlign: 'right', fontWeight: '800', color: '#059669', borderRight: '2px solid #e2e8f0' }}>
                  {(employee['HRA'] || 1000).toFixed(2)}
                </td>
                <td style={{ padding: '14px 12px', fontWeight: '800', borderRight: '2px solid #e2e8f0' }}>👥 Staff Welfare Fund</td>
                <td style={{ padding: '14px 12px', textAlign: 'right', fontWeight: '800', color: '#dc2626' }}>
                  {(employee['STAFF WELFARE'] || 100).toFixed(2)}
                </td>
              </tr>
              
              <tr style={{ borderBottom: '2px solid #e2e8f0', background: 'linear-gradient(90deg, #ffffff 0%, #f8fafc 100%)' }}>
                <td style={{ padding: '14px 12px', fontWeight: '800', borderRight: '2px solid #e2e8f0' }}>🚗 Conveyance Allowance</td>
                <td style={{ padding: '14px 12px', textAlign: 'right', fontWeight: '700', borderRight: '2px solid #e2e8f0' }}>
                  {(employee['LOCAN CONVEY'] || 500).toFixed(2)}
                </td>
                <td style={{ padding: '14px 12px', textAlign: 'right', fontWeight: '800', color: '#059669', borderRight: '2px solid #e2e8f0' }}>
                  {(employee['LOCAN CONVEY'] || 500).toFixed(2)}
                </td>
                <td style={{ padding: '14px 12px', fontWeight: '800', borderRight: '2px solid #e2e8f0' }}>🔒 Staff Security Deposit</td>
                <td style={{ padding: '14px 12px', textAlign: 'right', fontWeight: '800', color: '#dc2626' }}>200.00</td>
              </tr>
              
              <tr style={{ borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <td style={{ padding: '14px 12px', fontWeight: '800', borderRight: '2px solid #e2e8f0' }}>💊 Medical Allowance</td>
                <td style={{ padding: '14px 12px', textAlign: 'right', fontWeight: '700', borderRight: '2px solid #e2e8f0' }}>
                  {(employee['MEDICAL ALLOW'] || 500).toFixed(2)}
                </td>
                <td style={{ padding: '14px 12px', textAlign: 'right', fontWeight: '800', color: '#059669', borderRight: '2px solid #e2e8f0' }}>
                  {(employee['MEDICAL ALLOW'] || 500).toFixed(2)}
                </td>
                <td style={{ padding: '14px 12px', fontWeight: '800', borderRight: '2px solid #e2e8f0' }}>📋 Professional Tax</td>
                <td style={{ padding: '14px 12px', textAlign: 'right', fontWeight: '800', color: '#dc2626' }}>
                  {(employee['PT'] || 0).toFixed(2)}
                </td>
              </tr>
              
              <tr style={{ borderBottom: '2px solid #e2e8f0', background: 'linear-gradient(90deg, #ffffff 0%, #f8fafc 100%)' }}>
                <td style={{ padding: '14px 12px', fontWeight: '800', borderRight: '2px solid #e2e8f0' }}>🎯 Incentive Pay</td>
                <td style={{ padding: '14px 12px', textAlign: 'right', fontWeight: '700', borderRight: '2px solid #e2e8f0' }}></td>
                <td style={{ padding: '14px 12px', textAlign: 'right', fontWeight: '800', color: '#059669', borderRight: '2px solid #e2e8f0' }}>
                  {(employee['INCENTIVE'] || 5450).toFixed(2)}
                </td>
                <td style={{ padding: '14px 12px', fontWeight: '800', borderRight: '2px solid #e2e8f0' }}>💳 Provident Fund</td>
                <td style={{ padding: '14px 12px', textAlign: 'right', fontWeight: '800', color: '#dc2626' }}>
                  {(employee['PF'] || 780).toFixed(2)}
                </td>
              </tr>
              
              <tr style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', color: 'white', fontWeight: '900', borderTop: '4px solid #1e40af' }}>
                <td style={{ padding: '16px 12px', borderRight: '3px solid rgba(255,255,255,0.2)', fontSize: '13px' }}>
                  🏆 TOTAL EARNINGS
                </td>
                <td style={{ padding: '16px 12px', textAlign: 'right', borderRight: '3px solid rgba(255,255,255,0.2)', fontSize: '13px' }}>
                  {((employee['EARNED BASIC'] || 6500) + (employee['HRA'] || 1000) + (employee['LOCAN CONVEY'] || 500) + (employee['MEDICAL ALLOW'] || 500)).toFixed(2)}
                </td>
                <td style={{ padding: '16px 12px', textAlign: 'right', borderRight: '3px solid rgba(255,255,255,0.2)', fontSize: '13px' }}>
                  {(employee['GROSS SALARY'] || 13950).toFixed(2)}
                </td>
                <td style={{ padding: '16px 12px', borderRight: '3px solid rgba(255,255,255,0.2)', fontSize: '13px' }}>
                  💸 TOTAL DEDUCTIONS
                </td>
                <td style={{ padding: '16px 12px', textAlign: 'right', fontSize: '13px' }}>
                  {(employee['TOTAL DEDUCTIONS'] || 1185).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Premium Net Salary Section */}
        <div 
          className="p-6 mb-8"
          style={{
            border: '4px solid #059669',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
            boxShadow: '0 8px 32px rgba(5, 150, 105, 0.15)'
          }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div style={{ fontSize: '20px', fontWeight: '900', color: '#065f46', marginRight: '16px' }}>
                💵 NET SALARY:
              </div>
              <div style={{ 
                fontSize: '28px', 
                fontWeight: '900', 
                color: '#059669',
                textShadow: '0 2px 4px rgba(5, 150, 105, 0.2)'
              }}>
                {employee['NET PAY'] ? formatCurrency(employee['NET PAY']) : '₹12,765.00'}
              </div>
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: '#065f46', 
              fontWeight: '800',
              padding: '12px',
              backgroundColor: 'rgba(5, 150, 105, 0.1)',
              borderRadius: '8px',
              border: '2px solid rgba(5, 150, 105, 0.2)'
            }}>
              💬 (Rupees {convertToWords(employee['NET PAY'] || 12765)} Only)
            </div>
          </div>
        </div>

        {/* Enhanced Note Section */}
        <div 
          className="p-5 mb-8"
          style={{
            border: '3px solid #f59e0b',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.15)'
          }}
        >
          <div className="flex items-start" style={{ fontSize: '12px' }}>
            <span style={{ fontWeight: '900', color: '#92400e', marginRight: '12px', fontSize: '16px' }}>📋</span>
            <div>
              <span style={{ fontWeight: '900', color: '#92400e', marginRight: '8px' }}>IMPORTANT NOTE:</span>
              <span style={{ color: '#92400e', lineHeight: '1.6', fontWeight: '700' }}>
                This is a system-generated payslip designed with ❤️ by Lovable. No signature or company seal is required. 
                Your salary information is confidential and should not be shared with colleagues.
              </span>
            </div>
          </div>
        </div>

        {/* Premium Footer with Download Timestamp */}
        <div 
          style={{ 
            position: 'absolute', 
            bottom: '15mm', 
            left: '20mm', 
            right: '20mm',
            borderTop: '3px solid #2563eb',
            paddingTop: '16px'
          }}
        >
          <div 
            className="flex justify-between items-center" 
            style={{ 
              fontSize: '11px', 
              color: '#64748b',
              background: 'linear-gradient(90deg, #f1f5f9 0%, #ffffff 50%, #f1f5f9 100%)',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '2px solid #e2e8f0'
            }}
          >
            <div className="flex items-center">
              <div style={{ width: '10px', height: '10px', background: 'linear-gradient(45deg, #2563eb, #3b82f6)', borderRadius: '50%', marginRight: '10px' }}></div>
              <span style={{ fontWeight: '800' }}>Page 1 of 1</span>
            </div>
            <div style={{ textAlign: 'center', fontWeight: '800', fontSize: '12px' }}>
              ⏰ Downloaded on {new Date().toLocaleDateString('en-GB', {
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
              <span style={{ fontWeight: '800', marginRight: '10px' }}>💎 Professional Payslip • Designed by Lovable</span>
              <div style={{ width: '10px', height: '10px', background: 'linear-gradient(45deg, #059669, #10b981)', borderRadius: '50%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ProfessionalPayslipTemplate.displayName = 'ProfessionalPayslipTemplate';

export default ProfessionalPayslipTemplate;
