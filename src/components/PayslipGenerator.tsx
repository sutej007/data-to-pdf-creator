
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, FileText, Users } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface EmployeeData {
  'SL NO': number;
  'EMPLOYEE ID': string;
  'EMPLOYEE NAME': string;
  'STATUS': string;
  'DESIGNATION': string;
  'DEPARTMENT': string;
  'BRANCH': string;
  'PF NO': string;
  'ESI NO': string;
  'UAN': string;
  'DOJ': string;
  'AS ON': string;
  'NO OF DAYS': number;
  'TOTAL DAYS': number;
  'PRESENT DAYS': number;
  'SH': number;
  'CL': number;
  'SL': number;
  'EL': number;
  'LD': number;
  'ML': number;
  'LOP': number;
  'SALARY DAYS': number;
  'BASIC': number;
  'EARNED BASIC': number;
  'HRA': number;
  'LOCAN CONVEY': number;
  'MEDICAL ALLOW': number;
  'CITY COMPENSATORY ALLOWANCE (CCA)': number;
  'CHILDREN EDUCATION ALLOWANCE (CEA)': number;
  'COMPOSITE ALLOWANCE': number;
  'OTHER ALLOWANCE': number;
  'TRAVELLING ALLOWANCE': number;
  'Total Additions': number;
  'INCENTIVE': number;
  'GROSS SALARY': number;
  'ESI': number;
  'PF': number;
  'TDS': number;
  'PT': number;
  'SSD': number;
  'STAFF WELFARE': number;
  'STAFF RD': number;
  'NVSSN LOAN': number;
  'SALARY ADVANCE': number;
  'TOTAL DEDUCTIONS': number;
  'NET PAY': number;
}

const PayslipGenerator = () => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const payslipRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as EmployeeData[];
        
        setEmployees(jsonData);
        toast.success(`Successfully loaded ${jsonData.length} employee records`);
      } catch (error) {
        toast.error('Error reading Excel file. Please check the format.');
        console.error('Excel parsing error:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const generatePDF = async (employee: EmployeeData) => {
    if (!payslipRef.current) return;

    setIsGenerating(true);
    setSelectedEmployee(employee);

    // Wait for the component to render
    await new Promise(resolve => setTimeout(resolve, 200));

    try {
      const canvas = await html2canvas(payslipRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Payslip_${employee['EMPLOYEE NAME']}_${employee['AS ON']}.pdf`);
      
      toast.success(`PDF generated for ${employee['EMPLOYEE NAME']}`);
    } catch (error) {
      toast.error('Error generating PDF');
      console.error('PDF generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAllPDFs = async () => {
    if (employees.length === 0) return;

    setIsGenerating(true);
    toast.info(`Starting bulk PDF generation for ${employees.length} employees...`);

    for (let i = 0; i < employees.length; i++) {
      await generatePDF(employees[i]);
      // Small delay between generations
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsGenerating(false);
    toast.success('All PDFs generated successfully!');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Professional Payslip Generator</h1>
          <p className="text-lg text-gray-600">Convert Excel employee data to professional PDF payslips</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload and Controls */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Excel File
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="excel-upload">Select Excel file with employee salary data</Label>
                <Input
                  id="excel-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supports Excel files with standard payroll headers
                </p>
              </div>

              {employees.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">{employees.length} employees loaded successfully</span>
                  </div>

                  <div className="grid gap-2">
                    <Button
                      onClick={generateAllPDFs}
                      disabled={isGenerating}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {isGenerating ? 'Generating PDFs...' : `Generate All ${employees.length} PDFs`}
                    </Button>
                  </div>

                  <div className="max-h-60 overflow-y-auto border rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="p-2 text-left font-medium">Employee Name</th>
                          <th className="p-2 text-left font-medium">ID</th>
                          <th className="p-2 text-left font-medium">Net Pay</th>
                          <th className="p-2 text-left font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((emp, index) => (
                          <tr key={index} className="border-t hover:bg-gray-50">
                            <td className="p-2 font-medium">{emp['EMPLOYEE NAME']}</td>
                            <td className="p-2 text-gray-600">{emp['EMPLOYEE ID']}</td>
                            <td className="p-2 text-green-600 font-medium">{formatCurrency(emp['NET PAY'])}</td>
                            <td className="p-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => generatePDF(emp)}
                                disabled={isGenerating}
                              >
                                <FileText className="h-3 w-3 mr-1" />
                                PDF
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Payslip Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedEmployee ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-900">
                    Preview for: {selectedEmployee['EMPLOYEE NAME']}
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Employee ID: {selectedEmployee['EMPLOYEE ID']}</div>
                    <div>Department: {selectedEmployee['DEPARTMENT']}</div>
                    <div>Period: {selectedEmployee['AS ON']}</div>
                    <div className="font-medium text-green-600">Net Pay: {formatCurrency(selectedEmployee['NET PAY'])}</div>
                  </div>
                  <div className="text-xs text-blue-600 mt-3">
                    PDF will be generated with professional formatting
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Upload Excel file to see employee data</p>
                  <p className="text-xs text-gray-400 mt-1">Individual PDFs will be generated for each employee</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Hidden Professional Payslip Template */}
        {selectedEmployee && (
          <div
            ref={payslipRef}
            className="fixed -left-full -top-full bg-white"
            style={{ width: '794px', fontSize: '11px', lineHeight: '1.4', fontFamily: 'Arial, sans-serif' }}
          >
            <div className="p-8 border-2 border-gray-300">
              {/* Company Header */}
              <div className="text-center mb-8 pb-4 border-b-2 border-blue-600">
                <div className="text-2xl font-bold text-blue-800 mb-2">PAYSLIP</div>
                <div className="text-sm text-gray-600">For the month of {selectedEmployee['AS ON']}</div>
              </div>

              {/* Employee Information */}
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <div className="text-sm font-bold text-blue-700 mb-3 pb-1 border-b border-blue-200">EMPLOYEE DETAILS</div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600 w-32">Name:</span>
                      <span className="font-medium flex-1">{selectedEmployee['EMPLOYEE NAME']}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 w-32">Employee ID:</span>
                      <span className="font-medium flex-1">{selectedEmployee['EMPLOYEE ID']}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 w-32">Designation:</span>
                      <span className="font-medium flex-1">{selectedEmployee['DESIGNATION']}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 w-32">Department:</span>
                      <span className="font-medium flex-1">{selectedEmployee['DEPARTMENT']}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 w-32">Branch:</span>
                      <span className="font-medium flex-1">{selectedEmployee['BRANCH']}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-bold text-blue-700 mb-3 pb-1 border-b border-blue-200">STATUTORY INFO</div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600 w-32">Date of Joining:</span>
                      <span className="font-medium flex-1">{selectedEmployee['DOJ']}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 w-32">PF Number:</span>
                      <span className="font-medium flex-1">{selectedEmployee['PF NO']}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 w-32">ESI Number:</span>
                      <span className="font-medium flex-1">{selectedEmployee['ESI NO']}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 w-32">UAN:</span>
                      <span className="font-medium flex-1">{selectedEmployee['UAN']}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 w-32">Status:</span>
                      <span className="font-medium flex-1">{selectedEmployee['STATUS']}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance */}
              <div className="mb-6">
                <div className="text-sm font-bold text-blue-700 mb-3 pb-1 border-b border-blue-200">ATTENDANCE SUMMARY</div>
                <div className="grid grid-cols-4 gap-4 text-xs">
                  <div className="text-center p-2 bg-gray-50 rounded border">
                    <div className="font-bold text-blue-600 text-sm">{selectedEmployee['TOTAL DAYS']}</div>
                    <div className="text-gray-600 text-xs">Total Days</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded border">
                    <div className="font-bold text-green-600 text-sm">{selectedEmployee['PRESENT DAYS']}</div>
                    <div className="text-gray-600 text-xs">Present Days</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded border">
                    <div className="font-bold text-blue-600 text-sm">{selectedEmployee['SALARY DAYS']}</div>
                    <div className="text-gray-600 text-xs">Paid Days</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded border">
                    <div className="font-bold text-red-600 text-sm">{selectedEmployee['LOP']}</div>
                    <div className="text-gray-600 text-xs">LOP Days</div>
                  </div>
                </div>
              </div>

              {/* Salary Details */}
              <div className="grid grid-cols-2 gap-8 mb-6">
                {/* Earnings */}
                <div className="border border-green-200 p-4 rounded">
                  <div className="text-sm font-bold text-green-700 mb-3 pb-1 border-b border-green-300">EARNINGS</div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span>Basic Salary</span>
                      <span className="font-medium">{formatCurrency(selectedEmployee['EARNED BASIC'])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>House Rent Allowance</span>
                      <span className="font-medium">{formatCurrency(selectedEmployee['HRA'])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conveyance Allowance</span>
                      <span className="font-medium">{formatCurrency(selectedEmployee['LOCAN CONVEY'])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medical Allowance</span>
                      <span className="font-medium">{formatCurrency(selectedEmployee['MEDICAL ALLOW'])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>City Compensatory Allow.</span>
                      <span className="font-medium">{formatCurrency(selectedEmployee['CITY COMPENSATORY ALLOWANCE (CCA)'])}</span>
                    </div>
                    {selectedEmployee['CHILDREN EDUCATION ALLOWANCE (CEA)'] > 0 && (
                      <div className="flex justify-between">
                        <span>Children Education Allow.</span>
                        <span className="font-medium">{formatCurrency(selectedEmployee['CHILDREN EDUCATION ALLOWANCE (CEA)'])}</span>
                      </div>
                    )}
                    {selectedEmployee['OTHER ALLOWANCE'] > 0 && (
                      <div className="flex justify-between">
                        <span>Other Allowances</span>
                        <span className="font-medium">{formatCurrency(selectedEmployee['OTHER ALLOWANCE'])}</span>
                      </div>
                    )}
                    {selectedEmployee['INCENTIVE'] > 0 && (
                      <div className="flex justify-between">
                        <span>Incentive</span>
                        <span className="font-medium">{formatCurrency(selectedEmployee['INCENTIVE'])}</span>
                      </div>
                    )}
                    <div className="border-t border-green-300 pt-2 mt-2 flex justify-between font-bold text-green-700">
                      <span>GROSS SALARY</span>
                      <span>{formatCurrency(selectedEmployee['GROSS SALARY'])}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="border border-red-200 p-4 rounded">
                  <div className="text-sm font-bold text-red-700 mb-3 pb-1 border-b border-red-300">DEDUCTIONS</div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span>Provident Fund</span>
                      <span className="font-medium">{formatCurrency(selectedEmployee['PF'])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Employee State Insurance</span>
                      <span className="font-medium">{formatCurrency(selectedEmployee['ESI'])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax Deducted at Source</span>
                      <span className="font-medium">{formatCurrency(selectedEmployee['TDS'])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Professional Tax</span>
                      <span className="font-medium">{formatCurrency(selectedEmployee['PT'])}</span>
                    </div>
                    {selectedEmployee['STAFF WELFARE'] > 0 && (
                      <div className="flex justify-between">
                        <span>Staff Welfare</span>
                        <span className="font-medium">{formatCurrency(selectedEmployee['STAFF WELFARE'])}</span>
                      </div>
                    )}
                    {selectedEmployee['SALARY ADVANCE'] > 0 && (
                      <div className="flex justify-between">
                        <span>Salary Advance</span>
                        <span className="font-medium">{formatCurrency(selectedEmployee['SALARY ADVANCE'])}</span>
                      </div>
                    )}
                    <div className="border-t border-red-300 pt-2 mt-2 flex justify-between font-bold text-red-700">
                      <span>TOTAL DEDUCTIONS</span>
                      <span>{formatCurrency(selectedEmployee['TOTAL DEDUCTIONS'])}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Pay Section */}
              <div className="bg-green-50 border-2 border-green-500 p-4 rounded text-center mb-6">
                <div className="text-lg font-bold text-green-700">
                  NET PAY: {formatCurrency(selectedEmployee['NET PAY'])}
                </div>
                <div className="text-xs text-green-600 mt-1">
                  (Gross Salary - Total Deductions)
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-gray-600 border-t pt-4">
                <p className="mb-1">This is a computer generated payslip and does not require signature.</p>
                <p>Generated on: {new Date().toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayslipGenerator;
