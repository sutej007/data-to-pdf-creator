
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
      // Convert string parts to numbers
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
          lineHeight: '1.4', 
          fontFamily: 'Inter, Arial, sans-serif'
        }}
      >
        <div className="p-8 h-full bg-gradient-to-br from-blue-50 to-white">
          {/* Modern Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg mb-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {processedLogoUrl ? (
                  <img 
                    src={processedLogoUrl}
                    alt="Company Logo"
                    className="w-16 h-16 object-contain bg-white rounded-full p-2"
                  />
                ) : (
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-xs">Logo</span>
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold">NAVA CHETANA</h1>
                  <p className="text-blue-200">SOUHARDA SAHAKARI</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">PAYSLIP</div>
                <div className="text-blue-200 text-sm">
                  {formatMonthYear(employee['AS ON'])}
                </div>
              </div>
            </div>
          </div>

          {/* Employee Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Employee Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Name</span>
                  <span className="font-semibold text-gray-800">{employee['EMPLOYEE NAME']}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Employee ID</span>
                  <span className="font-semibold text-gray-800">{employee['EMPLOYEE ID']}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Designation</span>
                  <span className="font-semibold text-gray-800">{employee['DESIGNATION']}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Department</span>
                  <span className="font-semibold text-gray-800">{employee['DEPARTMENT']}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">PF Number</span>
                  <span className="font-semibold text-gray-800">{employee['PF NO']}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">UAN</span>
                  <span className="font-semibold text-gray-800">{employee['UAN']}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Dashboard */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 text-center shadow-md border-t-4 border-blue-500">
              <div className="text-2xl font-bold text-blue-600">{employee['TOTAL DAYS']}</div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">Total Days</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-md border-t-4 border-green-500">
              <div className="text-2xl font-bold text-green-600">{employee['PRESENT DAYS']}</div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">Present</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-md border-t-4 border-orange-500">
              <div className="text-2xl font-bold text-orange-600">{employee['SALARY DAYS']}</div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">Paid Days</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-md border-t-4 border-red-500">
              <div className="text-2xl font-bold text-red-600">{employee['LOP']}</div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">LOP</div>
            </div>
          </div>

          {/* Salary Breakdown */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Earnings */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-500 text-white p-3">
                <h4 className="font-bold text-center">EARNINGS</h4>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">Basic Salary</span>
                  <span className="font-semibold">{formatCurrency(employee['EARNED BASIC'])}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">HRA</span>
                  <span className="font-semibold">{formatCurrency(employee['HRA'])}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">Conveyance</span>
                  <span className="font-semibold">{formatCurrency(employee['LOCAN CONVEY'])}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">Medical Allow.</span>
                  <span className="font-semibold">{formatCurrency(employee['MEDICAL ALLOW'])}</span>
                </div>
                {employee['OTHER ALLOWANCE'] > 0 && (
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Other Allow.</span>
                    <span className="font-semibold">{formatCurrency(employee['OTHER ALLOWANCE'])}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 font-bold text-green-700 border-t-2 border-green-500">
                  <span>GROSS TOTAL</span>
                  <span>{formatCurrency(employee['GROSS SALARY'])}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-red-500 text-white p-3">
                <h4 className="font-bold text-center">DEDUCTIONS</h4>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">Provident Fund</span>
                  <span className="font-semibold">{formatCurrency(employee['PF'])}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">ESI</span>
                  <span className="font-semibold">{formatCurrency(employee['ESI'])}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">TDS</span>
                  <span className="font-semibold">{formatCurrency(employee['TDS'])}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">Professional Tax</span>
                  <span className="font-semibold">{formatCurrency(employee['PT'])}</span>
                </div>
                {employee['SALARY ADVANCE'] > 0 && (
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Salary Advance</span>
                    <span className="font-semibold">{formatCurrency(employee['SALARY ADVANCE'])}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 font-bold text-red-700 border-t-2 border-red-500">
                  <span>TOTAL DEDUCTIONS</span>
                  <span>{formatCurrency(employee['TOTAL DEDUCTIONS'])}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Pay Banner */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg text-center mb-6 shadow-lg">
            <div className="text-sm uppercase tracking-wide opacity-90">Net Salary</div>
            <div className="text-3xl font-bold">{formatCurrency(employee['NET PAY'])}</div>
            <div className="text-sm opacity-90 mt-1">Take Home Pay</div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 border-t border-gray-200 pt-4">
            <p>This is a computer generated payslip. No signature required.</p>
            <p className="mt-1">Generated on: {new Date().toLocaleDateString('en-IN')}</p>
          </div>
        </div>
      </div>
    );
  }
);

ModernPayslipTemplate.displayName = 'ModernPayslipTemplate';

export default ModernPayslipTemplate;
