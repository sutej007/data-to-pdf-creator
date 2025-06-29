
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

interface ClassicPayslipTemplateProps {
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

const ClassicPayslipTemplate = React.forwardRef<HTMLDivElement, ClassicPayslipTemplateProps>(
  ({ employee, processedLogoUrl }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white shadow-2xl"
        style={{ 
          width: '794px', 
          height: '1123px',
          fontSize: '11px', 
          lineHeight: '1.6', 
          fontFamily: 'Georgia, serif',
          border: '3px solid #2563eb'
        }}
      >
        <div className="p-8 h-full">
          {/* Elegant Header with Logo Colors */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 opacity-10 rounded-lg"></div>
            <div className="relative flex items-center justify-between p-6 border-4 border-blue-600 rounded-lg bg-white shadow-lg">
              <div className="flex items-center space-x-6">
                {processedLogoUrl ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-full blur-sm opacity-30"></div>
                    <img 
                      src={processedLogoUrl}
                      alt="Company Logo"
                      className="relative w-20 h-20 object-contain rounded-full border-3 border-green-500 bg-white p-1 shadow-lg"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">LOGO</span>
                  </div>
                )}
                
                <div className="text-left">
                  <h1 className="text-3xl font-bold text-gray-800 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                    NAVA CHETANA
                  </h1>
                  <h2 className="text-xl font-semibold text-blue-600 mb-2">SOUHARDA SAHAKARI</h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 italic">Excellence in Service</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
                  <div className="text-2xl font-bold">PAYSLIP</div>
                  <div className="text-sm opacity-90">Salary Statement</div>
                </div>
                <div className="mt-3 text-lg font-bold text-gray-700">
                  {formatMonthYear(employee['AS ON'])}
                </div>
              </div>
            </div>
          </div>

          {/* Employee Information Card */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg border-2 border-blue-200 mb-6 shadow-md">
            <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              Employee Information
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex border-b border-gray-200 pb-2">
                  <span className="w-36 font-semibold text-gray-700">Name:</span>
                  <span className="font-bold text-gray-900">{employee['EMPLOYEE NAME']}</span>
                </div>
                <div className="flex border-b border-gray-200 pb-2">
                  <span className="w-36 font-semibold text-gray-700">Employee ID:</span>
                  <span className="text-blue-600 font-semibold">{employee['EMPLOYEE ID']}</span>
                </div>
                <div className="flex border-b border-gray-200 pb-2">
                  <span className="w-36 font-semibold text-gray-700">Designation:</span>
                  <span className="text-gray-800">{employee['DESIGNATION']}</span>
                </div>
                <div className="flex border-b border-gray-200 pb-2">
                  <span className="w-36 font-semibold text-gray-700">Department:</span>
                  <span className="text-gray-800">{employee['DEPARTMENT']}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex border-b border-gray-200 pb-2">
                  <span className="w-36 font-semibold text-gray-700">PF Number:</span>
                  <span className="text-gray-800">{employee['PF NO']}</span>
                </div>
                <div className="flex border-b border-gray-200 pb-2">
                  <span className="w-36 font-semibold text-gray-700">ESI Number:</span>
                  <span className="text-gray-800">{employee['ESI NO']}</span>
                </div>
                <div className="flex border-b border-gray-200 pb-2">
                  <span className="w-36 font-semibold text-gray-700">UAN:</span>
                  <span className="text-gray-800">{employee['UAN']}</span>
                </div>
                <div className="flex border-b border-gray-200 pb-2">
                  <span className="w-36 font-semibold text-gray-700">Joining Date:</span>
                  <span className="text-gray-800">{employee['DOJ']}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Dashboard */}
          <div className="bg-white p-6 rounded-lg border-2 border-green-300 mb-6 shadow-lg">
            <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
              Attendance Summary
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-1">{employee['TOTAL DAYS']}</div>
                <div className="text-sm text-blue-700 font-medium">Total Days</div>
              </div>
              <div className="text-center bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-1">{employee['PRESENT DAYS']}</div>
                <div className="text-sm text-green-700 font-medium">Present Days</div>
              </div>
              <div className="text-center bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="text-3xl font-bold text-orange-600 mb-1">{employee['SALARY DAYS']}</div>
                <div className="text-sm text-orange-700 font-medium">Paid Days</div>
              </div>
              <div className="text-center bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-3xl font-bold text-red-600 mb-1">{employee['LOP']}</div>
                <div className="text-sm text-red-700 font-medium">LOP Days</div>
              </div>
            </div>
          </div>

          {/* Salary Details */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Earnings */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-3 border-green-500">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
                <h4 className="text-lg font-bold text-center">💰 EARNINGS</h4>
              </div>
              <div className="p-5 space-y-3">
                {[
                  ['Basic Salary', employee['EARNED BASIC']],
                  ['HRA', employee['HRA']],
                  ['Conveyance', employee['LOCAN CONVEY']],
                  ['Medical Allowance', employee['MEDICAL ALLOW']],
                  ...(employee['CITY COMPENSATORY ALLOWANCE (CCA)'] > 0 ? [['CCA', employee['CITY COMPENSATORY ALLOWANCE (CCA)']]] : []),
                  ...(employee['OTHER ALLOWANCE'] > 0 ? [['Other Allowances', employee['OTHER ALLOWANCE']]] : [])
                ].map(([label, amount], index) => (
                  <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-gray-700">{label}</span>
                    <span className="font-bold text-green-700">{formatCurrency(amount as number)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center font-bold text-lg pt-3 border-t-3 border-green-500 text-green-800">
                  <span>GROSS TOTAL</span>
                  <span>{formatCurrency(employee['GROSS SALARY'])}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-3 border-red-500">
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4">
                <h4 className="text-lg font-bold text-center">📉 DEDUCTIONS</h4>
              </div>
              <div className="p-5 space-y-3">
                {[
                  ['Provident Fund', employee['PF']],
                  ['ESI', employee['ESI']],
                  ['TDS', employee['TDS']],
                  ['Professional Tax', employee['PT']],
                  ...(employee['SALARY ADVANCE'] > 0 ? [['Salary Advance', employee['SALARY ADVANCE']]] : [])
                ].map(([label, amount], index) => (
                  <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-gray-700">{label}</span>
                    <span className="font-bold text-red-700">{formatCurrency(amount as number)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center font-bold text-lg pt-3 border-t-3 border-red-500 text-red-800">
                  <span>TOTAL DEDUCTIONS</span>
                  <span>{formatCurrency(employee['TOTAL DEDUCTIONS'])}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Pay Banner */}
          <div className="bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 text-white p-6 rounded-lg text-center mb-6 shadow-2xl border-4 border-white" style={{ boxShadow: '0 0 20px rgba(37, 99, 235, 0.3)' }}>
            <div className="text-sm uppercase tracking-wide opacity-90 mb-2">💵 Net Salary Payable</div>
            <div className="text-4xl font-bold mb-2">{formatCurrency(employee['NET PAY'])}</div>
            <div className="text-sm opacity-90">Take Home Pay for {formatMonthYear(employee['AS ON'])}</div>
          </div>

          {/* Professional Footer */}
          <div className="text-center text-sm text-gray-600 border-t-2 border-blue-200 pt-4">
            <div className="flex justify-center items-center mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <p className="font-medium">This is a computer generated payslip and does not require signature.</p>
              <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
            </div>
            <p className="text-xs text-gray-500">Generated on: {new Date().toLocaleDateString('en-IN')} | Confidential Document</p>
          </div>
        </div>
      </div>
    );
  }
);

ClassicPayslipTemplate.displayName = 'ClassicPayslipTemplate';

export default ClassicPayslipTemplate;
