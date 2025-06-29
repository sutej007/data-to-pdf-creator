
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
  
  // Try to parse various date formats
  let date;
  if (dateString.includes('/')) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      // Assume MM/DD/YYYY or DD/MM/YYYY format
      date = new Date(parts[2], parts[1] - 1, parts[0]);
    }
  } else if (dateString.includes('-')) {
    date = new Date(dateString);
  } else {
    // Try direct parsing
    date = new Date(dateString);
  }
  
  if (date && !isNaN(date.getTime())) {
    return date.toLocaleDateString('en-IN', { 
      month: 'long', 
      year: 'numeric' 
    });
  }
  
  return dateString; // Return original if parsing fails
};

const ClassicPayslipTemplate = React.forwardRef<HTMLDivElement, ClassicPayslipTemplateProps>(
  ({ employee, processedLogoUrl }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white border-2 border-gray-300"
        style={{ 
          width: '794px', 
          height: '1123px',
          fontSize: '12px', 
          lineHeight: '1.5', 
          fontFamily: 'Arial, sans-serif'
        }}
      >
        <div className="p-6 h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b-3 border-blue-800">
            <div className="flex-shrink-0">
              {processedLogoUrl ? (
                <img 
                  src={processedLogoUrl}
                  alt="Company Logo"
                  className="w-24 h-24 object-contain"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-500">Logo</span>
                </div>
              )}
            </div>
            
            <div className="text-center flex-1 mx-4">
              <h1 className="text-3xl font-bold text-blue-800 mb-2">NAVA CHETANA</h1>
              <h2 className="text-lg font-semibold text-blue-600 mb-1">SOUHARDA SAHAKARI</h2>
              <div className="text-2xl font-bold text-gray-800 mt-3">SALARY SLIP</div>
              <div className="text-base text-gray-600 mt-2">
                For the month of {formatMonthYear(employee['AS ON'])}
              </div>
            </div>
            
            <div className="w-24"></div>
          </div>

          {/* Employee Info */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <div className="flex">
                <span className="w-32 font-semibold text-gray-700">Employee Name:</span>
                <span className="font-bold">{employee['EMPLOYEE NAME']}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold text-gray-700">Employee ID:</span>
                <span>{employee['EMPLOYEE ID']}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold text-gray-700">Designation:</span>
                <span>{employee['DESIGNATION']}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold text-gray-700">Department:</span>
                <span>{employee['DEPARTMENT']}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex">
                <span className="w-32 font-semibold text-gray-700">PF Number:</span>
                <span>{employee['PF NO']}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold text-gray-700">ESI Number:</span>
                <span>{employee['ESI NO']}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold text-gray-700">UAN:</span>
                <span>{employee['UAN']}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold text-gray-700">Date of Joining:</span>
                <span>{employee['DOJ']}</span>
              </div>
            </div>
          </div>

          {/* Attendance */}
          <div className="mb-6 p-4 bg-gray-50 border border-gray-300">
            <h3 className="font-bold text-gray-800 mb-3">ATTENDANCE DETAILS</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="font-bold text-lg text-blue-600">{employee['TOTAL DAYS']}</div>
                <div className="text-sm text-gray-600">Total Days</div>
              </div>
              <div>
                <div className="font-bold text-lg text-green-600">{employee['PRESENT DAYS']}</div>
                <div className="text-sm text-gray-600">Present Days</div>
              </div>
              <div>
                <div className="font-bold text-lg text-blue-600">{employee['SALARY DAYS']}</div>
                <div className="text-sm text-gray-600">Paid Days</div>
              </div>
              <div>
                <div className="font-bold text-lg text-red-600">{employee['LOP']}</div>
                <div className="text-sm text-gray-600">LOP Days</div>
              </div>
            </div>
          </div>

          {/* Salary Details */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Earnings */}
            <div className="border-2 border-green-500 rounded">
              <div className="bg-green-500 text-white p-2 text-center font-bold">EARNINGS</div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between border-b pb-1">
                  <span>Basic Salary</span>
                  <span className="font-semibold">{formatCurrency(employee['EARNED BASIC'])}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>HRA</span>
                  <span className="font-semibold">{formatCurrency(employee['HRA'])}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Conveyance</span>
                  <span className="font-semibold">{formatCurrency(employee['LOCAN CONVEY'])}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Medical Allowance</span>
                  <span className="font-semibold">{formatCurrency(employee['MEDICAL ALLOW'])}</span>
                </div>
                {employee['CITY COMPENSATORY ALLOWANCE (CCA)'] > 0 && (
                  <div className="flex justify-between border-b pb-1">
                    <span>CCA</span>
                    <span className="font-semibold">{formatCurrency(employee['CITY COMPENSATORY ALLOWANCE (CCA)'])}</span>
                  </div>
                )}
                {employee['OTHER ALLOWANCE'] > 0 && (
                  <div className="flex justify-between border-b pb-1">
                    <span>Other Allowances</span>
                    <span className="font-semibold">{formatCurrency(employee['OTHER ALLOWANCE'])}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-green-700 pt-2 border-t-2 border-green-500">
                  <span>GROSS SALARY</span>
                  <span>{formatCurrency(employee['GROSS SALARY'])}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="border-2 border-red-500 rounded">
              <div className="bg-red-500 text-white p-2 text-center font-bold">DEDUCTIONS</div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between border-b pb-1">
                  <span>Provident Fund</span>
                  <span className="font-semibold">{formatCurrency(employee['PF'])}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>ESI</span>
                  <span className="font-semibold">{formatCurrency(employee['ESI'])}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>TDS</span>
                  <span className="font-semibold">{formatCurrency(employee['TDS'])}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Professional Tax</span>
                  <span className="font-semibold">{formatCurrency(employee['PT'])}</span>
                </div>
                {employee['SALARY ADVANCE'] > 0 && (
                  <div className="flex justify-between border-b pb-1">
                    <span>Salary Advance</span>
                    <span className="font-semibold">{formatCurrency(employee['SALARY ADVANCE'])}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-red-700 pt-2 border-t-2 border-red-500">
                  <span>TOTAL DEDUCTIONS</span>
                  <span>{formatCurrency(employee['TOTAL DEDUCTIONS'])}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Pay */}
          <div className="bg-green-100 border-3 border-green-600 p-4 text-center mb-6 rounded">
            <div className="text-2xl font-bold text-green-800">
              NET PAY: {formatCurrency(employee['NET PAY'])}
            </div>
            <div className="text-sm text-green-600 mt-1">
              (Gross Salary - Total Deductions)
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 border-t pt-4">
            <p className="mb-1">This is a computer generated payslip and does not require signature.</p>
            <p>Generated on: {new Date().toLocaleDateString('en-IN')}</p>
          </div>
        </div>
      </div>
    );
  }
);

ClassicPayslipTemplate.displayName = 'ClassicPayslipTemplate';

export default ClassicPayslipTemplate;
