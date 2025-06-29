
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
          fontSize: '10px', 
          lineHeight: '1.4', 
          fontFamily: 'Times New Roman, Georgia, serif',
          border: '2px solid #1f2937'
        }}
      >
        <div className="p-8 h-full">
          {/* Corporate Letterhead */}
          <div className="mb-8">
            <div className="border-4 border-gray-800 p-6 bg-gradient-to-r from-gray-50 to-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-green-500 to-blue-600"></div>
              <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-green-500 to-blue-600"></div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  {processedLogoUrl ? (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-green-500 rounded-full blur-sm opacity-20 scale-110"></div>
                      <img 
                        src={processedLogoUrl}
                        alt="Company Logo"
                        className="relative w-24 h-24 object-contain border-4 border-gray-300 rounded-full bg-white p-2 shadow-lg"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 border-4 border-gray-300 rounded-full bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">LOGO</span>
                    </div>
                  )}
                  <div className="text-left">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2 tracking-wide">NAVA CHETANA</h1>
                    <h2 className="text-2xl font-semibold text-blue-700 mb-2">SOUHARDA SAHAKARI</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">Human Resources</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">Payroll Division</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
                    <div className="text-2xl font-bold mb-1">SALARY STATEMENT</div>
                    <div className="text-sm opacity-90">Official Payroll Document</div>
                  </div>
                  <div className="mt-3 bg-gradient-to-r from-blue-600 to-green-500 text-white p-3 rounded-lg text-center">
                    <div className="text-lg font-bold">{formatMonthYear(employee['AS ON'])}</div>
                    <div className="text-xs opacity-90">Pay Period</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Details Professional Table */}
          <div className="mb-6">
            <div className="bg-gray-800 text-white p-3 text-center font-bold text-sm tracking-wide">
              EMPLOYEE INFORMATION & STATUTORY DETAILS
            </div>
            <table className="w-full border-collapse border-2 border-gray-800 text-xs bg-white shadow-lg">
              <tbody>
                <tr className="bg-gray-50">
                  <td className="border border-gray-400 p-3 font-bold text-gray-700 w-1/4">Employee Name</td>
                  <td className="border border-gray-400 p-3 font-semibold text-gray-900 w-1/4">{employee['EMPLOYEE NAME']}</td>
                  <td className="border border-gray-400 p-3 font-bold text-gray-700 w-1/4">PF Number</td>
                  <td className="border border-gray-400 p-3 text-blue-700 font-semibold w-1/4">{employee['PF NO']}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-3 font-bold text-gray-700">Employee ID</td>
                  <td className="border border-gray-400 p-3 font-semibold text-blue-600">{employee['EMPLOYEE ID']}</td>
                  <td className="border border-gray-400 p-3 font-bold text-gray-700">ESI Number</td>
                  <td className="border border-gray-400 p-3 text-green-700 font-semibold">{employee['ESI NO']}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-400 p-3 font-bold text-gray-700">Designation</td>
                  <td className="border border-gray-400 p-3 text-gray-800">{employee['DESIGNATION']}</td>
                  <td className="border border-gray-400 p-3 font-bold text-gray-700">UAN</td>
                  <td className="border border-gray-400 p-3 text-gray-800">{employee['UAN']}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-3 font-bold text-gray-700">Department</td>
                  <td className="border border-gray-400 p-3 text-gray-800">{employee['DEPARTMENT']}</td>
                  <td className="border border-gray-400 p-3 font-bold text-gray-700">Date of Joining</td>
                  <td className="border border-gray-400 p-3 text-gray-800">{employee['DOJ']}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Attendance Professional Display */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white p-3 text-center font-bold text-sm tracking-wide">
              ATTENDANCE & WORKING DAYS SUMMARY
            </div>
            <div className="grid grid-cols-4 gap-0 border-2 border-gray-800">
              {[
                ['TOTAL DAYS', employee['TOTAL DAYS'], 'bg-blue-50 text-blue-800'],
                ['PRESENT DAYS', employee['PRESENT DAYS'], 'bg-green-50 text-green-800'],
                ['PAID DAYS', employee['SALARY DAYS'], 'bg-orange-50 text-orange-800'],
                ['LOP DAYS', employee['LOP'], 'bg-red-50 text-red-800']
              ].map(([label, value, className], index) => (
                <div key={index} className={`${className} border border-gray-400 p-4 text-center`}>
                  <div className="text-3xl font-bold mb-1">{value}</div>
                  <div className="text-xs font-semibold uppercase tracking-wide">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Salary Table */}
          <div className="mb-6">
            <table className="w-full border-collapse border-2 border-gray-800 text-xs shadow-lg">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border border-gray-600 p-3 text-left font-bold uppercase tracking-wide">EARNINGS COMPONENTS</th>
                  <th className="border border-gray-600 p-3 text-right font-bold uppercase tracking-wide">AMOUNT (₹)</th>
                  <th className="border border-gray-600 p-3 text-left font-bold uppercase tracking-wide">DEDUCTION COMPONENTS</th>
                  <th className="border border-gray-600 p-3 text-right font-bold uppercase tracking-wide">AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Basic Salary', employee['EARNED BASIC'], 'Provident Fund (PF)', employee['PF']],
                  ['House Rent Allowance (HRA)', employee['HRA'], 'Employee State Insurance (ESI)', employee['ESI']],
                  ['Conveyance Allowance', employee['LOCAN CONVEY'], 'Tax Deducted at Source (TDS)', employee['TDS']],
                  ['Medical Allowance', employee['MEDICAL ALLOW'], 'Professional Tax (PT)', employee['PT']]
                ].map(([earning, earningAmt, deduction, deductionAmt], index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="border border-gray-400 p-3 text-gray-700 font-medium">{earning}</td>
                    <td className="border border-gray-400 p-3 text-right font-bold text-green-700">{formatCurrency(earningAmt as number).replace('₹', '')}</td>
                    <td className="border border-gray-400 p-3 text-gray-700 font-medium">{deduction}</td>
                    <td className="border border-gray-400 p-3 text-right font-bold text-red-700">{formatCurrency(deductionAmt as number).replace('₹', '')}</td>
                  </tr>
                ))}
                
                {employee['OTHER ALLOWANCE'] > 0 && (
                  <tr className="bg-white">
                    <td className="border border-gray-400 p-3 text-gray-700 font-medium">Other Allowances</td>
                    <td className="border border-gray-400 p-3 text-right font-bold text-green-700">{formatCurrency(employee['OTHER ALLOWANCE']).replace('₹', '')}</td>
                    <td className="border border-gray-400 p-3"></td>
                    <td className="border border-gray-400 p-3"></td>
                  </tr>
                )}
                
                {employee['SALARY ADVANCE'] > 0 && (
                  <tr className="bg-gray-50">
                    <td className="border border-gray-400 p-3"></td>
                    <td className="border border-gray-400 p-3"></td>
                    <td className="border border-gray-400 p-3 text-gray-700 font-medium">Salary Advance</td>
                    <td className="border border-gray-400 p-3 text-right font-bold text-red-700">{formatCurrency(employee['SALARY ADVANCE']).replace('₹', '')}</td>
                  </tr>
                )}
                
                <tr className="bg-gradient-to-r from-gray-100 to-gray-200 font-bold border-t-4 border-gray-800">
                  <td className="border border-gray-400 p-4 text-green-800 font-bold uppercase">GROSS EARNINGS</td>
                  <td className="border border-gray-400 p-4 text-right text-green-800 font-bold text-lg">{formatCurrency(employee['GROSS SALARY']).replace('₹', '')}</td>
                  <td className="border border-gray-400 p-4 text-red-800 font-bold uppercase">TOTAL DEDUCTIONS</td>
                  <td className="border border-gray-400 p-4 text-right text-red-800 font-bold text-lg">{formatCurrency(employee['TOTAL DEDUCTIONS']).replace('₹', '')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Net Pay Professional Box */}
          <div className="mb-6">
            <div className="border-4 border-gray-800 bg-gradient-to-r from-blue-50 via-green-50 to-blue-50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-green-500 to-blue-600"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-green-500 to-blue-600"></div>
              
              <div className="p-6 text-center">
                <div className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">NET SALARY PAYABLE</div>
                <div className="text-4xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600">
                  {formatCurrency(employee['NET PAY'])}
                </div>
                <div className="text-xs text-gray-600 bg-white rounded-full px-4 py-1 inline-block border border-gray-300">
                  Gross Earnings - Total Deductions | {formatMonthYear(employee['AS ON'])}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Authorization */}
          <div className="grid grid-cols-2 gap-12 mb-6">
            <div className="text-center">
              <div className="h-16 border-b-2 border-gray-400 mb-2"></div>
              <div className="bg-gray-100 p-2 rounded">
                <p className="text-xs font-bold text-gray-700">EMPLOYEE ACKNOWLEDGMENT</p>
                <p className="text-xs text-gray-600">Signature & Date</p>
              </div>
            </div>
            <div className="text-center">
              <div className="h-16 border-b-2 border-gray-400 mb-2"></div>
              <div className="bg-gray-100 p-2 rounded">
                <p className="text-xs font-bold text-gray-700">AUTHORIZED BY HR</p>
                <p className="text-xs text-gray-600">Signature & Seal</p>
              </div>
            </div>
          </div>

          {/* Corporate Footer */}
          <div className="border-t-2 border-gray-800 pt-4">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-3 rounded-lg text-center">
              <div className="flex items-center justify-center space-x-4 mb-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <p className="text-xs font-bold uppercase tracking-wide">Confidential Payroll Document</p>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <div className="text-xs opacity-90">
                Generated on: {new Date().toLocaleDateString('en-IN')} | System Generated - No Manual Signature Required
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
