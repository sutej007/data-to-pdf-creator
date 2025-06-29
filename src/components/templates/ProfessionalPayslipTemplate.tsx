
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
          lineHeight: '1.5', 
          fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e5e7eb'
        }} 
      >
        <div className="h-full" style={{ padding: '32px' }}>
          {/* Premium Corporate Header */}
          <div className="mb-10">
            <div 
              className="relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #1e40af 0%, #059669 100%)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full transform translate-x-8 -translate-y-8"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full transform -translate-x-4 translate-y-4"></div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-8">
                  {processedLogoUrl ? (
                    <div className="relative">
                      <div 
                        className="absolute inset-0 bg-white rounded-full blur-sm opacity-20 scale-110"
                        style={{ filter: 'blur(4px)' }}
                      ></div>
                      <img 
                        src={processedLogoUrl}
                        alt="Company Logo"
                        className="relative w-20 h-20 object-contain rounded-full bg-white p-2"
                        style={{ 
                          border: '3px solid rgba(255,255,255,0.3)',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                        }}
                      />
                    </div>
                  ) : (
                    <div 
                      className="w-20 h-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
                      style={{ 
                        border: '3px solid rgba(255,255,255,0.3)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <span className="text-white text-xs font-bold">LOGO</span>
                    </div>
                  )}
                  
                  <div className="text-left">
                    <h1 
                      className="text-white mb-1"
                      style={{ 
                        fontSize: '28px',
                        fontWeight: '700',
                        letterSpacing: '0.5px',
                        fontFamily: "'Inter', sans-serif"
                      }}
                    >
                      NAVA CHETANA
                    </h1>
                    <h2 
                      className="text-white mb-3"
                      style={{ 
                        fontSize: '18px',
                        fontWeight: '500',
                        opacity: '0.95'
                      }}
                    >
                      SOUHARDA SAHAKARI
                    </h2>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-xs font-medium"
                        style={{ backdropFilter: 'blur(10px)' }}
                      >
                        Human Resources Division
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div 
                    className="bg-white bg-opacity-15 text-white p-5 rounded-xl mb-4"
                    style={{ 
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <div 
                      className="mb-2"
                      style={{ 
                        fontSize: '24px',
                        fontWeight: '700',
                        letterSpacing: '1px'
                      }}
                    >
                      PAYROLL STATEMENT
                    </div>
                    <div 
                      style={{ 
                        fontSize: '12px',
                        opacity: '0.9'
                      }}
                    >
                      Official Salary Certificate
                    </div>
                  </div>
                  <div 
                    className="bg-white text-gray-800 p-3 rounded-lg text-center font-semibold"
                    style={{ 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>
                      {formatMonthYear(employee['AS ON'])}
                    </div>
                    <div style={{ fontSize: '10px', color: '#6b7280' }}>
                      Pay Period
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Employee Information */}
          <div className="mb-8">
            <div 
              className="bg-gray-50 p-4 rounded-t-lg border-l-4"
              style={{ 
                borderLeftColor: '#059669',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151'
              }}
            >
              EMPLOYEE PROFILE & STATUTORY INFORMATION
            </div>
            <div 
              className="bg-white border border-gray-200 rounded-b-lg overflow-hidden"
              style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}
            >
              <table className="w-full">
                <tbody>
                  {[
                    ['Employee Name', employee['EMPLOYEE NAME'], 'PF Number', employee['PF NO']],
                    ['Employee ID', employee['EMPLOYEE ID'], 'ESI Number', employee['ESI NO']],
                    ['Designation', employee['DESIGNATION'], 'UAN', employee['UAN']],
                    ['Department', employee['DEPARTMENT'], 'Date of Joining', employee['DOJ']]
                  ].map(([label1, value1, label2, value2], index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td 
                        className="p-4 font-semibold text-gray-700"
                        style={{ 
                          width: '25%',
                          fontSize: '11px',
                          borderRight: '1px solid #e5e7eb'
                        }}
                      >
                        {label1}
                      </td>
                      <td 
                        className="p-4 text-gray-900"
                        style={{ 
                          width: '25%',
                          fontSize: '11px',
                          fontWeight: index === 0 ? '600' : '500',
                          color: index === 1 ? '#1e40af' : '#111827',
                          borderRight: '1px solid #e5e7eb'
                        }}
                      >
                        {value1}
                      </td>
                      <td 
                        className="p-4 font-semibold text-gray-700"
                        style={{ 
                          width: '25%',
                          fontSize: '11px',
                          borderRight: '1px solid #e5e7eb'
                        }}
                      >
                        {label2}
                      </td>
                      <td 
                        className="p-4 text-gray-900"
                        style={{ 
                          width: '25%',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}
                      >
                        {value2}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sophisticated Attendance Summary */}
          <div className="mb-8">
            <div 
              className="p-4 rounded-t-lg text-white text-center font-semibold"
              style={{ 
                background: 'linear-gradient(90deg, #1e40af 0%, #059669 100%)',
                fontSize: '13px',
                letterSpacing: '0.5px'
              }}
            >
              ATTENDANCE & WORKING DAYS ANALYSIS
            </div>
            <div 
              className="grid grid-cols-4 gap-0 rounded-b-lg overflow-hidden"
              style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            >
              {[
                { label: 'TOTAL DAYS', value: employee['TOTAL DAYS'], bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
                { label: 'PRESENT DAYS', value: employee['PRESENT DAYS'], bg: '#f0fdf4', text: '#059669', border: '#bbf7d0' },
                { label: 'PAID DAYS', value: employee['SALARY DAYS'], bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
                { label: 'LOP DAYS', value: employee['LOP'], bg: '#fef2f2', text: '#dc2626', border: '#fecaca' }
              ].map(({ label, value, bg, text, border }, index) => (
                <div 
                  key={index} 
                  className="p-6 text-center border-r border-gray-200 last:border-r-0"
                  style={{ backgroundColor: bg }}
                >
                  <div 
                    className="mb-2"
                    style={{ 
                      fontSize: '28px',
                      fontWeight: '700',
                      color: text
                    }}
                  >
                    {value}
                  </div>
                  <div 
                    style={{ 
                      fontSize: '10px',
                      fontWeight: '600',
                      color: text,
                      letterSpacing: '0.5px'
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Salary Breakdown */}
          <div className="mb-8">
            <div 
              className="overflow-hidden rounded-lg"
              style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <table className="w-full border-collapse">
                <thead>
                  <tr 
                    className="text-white"
                    style={{ background: 'linear-gradient(90deg, #1f2937 0%, #374151 100%)' }}
                  >
                    <th 
                      className="p-4 text-left font-semibold"
                      style={{ 
                        fontSize: '12px',
                        letterSpacing: '0.5px'
                      }}
                    >
                      EARNINGS COMPONENTS
                    </th>
                    <th 
                      className="p-4 text-right font-semibold"
                      style={{ 
                        fontSize: '12px',
                        letterSpacing: '0.5px'
                      }}
                    >
                      AMOUNT (₹)
                    </th>
                    <th 
                      className="p-4 text-left font-semibold border-l border-gray-600"
                      style={{ 
                        fontSize: '12px',
                        letterSpacing: '0.5px'
                      }}
                    >
                      DEDUCTION COMPONENTS
                    </th>
                    <th 
                      className="p-4 text-right font-semibold"
                      style={{ 
                        fontSize: '12px',
                        letterSpacing: '0.5px'
                      }}
                    >
                      AMOUNT (₹)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {[
                    ['Basic Salary', employee['EARNED BASIC'], 'Provident Fund (PF)', employee['PF']],
                    ['House Rent Allowance', employee['HRA'], 'Employee State Insurance', employee['ESI']],
                    ['Conveyance Allowance', employee['LOCAN CONVEY'], 'Tax Deducted at Source', employee['TDS']],
                    ['Medical Allowance', employee['MEDICAL ALLOW'], 'Professional Tax', employee['PT']]
                  ].map(([earning, earningAmt, deduction, deductionAmt], index) => (
                    <tr 
                      key={index} 
                      className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                      style={{ borderBottom: '1px solid #e5e7eb' }}
                    >
                      <td 
                        className="p-4"
                        style={{ 
                          fontSize: '11px',
                          color: '#374151',
                          fontWeight: '500'
                        }}
                      >
                        {earning}
                      </td>
                      <td 
                        className="p-4 text-right font-semibold"
                        style={{ 
                          fontSize: '11px',
                          color: '#059669'
                        }}
                      >
                        {formatCurrency(earningAmt as number).replace('₹', '')}
                      </td>
                      <td 
                        className="p-4 border-l border-gray-200"
                        style={{ 
                          fontSize: '11px',
                          color: '#374151',
                          fontWeight: '500'
                        }}
                      >
                        {deduction}
                      </td>
                      <td 
                        className="p-4 text-right font-semibold"
                        style={{ 
                          fontSize: '11px',
                          color: '#dc2626'
                        }}
                      >
                        {formatCurrency(deductionAmt as number).replace('₹', '')}
                      </td>
                    </tr>
                  ))}
                  
                  {employee['OTHER ALLOWANCE'] > 0 && (
                    <tr className="bg-white" style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td className="p-4" style={{ fontSize: '11px', color: '#374151', fontWeight: '500' }}>
                        Other Allowances
                      </td>
                      <td className="p-4 text-right font-semibold" style={{ fontSize: '11px', color: '#059669' }}>
                        {formatCurrency(employee['OTHER ALLOWANCE']).replace('₹', '')}
                      </td>
                      <td className="p-4 border-l border-gray-200"></td>
                      <td className="p-4"></td>
                    </tr>
                  )}
                  
                  {employee['SALARY ADVANCE'] > 0 && (
                    <tr className="bg-gray-50" style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td className="p-4"></td>
                      <td className="p-4"></td>
                      <td className="p-4 border-l border-gray-200" style={{ fontSize: '11px', color: '#374151', fontWeight: '500' }}>
                        Salary Advance
                      </td>
                      <td className="p-4 text-right font-semibold" style={{ fontSize: '11px', color: '#dc2626' }}>
                        {formatCurrency(employee['SALARY ADVANCE']).replace('₹', '')}
                      </td>
                    </tr>
                  )}
                  
                  <tr 
                    style={{ 
                      background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%)',
                      borderTop: '2px solid #1f2937'
                    }}
                  >
                    <td 
                      className="p-5 font-bold"
                      style={{ 
                        fontSize: '13px',
                        color: '#059669',
                        letterSpacing: '0.5px'
                      }}
                    >
                      GROSS EARNINGS
                    </td>
                    <td 
                      className="p-5 text-right font-bold"
                      style={{ 
                        fontSize: '14px',
                        color: '#059669'
                      }}
                    >
                      {formatCurrency(employee['GROSS SALARY']).replace('₹', '')}
                    </td>
                    <td 
                      className="p-5 font-bold border-l border-gray-300"
                      style={{ 
                        fontSize: '13px',
                        color: '#dc2626',
                        letterSpacing: '0.5px'
                      }}
                    >
                      TOTAL DEDUCTIONS
                    </td>
                    <td 
                      className="p-5 text-right font-bold"
                      style={{ 
                        fontSize: '14px',
                        color: '#dc2626'
                      }}
                    >
                      {formatCurrency(employee['TOTAL DEDUCTIONS']).replace('₹', '')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Elegant Net Pay Display */}
          <div className="mb-8">
            <div 
              className="relative overflow-hidden rounded-xl p-8 text-center"
              style={{
                background: 'linear-gradient(135deg, #1e40af 0%, #059669 50%, #1e40af 100%)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
            >
              {/* Decorative Background */}
              <div className="absolute inset-0 bg-white opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white to-transparent opacity-10"></div>
              </div>
              
              <div className="relative">
                <div 
                  className="text-white mb-3"
                  style={{ 
                    fontSize: '14px',
                    fontWeight: '600',
                    letterSpacing: '1px',
                    opacity: '0.95'
                  }}
                >
                  NET SALARY PAYABLE
                </div>
                <div 
                  className="text-white mb-4"
                  style={{ 
                    fontSize: '36px',
                    fontWeight: '700',
                    letterSpacing: '1px'
                  }}
                >
                  {formatCurrency(employee['NET PAY'])}
                </div>
                <div 
                  className="bg-white bg-opacity-20 text-white px-6 py-2 rounded-full inline-block"
                  style={{ 
                    fontSize: '11px',
                    fontWeight: '500',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                >
                  Gross Earnings - Total Deductions | Pay Period: {formatMonthYear(employee['AS ON'])}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Authorization Section */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {[
              { title: 'EMPLOYEE ACKNOWLEDGMENT', subtitle: 'Signature & Date' },
              { title: 'AUTHORIZED BY HR DEPARTMENT', subtitle: 'Signature & Official Seal' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div 
                  className="h-16 mb-3 border-b-2 border-dashed border-gray-300"
                  style={{ borderStyle: 'dashed' }}
                ></div>
                <div 
                  className="bg-gray-50 p-3 rounded-lg border"
                  style={{ borderColor: '#d1d5db' }}
                >
                  <p 
                    className="font-semibold text-gray-800 mb-1"
                    style={{ fontSize: '10px', letterSpacing: '0.5px' }}
                  >
                    {item.title}
                  </p>
                  <p 
                    className="text-gray-600"
                    style={{ fontSize: '9px' }}
                  >
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Premium Footer */}
          <div 
            className="border-t border-gray-200 pt-6"
            style={{ borderTopWidth: '2px' }}
          >
            <div 
              className="text-white p-4 rounded-lg text-center"
              style={{
                background: 'linear-gradient(90deg, #1f2937 0%, #374151 100%)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="flex items-center justify-center space-x-3 mb-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <p 
                  style={{ 
                    fontSize: '11px',
                    fontWeight: '600',
                    letterSpacing: '0.5px'
                  }}
                >
                  CONFIDENTIAL PAYROLL DOCUMENT
                </p>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <div 
                className="text-white"
                style={{ 
                  fontSize: '9px',
                  opacity: '0.8'
                }}
              >
                Generated on: {new Date().toLocaleDateString('en-IN', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric' 
                })} | System Generated - No Manual Signature Required
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
