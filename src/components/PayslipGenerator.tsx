
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
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const canvas = await html2canvas(payslipRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payslip Generator</h1>
          <p className="text-lg text-gray-600">Convert Excel data to professional PDF payslips</p>
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
                <Label htmlFor="excel-upload">Select Excel file with employee data</Label>
                <Input
                  id="excel-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="mt-2"
                />
              </div>

              {employees.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">{employees.length} employees loaded</span>
                  </div>

                  <div className="grid gap-2">
                    <Button
                      onClick={generateAllPDFs}
                      disabled={isGenerating}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {isGenerating ? 'Generating PDFs...' : 'Generate All PDFs'}
                    </Button>
                  </div>

                  <div className="max-h-60 overflow-y-auto border rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-2 text-left">Name</th>
                          <th className="p-2 text-left">ID</th>
                          <th className="p-2 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((emp, index) => (
                          <tr key={index} className="border-t hover:bg-gray-50">
                            <td className="p-2">{emp['EMPLOYEE NAME']}</td>
                            <td className="p-2">{emp['EMPLOYEE ID']}</td>
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
                <div className="text-sm text-gray-600">
                  Preview will be generated when creating PDF for {selectedEmployee['EMPLOYEE NAME']}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload Excel file and select an employee to preview payslip</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Hidden Payslip Template for PDF Generation */}
        {selectedEmployee && (
          <div
            ref={payslipRef}
            className="fixed -left-full -top-full bg-white p-8"
            style={{ width: '794px', fontSize: '12px', lineHeight: '1.4' }}
          >
            <div className="border-2 border-blue-600">
              {/* Header */}
              <div className="bg-blue-600 text-white p-4 text-center">
                <h1 className="text-xl font-bold">PAYSLIP</h1>
                <p className="text-sm">For the month of {selectedEmployee['AS ON']}</p>
              </div>

              {/* Employee Details */}
              <div className="p-4 border-b">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold text-blue-600 mb-2">EMPLOYEE DETAILS</h3>
                    <div className="space-y-1">
                      <div><strong>Name:</strong> {selectedEmployee['EMPLOYEE NAME']}</div>
                      <div><strong>Employee ID:</strong> {selectedEmployee['EMPLOYEE ID']}</div>
                      <div><strong>Designation:</strong> {selectedEmployee['DESIGNATION']}</div>
                      <div><strong>Department:</strong> {selectedEmployee['DEPARTMENT']}</div>
                      <div><strong>Branch:</strong> {selectedEmployee['BRANCH']}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-600 mb-2">EMPLOYMENT INFO</h3>
                    <div className="space-y-1">
                      <div><strong>Date of Joining:</strong> {selectedEmployee['DOJ']}</div>
                      <div><strong>PF No:</strong> {selectedEmployee['PF NO']}</div>
                      <div><strong>ESI No:</strong> {selectedEmployee['ESI NO']}</div>
                      <div><strong>UAN:</strong> {selectedEmployee['UAN']}</div>
                      <div><strong>Status:</strong> {selectedEmployee['STATUS']}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance */}
              <div className="p-4 border-b">
                <h3 className="font-bold text-blue-600 mb-2">ATTENDANCE DETAILS</h3>
                <div className="grid grid-cols-4 gap-4 text-xs">
                  <div><strong>Total Days:</strong> {selectedEmployee['TOTAL DAYS']}</div>
                  <div><strong>Present Days:</strong> {selectedEmployee['PRESENT DAYS']}</div>
                  <div><strong>Salary Days:</strong> {selectedEmployee['SALARY DAYS']}</div>
                  <div><strong>LOP:</strong> {selectedEmployee['LOP']}</div>
                </div>
              </div>

              {/* Salary Details */}
              <div className="grid grid-cols-2">
                {/* Earnings */}
                <div className="p-4 border-r">
                  <h3 className="font-bold text-green-600 mb-2">EARNINGS</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Basic Salary:</span>
                      <span>{formatCurrency(selectedEmployee['EARNED BASIC'])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>HRA:</span>
                      <span>{formatCurrency(selectedEmployee['HRA'])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conveyance:</span>
                      <span>{formatCurrency(selectedEmployee['LOCAN CONVEY'])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medical Allowance:</span>
                      <span>{formatCurrency(selectedEmployee['MEDICAL ALLOW'])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CCA:</span>
                      <span>{formatCurrency(selectedEmployee['CITY COMPENSATORY ALLOWANCE (CCA)'])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Allowances:</span>
                      <span>{formatCurrency(selectedEmployee['OTHER ALLOWANCE'])}</span>
                    </div>
                    {selectedEmployee['INCENTIVE'] > 0 && (
                      <div className="flex justify-between">
                        <span>Incentive:</span>
                        <span>{formatCurrency(selectedEmployee['INCENTIVE'])}</span>
                      </div>
                    )}
                    <div className="border-t pt-1 mt-2 font-bold flex justify-between">
                      <span>Gross Salary:</span>
                      <span>{formatCurrency(selectedEmployee['GROSS SALARY'])}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="p-4">
                  <h3 className="font-bold text-red-600 mb-2">DEDUCTIONS</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>PF:</span>
                      <span>{formatCurrency(selectedEmployee['PF'])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ESI:</span>
                      <span>{formatCurrency(selectedEmployee['ESI'])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TDS:</span>
                      <span>{formatCurrency(selectedEmployee['TDS'])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PT:</span>
                      <span>{formatCurrency(selectedEmployee['PT'])}</span>
                    </div>
                    {selectedEmployee['STAFF WELFARE'] > 0 && (
                      <div className="flex justify-between">
                        <span>Staff Welfare:</span>
                        <span>{formatCurrency(selectedEmployee['STAFF WELFARE'])}</span>
                      </div>
                    )}
                    {selectedEmployee['SALARY ADVANCE'] > 0 && (
                      <div className="flex justify-between">
                        <span>Salary Advance:</span>
                        <span>{formatCurrency(selectedEmployee['SALARY ADVANCE'])}</span>
                      </div>
                    )}
                    <div className="border-t pt-1 mt-2 font-bold flex justify-between">
                      <span>Total Deductions:</span>
                      <span>{formatCurrency(selectedEmployee['TOTAL DEDUCTIONS'])}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Pay */}
              <div className="bg-green-50 p-4 text-center border-t-2 border-green-500">
                <div className="text-lg font-bold text-green-700">
                  NET PAY: {formatCurrency(selectedEmployee['NET PAY'])}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 text-center text-xs text-gray-600 border-t">
                <p>This is a computer generated payslip and does not require signature.</p>
                <p>Generated on: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayslipGenerator;
