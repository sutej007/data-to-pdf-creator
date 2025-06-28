import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, FileText, Users, Loader2, Smartphone } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

const PayslipGenerator = () => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [columnMapping, setColumnMapping] = useState<{[key: string]: string}>({});
  const [isMobile, setIsMobile] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const payslipRef = useRef<HTMLDivElement>(null);

  // Function to convert number to words
  const convertNumberToWords = (amount: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Lakh', 'Crore'];

    if (amount === 0) return 'Zero';

    const convertHundreds = (num: number): string => {
      let result = '';
      
      if (num >= 100) {
        result += ones[Math.floor(num / 100)] + ' Hundred ';
        num %= 100;
      }
      
      if (num >= 20) {
        result += tens[Math.floor(num / 10)] + ' ';
        num %= 10;
      } else if (num >= 10) {
        result += teens[num - 10] + ' ';
        return result;
      }
      
      if (num > 0) {
        result += ones[num] + ' ';
      }
      
      return result;
    };

    let result = '';
    let groupIndex = 0;
    
    // Handle Indian numbering system (lakhs and crores)
    const groups = [];
    let remaining = Math.floor(amount);
    
    // First group: ones and tens
    if (remaining > 0) {
      groups.push(remaining % 100);
      remaining = Math.floor(remaining / 100);
    }
    
    // Second group: hundreds
    if (remaining > 0) {
      groups.push(remaining % 10);
      remaining = Math.floor(remaining / 10);
    }
    
    // Remaining groups: thousands, lakhs, crores (groups of 2 digits each)
    while (remaining > 0) {
      groups.push(remaining % 100);
      remaining = Math.floor(remaining / 100);
    }
    
    // Convert each group
    for (let i = groups.length - 1; i >= 0; i--) {
      if (groups[i] > 0) {
        if (i === 0) {
          // Ones and tens
          if (groups[i] >= 20) {
            result += tens[Math.floor(groups[i] / 10)] + ' ';
            if (groups[i] % 10 > 0) {
              result += ones[groups[i] % 10] + ' ';
            }
          } else if (groups[i] >= 10) {
            result += teens[groups[i] - 10] + ' ';
          } else {
            result += ones[groups[i]] + ' ';
          }
        } else if (i === 1) {
          // Hundreds
          result += ones[groups[i]] + ' Hundred ';
        } else {
          // Thousands, lakhs, crores
          if (groups[i] >= 20) {
            result += tens[Math.floor(groups[i] / 10)] + ' ';
            if (groups[i] % 10 > 0) {
              result += ones[groups[i] % 10] + ' ';
            }
          } else if (groups[i] >= 10) {
            result += teens[groups[i] - 10] + ' ';
          } else {
            result += ones[groups[i]] + ' ';
          }
          
          if (i === 2) result += 'Thousand ';
          else if (i === 3) result += 'Lakh ';
          else if (i === 4) result += 'Crore ';
        }
      }
    }
    
    return result.trim() + ' Only';
  };

  // Check if device is mobile and handle PWA install prompt
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Handle PWA install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        toast.success('App installed successfully!');
      }
      setInstallPrompt(null);
    }
  };

  // Function to find the best matching column for a given field
  const findBestMatch = (headers: string[], patterns: string[]): string | null => {
    for (const pattern of patterns) {
      const exactMatch = headers.find(h => h.toLowerCase() === pattern.toLowerCase());
      if (exactMatch) return exactMatch;
    }
    
    for (const pattern of patterns) {
      const partialMatch = headers.find(h => 
        h.toLowerCase().includes(pattern.toLowerCase()) || 
        pattern.toLowerCase().includes(h.toLowerCase())
      );
      if (partialMatch) return partialMatch;
    }
    
    return null;
  };

  // Define field mapping patterns
  const fieldMappings = {
    'EMPLOYEE NAME': ['employee name', 'emp name', 'name', 'employee_name', 'empname', 'full name', 'worker name'],
    'EMPLOYEE ID': ['employee id', 'emp id', 'id', 'employee_id', 'empid', 'staff id', 'worker id', 'employee code'],
    'NET PAY': ['net pay', 'netpay', 'net salary', 'take home', 'net amount', 'final pay'],
    'GROSS SALARY': ['gross salary', 'gross pay', 'gross', 'total salary', 'gross amount'],
    'TOTAL DEDUCTIONS': ['total deductions', 'deductions', 'total deduction', 'deduction total'],
    'EARNED BASIC': ['earned basic', 'basic salary', 'basic pay', 'basic', 'base salary'],
    'HRA': ['hra', 'house rent allowance', 'house rent', 'rent allowance'],
    'LOCAN CONVEY': ['conveyance', 'conveyance allowance', 'transport allowance', 'travel allowance', 'locan convey'],
    'MEDICAL ALLOW': ['medical allowance', 'medical', 'health allowance', 'medical allow'],
    'CITY COMPENSATORY ALLOWANCE (CCA)': ['cca', 'city compensatory allowance', 'city allowance'],
    'CHILDREN EDUCATION ALLOWANCE (CEA)': ['cea', 'children education allowance', 'education allowance'],
    'OTHER ALLOWANCE': ['other allowance', 'other', 'miscellaneous allowance', 'misc allowance'],
    'INCENTIVE': ['incentive', 'bonus', 'performance bonus', 'incentive pay'],
    'PF': ['pf', 'provident fund', 'pf deduction', 'epf'],
    'ESI': ['esi', 'employee state insurance', 'esic'],
    'TDS': ['tds', 'tax deducted at source', 'income tax', 'tax'],
    'PT': ['pt', 'professional tax', 'prof tax'],
    'STAFF WELFARE': ['staff welfare', 'welfare', 'staff welfare fund'],
    'SALARY ADVANCE': ['salary advance', 'advance', 'salary loan', 'advance salary'],
    'TOTAL DAYS': ['total days', 'calendar days', 'month days'],
    'PRESENT DAYS': ['present days', 'working days', 'attended days', 'days worked'],
    'SALARY DAYS': ['salary days', 'paid days', 'payable days'],
    'LOP': ['lop', 'loss of pay', 'unpaid days', 'absent days'],
    'DESIGNATION': ['designation', 'position', 'job title', 'role', 'post'],
    'DEPARTMENT': ['department', 'dept', 'division', 'section'],
    'BRANCH': ['branch', 'location', 'office', 'site'],
    'PF NO': ['pf no', 'pf number', 'provident fund number', 'pf_no'],
    'ESI NO': ['esi no', 'esi number', 'esic number', 'esi_no'],
    'UAN': ['uan', 'uan number', 'universal account number'],
    'DOJ': ['doj', 'date of joining', 'joining date', 'join date'],
    'AS ON': ['as on', 'month', 'period', 'salary month', 'pay period'],
    'STATUS': ['status', 'employment status', 'emp status', 'employee status']
  };

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
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];
        
        console.log('Raw Excel data:', jsonData);
        
        if (jsonData.length === 0) {
          toast.error('Excel file appears to be empty');
          return;
        }

        // Get column headers from the first row
        const firstRow = jsonData[0];
        const excelHeaders = Object.keys(firstRow);
        console.log('Excel column headers:', excelHeaders);
        
        // Create column mapping
        const mapping: {[key: string]: string} = {};
        const mappingResults: string[] = [];
        
        Object.entries(fieldMappings).forEach(([standardField, patterns]) => {
          const matchedColumn = findBestMatch(excelHeaders, patterns);
          if (matchedColumn) {
            mapping[standardField] = matchedColumn;
            mappingResults.push(`${standardField} → ${matchedColumn}`);
          } else {
            mappingResults.push(`${standardField} → NOT FOUND`);
          }
        });
        
        setColumnMapping(mapping);
        setDebugInfo(`Column Mapping:\n${mappingResults.join('\n')}`);
        console.log('Column mapping:', mapping);
        
        // Process the data using the mapping
        const processedData = jsonData.map((row, index) => {
          const processedRow: any = {};
          
          // Map each field using the column mapping
          Object.entries(fieldMappings).forEach(([standardField]) => {
            const excelColumn = mapping[standardField];
            if (excelColumn && row[excelColumn] !== undefined) {
              let value = row[excelColumn];
              
              // Convert numeric fields
              if (['NET PAY', 'GROSS SALARY', 'TOTAL DEDUCTIONS', 'EARNED BASIC', 'HRA', 
                   'LOCAN CONVEY', 'MEDICAL ALLOW', 'CITY COMPENSATORY ALLOWANCE (CCA)', 
                   'CHILDREN EDUCATION ALLOWANCE (CEA)', 'OTHER ALLOWANCE', 'INCENTIVE', 
                   'PF', 'ESI', 'TDS', 'PT', 'STAFF WELFARE', 'SALARY ADVANCE', 
                   'TOTAL DAYS', 'PRESENT DAYS', 'SALARY DAYS', 'LOP'].includes(standardField)) {
                value = Number(value) || 0;
              } else {
                value = String(value || '');
              }
              
              processedRow[standardField] = value;
            } else {
              // Set default values for missing fields
              if (['NET PAY', 'GROSS SALARY', 'TOTAL DEDUCTIONS', 'EARNED BASIC', 'HRA', 
                   'LOCAN CONVEY', 'MEDICAL ALLOW', 'CITY COMPENSATORY ALLOWANCE (CCA)', 
                   'CHILDREN EDUCATION ALLOWANCE (CEA)', 'OTHER ALLOWANCE', 'INCENTIVE', 
                   'PF', 'ESI', 'TDS', 'PT', 'STAFF WELFARE', 'SALARY ADVANCE', 
                   'TOTAL DAYS', 'PRESENT DAYS', 'SALARY DAYS', 'LOP'].includes(standardField)) {
                processedRow[standardField] = 0;
              } else {
                processedRow[standardField] = standardField === 'EMPLOYEE NAME' ? `Employee ${index + 1}` :
                                           standardField === 'EMPLOYEE ID' ? `EMP${String(index + 1).padStart(3, '0')}` :
                                           standardField === 'AS ON' ? new Date().toLocaleDateString('en-IN') :
                                           '';
              }
            }
          });
          
          console.log(`Processed row ${index + 1}:`, processedRow);
          return processedRow;
        });
        
        console.log('Final processed data:', processedData);
        setEmployees(processedData);
        
        // Set the first employee as selected for preview
        if (processedData.length > 0) {
          setSelectedEmployee(processedData[0]);
        }
        
        toast.success(`Successfully loaded ${processedData.length} employee records`);
        
      } catch (error) {
        toast.error('Error reading Excel file. Please check the format.');
        console.error('Excel parsing error:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const generatePDF = async (employee: EmployeeData, showToast: boolean = true) => {
    if (!payslipRef.current) {
      console.error('Payslip ref not found');
      return false;
    }

    try {
      console.log('Generating PDF for employee:', employee);
      console.log('Employee name:', employee['EMPLOYEE NAME']);
      console.log('Net pay:', employee['NET PAY']);
      
      // Set the employee data for the template and force re-render
      setSelectedEmployee(employee);
      
      // Wait longer for the component to render with new data
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verify the element has content before capturing
      const element = payslipRef.current;
      if (!element) {
        throw new Error('Payslip element not found');
      }

      console.log('Element content before capture:', element.innerHTML.length);
      
      // Make the element visible temporarily for capture
      element.style.position = 'fixed';
      element.style.top = '0';
      element.style.left = '0';
      element.style.visibility = 'visible';
      element.style.zIndex = '9999';

      const canvas = await html2canvas(element, {
        scale: isMobile ? 1.5 : 2, // Reduce scale on mobile for performance
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        logging: true,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-payslip-template]') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.visibility = 'visible';
            clonedElement.style.position = 'static';
          }
        }
      });

      // Hide the element again
      element.style.position = 'fixed';
      element.style.top = '-9999px';
      element.style.left = '-9999px';
      element.style.visibility = 'hidden';
      element.style.zIndex = '-1';

      console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas has no content - check if element is properly rendered');
      }

      const imgData = canvas.toDataURL('image/png');
      
      if (imgData === 'data:,') {
        throw new Error('Canvas is empty - no content captured');
      }

      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Payslip_${employee['EMPLOYEE NAME']}_${employee['AS ON']}.pdf`);
      
      if (showToast) {
        toast.success(`PDF generated for ${employee['EMPLOYEE NAME']}`);
      }
      
      return true;
    } catch (error) {
      console.error('PDF generation error:', error);
      if (showToast) {
        toast.error(`Error generating PDF for ${employee['EMPLOYEE NAME']}: ${error.message}`);
      }
      return false;
    }
  };

  const generateAllPDFs = async () => {
    if (employees.length === 0) {
      toast.error('No employee data found');
      return;
    }

    setIsGenerating(true);
    setCurrentProgress(0);
    
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < employees.length; i++) {
      const employee = employees[i];
      setCurrentProgress(i + 1);
      
      console.log(`Processing ${i + 1}/${employees.length}: ${employee['EMPLOYEE NAME']}`);
      
      const success = await generatePDF(employee, false);
      
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
      
      // Small delay between generations to prevent browser freezing
      await new Promise(resolve => setTimeout(resolve, isMobile ? 2000 : 1000));
    }

    setIsGenerating(false);
    setCurrentProgress(0);
    
    if (successCount > 0) {
      toast.success(`Successfully generated ${successCount} PDFs${failCount > 0 ? ` (${failCount} failed)` : ''}`);
    } else {
      toast.error('Failed to generate any PDFs');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 md:p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">Professional Payslip Generator</h1>
          <p className="text-sm md:text-lg text-gray-600">Convert Excel employee data to professional PDF payslips</p>
          
          {/* PWA Install Button */}
          {installPrompt && (
            <div className="mt-4">
              <Button
                onClick={handleInstallPWA}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Install App on Phone
              </Button>
            </div>
          )}
          
          {isMobile && (
            <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
              📱 Mobile optimized! Add to home screen for best experience.
            </div>
          )}
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-2'} gap-4 md:gap-8`}>
          {/* Upload and Controls */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Upload className="h-4 w-4 md:h-5 md:w-5" />
                Upload Excel File
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div>
                <Label htmlFor="excel-upload" className="text-sm">Select Excel file with employee salary data</Label>
                <Input
                  id="excel-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="mt-2 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Excel file should have headers in the first row
                </p>
              </div>

              {/* Debug Information */}
              {debugInfo && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <div className="text-sm font-medium text-blue-800 mb-2">Column Mapping Results:</div>
                  <div className="text-xs text-blue-700 whitespace-pre-line max-h-32 md:max-h-40 overflow-y-auto">
                    {debugInfo}
                  </div>
                </div>
              )}

              {employees.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <Users className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="font-medium text-sm md:text-base">{employees.length} employees loaded successfully</span>
                  </div>

                  <div className="grid gap-2">
                    <Button
                      onClick={generateAllPDFs}
                      disabled={isGenerating}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-sm md:text-base"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating PDFs... ({currentProgress}/{employees.length})
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Generate All {employees.length} PDFs
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="max-h-48 md:max-h-60 overflow-y-auto border rounded-lg">
                    <table className="w-full text-xs md:text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="p-1 md:p-2 text-left font-medium">Employee Name</th>
                          <th className="p-1 md:p-2 text-left font-medium">ID</th>
                          <th className="p-1 md:p-2 text-left font-medium">Net Pay</th>
                          <th className="p-1 md:p-2 text-left font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((emp, index) => (
                          <tr key={index} className="border-t hover:bg-gray-50">
                            <td className="p-1 md:p-2 font-medium">{emp['EMPLOYEE NAME']}</td>
                            <td className="p-1 md:p-2 text-gray-600">{emp['EMPLOYEE ID']}</td>
                            <td className="p-1 md:p-2 text-green-600 font-medium">{formatCurrency(emp['NET PAY'])}</td>
                            <td className="p-1 md:p-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => generatePDF(emp)}
                                disabled={isGenerating}
                                className="text-xs"
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
              <CardTitle className="text-lg md:text-xl">Payslip Preview</CardTitle>
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
                <div className="text-center py-8 md:py-12 text-gray-500">
                  <FileText className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Upload Excel file to see employee data</p>
                  <p className="text-xs text-gray-400 mt-1">Individual PDFs will be generated for each employee</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Hidden Professional Payslip Template - Updated with Company Logo */}
        <div
          ref={payslipRef}
          data-payslip-template
          className="fixed"
          style={{ 
            top: '-9999px',
            left: '-9999px',
            width: '794px', 
            height: '1123px',
            fontSize: '11px', 
            lineHeight: '1.4', 
            fontFamily: 'Arial, sans-serif',
            visibility: 'hidden',
            backgroundColor: 'white'
          }}
        >
          {selectedEmployee && (
            <div className="p-6 h-full bg-white" style={{ border: '2px solid #e5e7eb' }}>
              {/* Company Header with Logo and Details */}
              <div className="flex items-start justify-between mb-6 pb-4" style={{ borderBottom: '2px solid #1e40af' }}>
                {/* Logo and Company Info */}
                <div className="flex items-start gap-4">
                  {/* Company Logo */}
                  <div className="w-20 h-20 flex-shrink-0">
                    <img 
                      src="/WhatsApp Image 2025-06-28 at 23.24.54.jpeg" 
                      alt="Nava Chetana Logo" 
                      className="w-full h-full object-contain"
                      style={{ maxWidth: '80px', maxHeight: '80px' }}
                    />
                  </div>
                  
                  {/* Company Details */}
                  <div>
                    <h1 className="text-lg font-bold text-blue-800 mb-1" style={{ fontSize: '14px', lineHeight: '1.2' }}>
                      NAVACHETANA VIVIDODDESHA SOUHARDA SAHAKARI NIYAMIT
                    </h1>
                    <div className="text-xs text-gray-700 space-y-0.5">
                      <div>HITAISHI PALACE, SHIRUR GROUP BUILDING P B ROAD, HAVERI</div>
                      <div>HAVERI - 581110, KARNATAKA</div>
                    </div>
                  </div>
                </div>
                
                {/* Payslip Title and Month */}
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-800 mb-1">PAYSLIP</div>
                  <div className="text-sm text-gray-600">Payslip for {selectedEmployee['AS ON']}</div>
                </div>
              </div>

              {/* Employee Information Grid */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Left Column - Employee Details */}
                <div>
                  <div className="text-sm font-bold text-blue-700 mb-3 pb-1" style={{ borderBottom: '1px solid #bfdbfe' }}>
                    EMPLOYEE DETAILS
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-600">Employee Code:</span>
                      <span className="font-medium col-span-2">{selectedEmployee['EMPLOYEE ID']}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium col-span-2">{selectedEmployee['EMPLOYEE NAME']}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-600">Designation:</span>
                      <span className="font-medium col-span-2">{selectedEmployee['DESIGNATION']}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium col-span-2">{selectedEmployee['DEPARTMENT']}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium col-span-2">Male</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-600">Date of Birth:</span>
                      <span className="font-medium col-span-2">02-Jul-1992</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-600">Date of Joining:</span>
                      <span className="font-medium col-span-2">{selectedEmployee['DOJ']}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-600">Attendance:</span>
                      <span className="font-medium col-span-2">Base,Elig: {selectedEmployee['PRESENT DAYS']}.00, {selectedEmployee['TOTAL DAYS']}.00</span>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Bank & Statutory Details */}
                <div>
                  <div className="text-sm font-bold text-blue-700 mb-3 pb-1" style={{ borderBottom: '1px solid #bfdbfe' }}>
                    BANK & STATUTORY INFO
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-600">Bank:</span>
                      <span className="font-medium col-span-2">UJJIVAN SMALL FINANCE BANK</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-600">Bank A/C No.:</span>
                      <span className="font-medium col-span-2">113111008005138</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium col-span-2">{selectedEmployee['BRANCH']}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-600">PAN:</span>
                      <span className="font-medium col-span-2">DZXPM7034M</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-600">UAN:</span>
                      <span className="font-medium col-span-2">{selectedEmployee['UAN']}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-600">PF A/C No.:</span>
                      <span className="font-medium col-span-2">{selectedEmployee['PF NO']}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-600">ESI No.:</span>
                      <span className="font-medium col-span-2">{selectedEmployee['ESI NO']}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-600">Previous Period LOP:</span>
                      <span className="font-medium col-span-2">LOP Reversal Days: 0.0, 0.0</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Earnings and Deductions Table */}
              <div className="mb-6">
                <table className="w-full text-xs border-collapse" style={{ border: '1px solid #d1d5db' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#059669' }}>
                      <th className="p-2 text-left text-white font-bold" style={{ border: '1px solid #d1d5db' }}>Earnings</th>
                      <th className="p-2 text-center text-white font-bold" style={{ border: '1px solid #d1d5db' }}>Fixed Amount</th>
                      <th className="p-2 text-center text-white font-bold" style={{ border: '1px solid #d1d5db' }}>Earning Amount</th>
                      <th className="p-2 text-left text-white font-bold" style={{ border: '1px solid #d1d5db' }}>Deductions</th>
                      <th className="p-2 text-center text-white font-bold" style={{ border: '1px solid #d1d5db' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2" style={{ border: '1px solid #d1d5db' }}>Basic</td>
                      <td className="p-2 text-right" style={{ border: '1px solid #d1d5db' }}>{selectedEmployee['EARNED BASIC'].toFixed(2)}</td>
                      <td className="p-2 text-right" style={{ border: '1px solid #d1d5db' }}>{selectedEmployee['EARNED BASIC'].toFixed(2)}</td>
                      <td className="p-2" style={{ border: '1px solid #d1d5db' }}>Employees StateInsurance</td>
                      <td className="p-2 text-right" style={{ border: '1px solid #d1d5db' }}>{selectedEmployee['ESI'].toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="p-2" style={{ border: '1px solid #d1d5db' }}>HouseRentAllowance</td>
                      <td className="p-2 text-right" style={{ border: '1px solid #d1d5db' }}>{selectedEmployee['HRA'].toFixed(2)}</td>
                      <td className="p-2 text-right" style={{ border: '1px solid #d1d5db' }}>{selectedEmployee['HRA'].toFixed(2)}</td>
                      <td className="p-2" style={{ border: '1px solid #d1d5db' }}>Staff Welfare Fund</td>
                      <td className="p-2 text-right" style={{ border: '1px solid #d1d5db' }}>{selectedEmployee['STAFF WELFARE'].toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="p-2" style={{ border: '1px solid #d1d5db' }}>LocalConveyanceAllowance</td>
                      <td className="p-2 text-right" style={{ border: '1px solid #d1d5db' }}>{selectedEmployee['LOCAN CONVEY'].toFixed(2)}</td>
                      <td className="p-2 text-right" style={{ border: '1px solid #d1d5db' }}>{selectedEmployee['LOCAN CONVEY'].toFixed(2)}</td>
                      <td className="p-2" style={{ border: '1px solid #d1d5db' }}>Staff Security Deposit</td>
                      <td className="p-2 text-right" style={{ border: '1px solid #d1d5db' }}>200.00</td>
                    </tr>
                    <tr>
                      <td className="p-2" style={{ border: '1px solid #d1d5db' }}>MedicalAllowance</td>
                      <td className="p-2 text-right" style={{ border: '1px solid #d1d5db' }}>{selectedEmployee['MEDICAL ALLOW'].toFixed(2)}</td>
                      <td className="p-2 text-right" style={{ border: '1px solid #d1d5db' }}>{selectedEmployee['MEDICAL ALLOW'].toFixed(2)}</td>
                      <td className="p-2" style={{ border: '1px solid #d1d5db' }}>ProfessionalTax</td>
                      <td className="p-2 text-right" style={{ border: '1px solid #d1d5db' }}>{selectedEmployee['PT'].toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="p-2" style={{ border: '1px solid #d1d5db' }}>Incentive Pay</td>
                      <td className="p-2 text-right" style={{ border: '1px solid #d1d5db' }}></td>
                      <td className="p-2 text-right" style={{ border: '1px solid #d1d5db' }}>{selectedEmployee['INCENTIVE'].toFixed(2)}</td>
                      <td className="p-2" style={{ border: '1px solid #d1d5db' }}>ProvidentFund</td>
                      <td className="p-2 text-right" style={{ border: '1px solid #d1d5db' }}>{selectedEmployee['PF'].toFixed(2)}</td>
                    </tr>
                    <tr style={{ backgroundColor: '#059669' }}>
                      <td className="p-2 font-bold text-white" style={{ border: '1px solid #d1d5db' }}>Total Earnings</td>
                      <td className="p-2 text-right font-bold text-white" style={{ border: '1px solid #d1d5db' }}>{(selectedEmployee['EARNED BASIC'] + selectedEmployee['HRA'] + selectedEmployee['LOCAN CONVEY'] + selectedEmployee['MEDICAL ALLOW']).toFixed(2)}</td>
                      <td className="p-2 text-right font-bold text-white" style={{ border: '1px solid #d1d5db' }}>{selectedEmployee['GROSS SALARY'].toFixed(2)}</td>
                      <td className="p-2 font-bold text-white" style={{ border: '1px solid #d1d5db' }}>Total Deductions</td>
                      <td className="p-2 text-right font-bold text-white" style={{ border: '1px solid #d1d5db' }}>{selectedEmployee['TOTAL DEDUCTIONS'].toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Net Salary */}
              <div className="text-center mb-6 p-3" style={{ backgroundColor: '#f0f9ff', border: '2px solid #0ea5e9' }}>
                <div className="text-base font-bold text-blue-800">
                  Net Salary: {formatCurrency(selectedEmployee['NET PAY'])} (Rupees {convertNumberToWords(selectedEmployee['NET PAY'])})
                </div>
              </div>

              {/* Footer Note */}
              <div className="text-center text-xs text-gray-600 border-t pt-3">
                <p className="mb-1">
                  <strong>Note:</strong> This is system generated payslip signature or company seal not required, your salary is confidential and should not be shared with other colleague.
                </p>
                <div className="flex justify-between mt-3">
                  <span>Page 1 of 1</span>
                  <span>Downloaded On {new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString('en-US', { hour12: true })}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayslipGenerator;