
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
      date = new Date(parts[2], parts[1] - 1, parts[0]);
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
        className="bg-white border border-gray-300"
        style={{ 
          width: '794px', 
          height: '1123px',
          fontSize: '10px', 
          lineHeight: '1.3', 
          fontFamily: 'Times New Roman, serif'
        }}
      >
        <div className="p-6 h-full">
          {/* Letterhead */}
          <div className="text-center mb-6 pb-4 border-b-2 border-gray-800">
            <div className="flex items-center justify-center mb-4">
              {processedLogoUrl ? (
                <img 
                  src={processedLogoUrl}
                  alt="Company Logo"
                  className="w-20 h-20 object-contain mr-4"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded mr-4 flex items-center justify-center">
                  <span className="text-xs text-gray-500">Logo</span>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">NAVA CHETANA</h1>
                <h2 className="text-lg font-semibold text-gray-700">SOUHARDA SAHAKARI</h2>
                <p className="text-sm text-gray-600">Payroll Department</p>
              </div>
            </div>
            <div className="bg-gray-800 text-white py-2 px-4 inline-block rounded">
              <span className="text-lg font-bold">SALARY STATEMENT</span>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Period: {formatMonthYear(employee['AS ON'])}
            </div>
          </div>

          {/* Employee Details Table */}
          <div className="mb-6">
            <table className="w-full border-collapse border border-gray-400 text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 p-2 text-left font-bold">EMPLOYEE INFORMATION</th>
                  <th className="border border-gray-400 p-2 text-left font-bold">DETAILS</th>
                  <th className="border border-gray-400 p-2 text-left font-bold">STATUTORY INFO</th>
                  <th className="border border-gray-400 p-2 text-left font-bold">DETAILS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-400 p-2 font-semibold">Employee Name</td>
                  <td className="border border-gray-400 p-2">{employee['EMPLOYEE NAME']}</td>
                  <td className="border border-gray-400 p-2 font-semibold">PF Number</td>
                  <td className="border border-gray-400 p-2">{employee['PF NO']}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 font-semibold">Employee ID</td>
                  <td className="border border-gray-400 p-2">{employee['EMPLOYEE ID']}</td>
                  <td className="border border-gray-400 p-2 font-semibold">ESI Number</td>
                  <td className="border border-gray-400 p-2">{employee['ESI NO']}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 font-semibold">Designation</td>
                  <td className="border border-gray-400 p-2">{employee['DESIGNATION']}</td>
                  <td className="border border-gray-400 p-2 font-semibold">UAN</td>
                  <td className="border border-gray-400 p-2">{employee['UAN']}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 font-semibold">Department</td>
                  <td className="border border-gray-400 p-2">{employee['DEPARTMENT']}</td>
                  <td className="border border-gray-400 p-2 font-semibold">Date of Joining</td>
                  <td className="border border-gray-400 p-2">{employee['DOJ']}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Attendance Table */}
          <div className="mb-6">
            <table className="w-full border-collapse border border-gray-400 text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 p-2 text-center font-bold">TOTAL DAYS</th>
                  <th className="border border-gray-400 p-2 text-center font-bold">PRESENT DAYS</th>
                  <th className="border border-gray-400 p-2 text-center font-bold">PAID DAYS</th>
                  <th className="border border-gray-400 p-2 text-center font-bold">LOP DAYS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-400 p-2 text-center font-bold text-lg">{employee['TOTAL DAYS']}</td>
                  <td className="border border-gray-400 p-2 text-center font-bold text-lg text-green-600">{employee['PRESENT DAYS']}</td>
                  <td className="border border-gray-400 p-2 text-center font-bold text-lg text-blue-600">{employee['SALARY DAYS']}</td>
                  <td className="border border-gray-400 p-2 text-center font-bold text-lg text-red-600">{employee['LOP']}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Salary Details Table */}
          <div className="mb-6">
            <table className="w-full border-collapse border border-gray-400 text-xs">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border border-gray-400 p-2 text-left font-bold">EARNINGS</th>
                  <th className="border border-gray-400 p-2 text-right font-bold">AMOUNT (₹)</th>
                  <th className="border border-gray-400 p-2 text-left font-bold">DEDUCTIONS</th>
                  <th className="border border-gray-400 p-2 text-right font-bold">AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-400 p-2">Basic Salary</td>
                  <td className="border border-gray-400 p-2 text-right font-semibold">{formatCurrency(employee['EARNED BASIC']).replace('₹', '')}</td>
                  <td className="border border-gray-400 p-2">Provident Fund</td>
                  <td className="border border-gray-400 p-2 text-right font-semibold">{formatCurrency(employee['PF']).replace('₹', '')}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2">House Rent Allowance</td>
                  <td className="border border-gray-400 p-2 text-right font-semibold">{formatCurrency(employee['HRA']).replace('₹', '')}</td>
                  <td className="border border-gray-400 p-2">Employee State Insurance</td>
                  <td className="border border-gray-400 p-2 text-right font-semibold">{formatCurrency(employee['ESI']).replace('₹', '')}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2">Conveyance Allowance</td>
                  <td className="border border-gray-400 p-2 text-right font-semibold">{formatCurrency(employee['LOCAN CONVEY']).replace('₹', '')}</td>
                  <td className="border border-gray-400 p-2">Tax Deducted at Source</td>
                  <td className="border border-gray-400 p-2 text-right font-semibold">{formatCurrency(employee['TDS']).replace('₹', '')}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2">Medical Allowance</td>
                  <td className="border border-gray-400 p-2 text-right font-semibold">{formatCurrency(employee['MEDICAL ALLOW']).replace('₹', '')}</td>
                  <td className="border border-gray-400 p-2">Professional Tax</td>
                  <td className="border border-gray-400 p-2 text-right font-semibold">{formatCurrency(employee['PT']).replace('₹', '')}</td>
                </tr>
                {employee['OTHER ALLOWANCE'] > 0 && (
                  <tr>
                    <td className="border border-gray-400 p-2">Other Allowances</td>
                    <td className="border border-gray-400 p-2 text-right font-semibold">{formatCurrency(employee['OTHER ALLOWANCE']).replace('₹', '')}</td>
                    <td className="border border-gray-400 p-2"></td>
                    <td className="border border-gray-400 p-2"></td>
                  </tr>
                )}
                {employee['SALARY ADVANCE'] > 0 && (
                  <tr>
                    <td className="border border-gray-400 p-2"></td>
                    <td className="border border-gray-400 p-2"></td>
                    <td className="border border-gray-400 p-2">Salary Advance</td>
                    <td className="border border-gray-400 p-2 text-right font-semibold">{formatCurrency(employee['SALARY ADVANCE']).replace('₹', '')}</td>
                  </tr>
                )}
                <tr className="bg-gray-100 font-bold">
                  <td className="border border-gray-400 p-2">GROSS EARNINGS</td>
                  <td className="border border-gray-400 p-2 text-right">{formatCurrency(employee['GROSS SALARY']).replace('₹', '')}</td>
                  <td className="border border-gray-400 p-2">TOTAL DEDUCTIONS</td>
                  <td className="border border-gray-400 p-2 text-right">{formatCurrency(employee['TOTAL DEDUCTIONS']).replace('₹', '')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Net Pay */}
          <div className="border-2 border-gray-800 p-4 text-center mb-6">
            <div className="text-sm font-bold text-gray-700 mb-2">NET SALARY PAYABLE</div>
            <div className="text-2xl font-bold text-gray-800">
              {formatCurrency(employee['NET PAY'])}
            </div>
            <div className="text-xs text-gray-600 mt-2">
              (Gross Earnings - Total Deductions)
            </div>
          </div>

          {/* Authorization */}
          <div className="grid grid-cols-2 gap-8 mb-4">
            <div className="text-center">
              <div className="border-t border-gray-400 pt-2 mt-8">
                <p className="text-xs font-semibold">Employee Signature</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-gray-400 pt-2 mt-8">
                <p className="text-xs font-semibold">Authorized Signatory</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 border-t border-gray-300 pt-2">
            <p>This is a system generated payslip and is valid without signature.</p>
            <p>Generated on: {new Date().toLocaleDateString('en-IN')} | CONFIDENTIAL DOCUMENT</p>
          </div>
        </div>
      </div>
    );
  }
);

ProfessionalPayslipTemplate.displayName = 'ProfessionalPayslipTemplate';

export default ProfessionalPayslipTemplate;
