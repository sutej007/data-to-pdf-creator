
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

interface ModernPayslipTemplateProps {
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

const ModernPayslipTemplate = React.forwardRef<HTMLDivElement, ModernPayslipTemplateProps>(
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
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        }}
      >
        <div className="p-6 h-full" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
          {/* Ultra Modern Header */}
          <div className="relative mb-8 overflow-hidden rounded-2xl shadow-2xl" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #059669 50%, #1e40af 100%)' }}>
            <div className="absolute inset-0 opacity-10" style={{ background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
            
            <div className="relative flex items-center justify-between p-8 text-white">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {processedLogoUrl ? (
                    <>
                      <div className="absolute inset-0 bg-white rounded-2xl blur-sm opacity-20 scale-110"></div>
                      <img 
                        src={processedLogoUrl}
                        alt="Company Logo"
                        className="relative w-24 h-24 object-contain bg-white rounded-2xl p-3 shadow-xl border border-white/20"
                      />
                    </>
                  ) : (
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                      <span className="text-sm font-bold">LOGO</span>
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-1 tracking-tight">NAVA CHETANA</h1>
                  <h2 className="text-xl font-medium text-blue-100 mb-2">SOUHARDA SAHAKARI</h2>
                  <div className="flex items-center space-x-2 text-green-200">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Excellence • Innovation • Trust</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                  <div className="text-3xl font-bold mb-1">PAYSLIP</div>
                  <div className="text-blue-100 text-sm mb-3">Employee Salary Statement</div>
                  <div className="bg-white/20 rounded-lg px-4 py-2">
                    <div className="text-lg font-bold">{formatMonthYear(employee['AS ON'])}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Information with Glass Effect */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl border border-white/50">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-green-500 rounded-full mr-4"></div>
              <h3 className="text-xl font-bold text-gray-800">Employee Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                {[
                  ['Employee Name', employee['EMPLOYEE NAME'], 'font-bold text-gray-900'],
                  ['Employee ID', employee['EMPLOYEE ID'], 'text-blue-600 font-semibold'],
                  ['Designation', employee['DESIGNATION'], 'text-gray-800'],
                  ['Department', employee['DEPARTMENT'], 'text-gray-800']
                ].map(([label, value, className], index) => (
                  <div key={index} className="group">
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">{label}</div>
                    <div className={`text-sm ${className} group-hover:text-blue-600 transition-colors`}>{value}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {[
                  ['PF Number', employee['PF NO']],
                  ['ESI Number', employee['ESI NO']],
                  ['UAN', employee['UAN']],
                  ['Date of Joining', employee['DOJ']]
                ].map(([label, value], index) => (
                  <div key={index} className="group">
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">{label}</div>
                    <div className="text-sm text-gray-800 group-hover:text-green-600 transition-colors">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Attendance Cards with Hover Effects */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              ['Total Days', employee['TOTAL DAYS'], 'from-blue-500 to-blue-600', 'bg-blue-50'],
              ['Present Days', employee['PRESENT DAYS'], 'from-green-500 to-green-600', 'bg-green-50'],
              ['Paid Days', employee['SALARY DAYS'], 'from-orange-500 to-orange-600', 'bg-orange-50'],
              ['LOP Days', employee['LOP'], 'from-red-500 to-red-600', 'bg-red-50']
            ].map(([label, value, gradient, bgColor], index) => (
              <div key={index} className={`${bgColor} rounded-2xl p-5 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/50`}>
                <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg`}>
                  <span className="text-white font-bold text-lg">{value}</span>
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wide font-medium">{label}</div>
              </div>
            ))}
          </div>

          {/* Salary Breakdown with Advanced Design */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Earnings */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-green-200/50">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 relative">
                <div className="absolute inset-0 bg-white/10"></div>
                <h4 className="relative text-lg font-bold text-white text-center flex items-center justify-center">
                  <span className="mr-2">💰</span> EARNINGS
                </h4>
              </div>
              <div className="p-6 space-y-3">
                {[
                  ['Basic Salary', employee['EARNED BASIC']],
                  ['HRA', employee['HRA']],
                  ['Conveyance', employee['LOCAN CONVEY']],
                  ['Medical Allowance', employee['MEDICAL ALLOW']],
                  ...(employee['OTHER ALLOWANCE'] > 0 ? [['Other Allowances', employee['OTHER ALLOWANCE']]] : [])
                ].map(([label, amount], index) => (
                  <div key={index} className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-green-50 transition-colors group">
                    <span className="text-gray-700 group-hover:text-green-700">{label}</span>
                    <span className="font-bold text-green-700 group-hover:text-green-800">{formatCurrency(amount as number)}</span>
                  </div>
                ))}
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl mt-4 shadow-lg">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>GROSS TOTAL</span>
                    <span>{formatCurrency(employee['GROSS SALARY'])}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-red-200/50">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 relative">
                <div className="absolute inset-0 bg-white/10"></div>
                <h4 className="relative text-lg font-bold text-white text-center flex items-center justify-center">
                  <span className="mr-2">📉</span> DEDUCTIONS
                </h4>
              </div>
              <div className="p-6 space-y-3">
                {[
                  ['Provident Fund', employee['PF']],
                  ['ESI', employee['ESI']],
                  ['TDS', employee['TDS']],
                  ['Professional Tax', employee['PT']],
                  ...(employee['SALARY ADVANCE'] > 0 ? [['Salary Advance', employee['SALARY ADVANCE']]] : [])
                ].map(([label, amount], index) => (
                  <div key={index} className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-red-50 transition-colors group">
                    <span className="text-gray-700 group-hover:text-red-700">{label}</span>
                    <span className="font-bold text-red-700 group-hover:text-red-800">{formatCurrency(amount as number)}</span>
                  </div>
                ))}
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl mt-4 shadow-lg">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>TOTAL DEDUCTIONS</span>
                    <span>{formatCurrency(employee['TOTAL DEDUCTIONS'])}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Net Pay with Spectacular Design */}
          <div className="relative mb-6 overflow-hidden rounded-2xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-green-500 to-blue-600"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="relative p-8 text-white text-center">
              <div className="mb-4">
                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 border border-white/30">
                  <span className="text-sm uppercase tracking-wider font-medium opacity-90">💵 Net Salary Payable</span>
                </div>
              </div>
              <div className="mb-4">
                <div className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                  {formatCurrency(employee['NET PAY'])}
                </div>
              </div>
              <div className="flex items-center justify-center space-x-4 text-sm opacity-90">
                <span>Take Home Pay</span>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>{formatMonthYear(employee['AS ON'])}</span>
              </div>
            </div>
          </div>

          {/* Premium Footer */}
          <div className="text-center text-sm text-gray-600 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-center mb-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <p className="font-medium text-gray-700 mb-2">This is a digitally generated payslip. No physical signature required.</p>
            <p className="text-xs text-gray-500">Generated on: {new Date().toLocaleDateString('en-IN')} • Confidential & Proprietary</p>
          </div>
        </div>
      </div>
    );
  }
);

ModernPayslipTemplate.displayName = 'ModernPayslipTemplate';

export default ModernPayslipTemplate;
