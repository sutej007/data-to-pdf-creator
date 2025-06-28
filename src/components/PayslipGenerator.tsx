import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, FileText, Users, Loader2 } from "lucide-react";
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
  const [currentPdfEmployee, setCurrentPdfEmployee] = useState<EmployeeData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [columnMapping, setColumnMapping] = useState<{[key: string]: string}>({});
  const [processedLogoUrl, setProcessedLogoUrl] = useState<string>('');
  const payslipRef = useRef<HTMLDivElement>(null);

  // Advanced logo processing function
  const processLogo = async (): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        // Set ultra-high resolution for maximum quality
        const scale = 6; // 6x scale for ultra-sharp quality
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        if (!ctx) {
          resolve('');
          return;
        }
        
        // Enable high-quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw the original image at high resolution
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Get image data for processing
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Advanced black removal and enhancement algorithm
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const alpha = data[i + 3];
          
          // Calculate brightness and saturation
          const brightness = (r + g + b) / 3;
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const saturation = max === 0 ? 0 : (max - min) / max;
          
          // Enhanced black detection with smart thresholds
          const isBlack = brightness < 35 && saturation < 0.3;
          const isVeryDark = brightness < 50 && saturation < 0.2;
          
          if (isBlack) {
            // Convert pure black areas to transparent
            data[i + 3] = 0;
          } else if (isVeryDark) {
            // Fade very dark areas
            data[i + 3] = Math.max(0, alpha * 0.3);
          } else {
            // Enhance non-black areas
            // Increase contrast and saturation
            const contrastFactor = 1.15;
            const brightnessFactor = 1.08;
            const saturationFactor = 1.12;
            
            // Apply brightness enhancement
            data[i] = Math.min(255, r * brightnessFactor);
            data[i + 1] = Math.min(255, g * brightnessFactor);
            data[i + 2] = Math.min(255, b * brightnessFactor);
            
            // Apply contrast enhancement
            data[i] = Math.min(255, ((data[i] - 128) * contrastFactor) + 128);
            data[i + 1] = Math.min(255, ((data[i + 1] - 128) * contrastFactor) + 128);
            data[i + 2] = Math.min(255, ((data[i + 2] - 128) * contrastFactor) + 128);
            
            // Apply saturation enhancement
            const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = Math.min(255, gray + (data[i] - gray) * saturationFactor);
            data[i + 1] = Math.min(255, gray + (data[i + 1] - gray) * saturationFactor);
            data[i + 2] = Math.min(255, gray + (data[i + 2] - gray) * saturationFactor);
          }
        }
        
        // Apply processed image data
        ctx.putImageData(imageData, 0, 0);
        
        // Apply professional sharpening filter
        const sharpenKernel = [
          0, -0.25, 0,
          -0.25, 2, -0.25,
          0, -0.25, 0
        ];
        
        // Create sharpened version
        const sharpenedCanvas = document.createElement('canvas');
        const sharpenedCtx = sharpenedCanvas.getContext('2d');
        sharpenedCanvas.width = canvas.width;
        sharpenedCanvas.height = canvas.height;
        
        if (sharpenedCtx) {
          sharpenedCtx.filter = 'contrast(110%) brightness(105%) saturate(110%)';
          sharpenedCtx.drawImage(canvas, 0, 0);
          
          // Convert to ultra-high quality PNG
          const processedUrl = sharpenedCanvas.toDataURL('image/png', 1.0);
          resolve(processedUrl);
        } else {
          resolve(canvas.toDataURL('image/png', 1.0));
        }
      };
      
      img.onerror = () => {
        console.warn('Logo processing failed, using original');
        resolve('');
      };
      
      // Try multiple paths for the logo
      const logoPaths = [
        '/WhatsApp Image 2025-06-28 at 23.24.54 copy copy copy copy.jpeg',
        '/public/WhatsApp Image 2025-06-28 at 23.24.54 copy copy copy copy.jpeg',
        './WhatsApp Image 2025-06-28 at 23.24.54 copy copy copy copy.jpeg'
      ];
      
      let pathIndex = 0;
      const tryNextPath = () => {
        if (pathIndex < logoPaths.length) {
          img.src = logoPaths[pathIndex];
          pathIndex++;
        } else {
          resolve('');
        }
      };
      
      img.onerror = tryNextPath;
      tryNextPath();
    });
  };

  // Process logo on component mount
  React.useEffect(() => {
    const initializeLogo = async () => {
      try {
        const processedUrl = await processLogo();
        if (processedUrl) {
          setProcessedLogoUrl(processedUrl);
          console.log('✅ Logo processed successfully with ultra-high quality');
        }
      } catch (error) {
        console.warn('Logo processing error:', error);
      }
    };
    
    initializeLogo();
  }, []);

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
      console.log('Setting employee for PDF generation:', employee['EMPLOYEE NAME'], 'Net Pay:', employee['NET PAY']);
      
      // Set the employee data for the template
      setCurrentPdfEmployee(employee);
      setSelectedEmployee(employee);
      
      // Wait for the component to render with new data
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Generating PDF for:', employee['EMPLOYEE NAME'], 'Net Pay:', employee['NET PAY']);

      const canvas = await html2canvas(payslipRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
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
        toast.error(`Error generating PDF for ${employee['EMPLOYEE NAME']}`);
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
      await new Promise(resolve => setTimeout(resolve, 1500));
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

  // Use currentPdfEmployee for PDF generation, selectedEmployee for preview
  const templateEmployee = currentPdfEmployee || selectedEmployee;

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
                  Excel file should have headers in the first row
                </p>
              </div>

              {/* Logo Processing Status */}
              {processedLogoUrl && (
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <div className="text-sm font-medium text-green-800 mb-2">✅ Logo Processing Complete</div>
                  <div className="text-xs text-green-700">
                    Ultra-high quality logo with black removal applied successfully
                  </div>
                </div>
              )}

              {/* Debug Information */}
              {debugInfo && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <div className="text-sm font-medium text-blue-800 mb-2">Column Mapping Results:</div>
                  <div className="text-xs text-blue-700 whitespace-pre-line max-h-40 overflow-y-auto">
                    {debugInfo}
                  </div>
                </div>
              )}

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
                    PDF will be generated with professional formatting and ultra-high quality logo
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

        {/* Hidden Professional Payslip Template with Ultra-High Quality Logo */}
        <div
          ref={payslipRef}
          data-payslip-template
          className="fixed top-[-9999px] left-[-9999px] bg-white"
          style={{ 
            width: '794px', 
            height: '1123px',
            fontSize: '11px', 
            lineHeight: '1.4', 
            fontFamily: 'Arial, sans-serif',
            visibility: 'hidden'
          }}
        >
          {templateEmployee && (
            <div className="p-8 border-2 border-gray-300 h-full">
              {/* Company Header with Ultra-High Quality Logo */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-blue-600">
                {/* Ultra-High Quality Logo */}
                <div className="flex-shrink-0">
                  {processedLogoUrl ? (
                    <img 
                      src={processedLogoUrl}
                      alt="Nava Chetana Logo"
                      className="w-28 h-28 object-contain bg-white rounded-lg shadow-sm border border-gray-200 p-2"
                      style={{
                        imageRendering: 'crisp-edges',
                        imageRendering: '-webkit-optimize-contrast',
                        imageRendering: 'pixelated',
                        filter: 'contrast(110%) brightness(105%)'
                      }}
                    />
                  ) : (
                    <div className="w-28 h-28 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                      <span className="text-xs text-gray-500">Logo</span>
                    </div>
                  )}
                </div>
                
                {/* Company Info */}
                <div className="text-center flex-1 mx-6">
                  <div className="text-2xl font-bold text-blue-800 mb-2">PAYSLIP</div>
                  <div className="text-lg font-semibold text-gray-800 mb-1">NAVA CHETANA</div>
                  <div className="text-sm text-blue-600 font-medium">SOUHARDA SAHAKARI</div>
                  <div className="text-sm text-gray-600 mt-2">For the month of {templateEmployee['AS ON']}</div>
                </div>
                
                {/* Right side space for balance */}
                <div className="w-28"></div>
              </div>

              {/* Employee Information */}
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <div className="text-sm font-bold text-blue-700 mb-3 pb-1 border-b border-blue-200">EMPLOYEE DETAILS</div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600 w-32">Name:</span>
                      <span className="font-medium flex-1">{templateEmployee['EMPLOYEE NAME']}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 w-32">Employee ID:</span>
                      <span className="font-medium flex-1">{templateEmployee['EMPLOYEE ID']}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 w-32">Designation:</span>
                      <span className="font-medium flex-1">{templateEmployee['DESIGNATION']}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 w-32">Department:</span>
                      <span className="font-medium flex-1">{templateEmployee['DEPARTMENT']}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 w-32">Branch:</span>
                      <span className="font-medium flex-1">{templateEmployee['BRANCH']}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-bold text-blue-700 mb-3 pb-1 border-b border-blue-200">STATUTORY INFO</div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600 w-32">Date of Joining:</span>
                      <span className="font-medium flex-1">{templateEmployee['DOJ']}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 w-32">PF Number:</span>
                      <span className="font-medium flex-1">{templateEmployee['PF NO']}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 w-32">ESI Number:</span>
                      <span className="font-medium flex-1">{templateEmployee['ESI NO']}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 w-32">UAN:</span>
                      <span className="font-medium flex-1">{templateEmployee['UAN']}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 w-32">Status:</span>
                      <span className="font-medium flex-1">{templateEmployee['STATUS']}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance */}
              <div className="mb-6">
                <div className="text-sm font-bold text-blue-700 mb-3 pb-1 border-b border-blue-200">ATTENDANCE SUMMARY</div>
                <div className="grid grid-cols-4 gap-4 text-xs">
                  <div className="text-center p-2 bg-gray-50 rounded border">
                    <div className="font-bold text-blue-600 text-sm">{templateEmployee['TOTAL DAYS']}</div>
                    <div className="text-gray-600 text-xs">Total Days</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded border">
                    <div className="font-bold text-green-600 text-sm">{templateEmployee['PRESENT DAYS']}</div>
                    <div className="text-gray-600 text-xs">Present Days</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded border">
                    <div className="font-bold text-blue-600 text-sm">{templateEmployee['SALARY DAYS']}</div>
                    <div className="text-gray-600 text-xs">Paid Days</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded border">
                    <div className="font-bold text-red-600 text-sm">{templateEmployee['LOP']}</div>
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
                      <span className="font-medium">{formatCurrency(templateEmployee['EARNED BASIC'])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>House Rent Allowance</span>
                      <span className="font-medium">{formatCurrency(templateEmployee['HRA'])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conveyance Allowance</span>
                      <span className="font-medium">{formatCurrency(templateEmployee['LOCAN CONVEY'])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medical Allowance</span>
                      <span className="font-medium">{formatCurrency(templateEmployee['MEDICAL ALLOW'])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>City Compensatory Allow.</span>
                      <span className="font-medium">{formatCurrency(templateEmployee['CITY COMPENSATORY ALLOWANCE (CCA)'])}</span>
                    </div>
                    {templateEmployee['CHILDREN EDUCATION ALLOWANCE (CEA)'] > 0 && (
                      <div className="flex justify-between">
                        <span>Children Education Allow.</span>
                        <span className="font-medium">{formatCurrency(templateEmployee['CHILDREN EDUCATION ALLOWANCE (CEA)'])}</span>
                      </div>
                    )}
                    {templateEmployee['OTHER ALLOWANCE'] > 0 && (
                      <div className="flex justify-between">
                        <span>Other Allowances</span>
                        <span className="font-medium">{formatCurrency(templateEmployee['OTHER ALLOWANCE'])}</span>
                      </div>
                    )}
                    {templateEmployee['INCENTIVE'] > 0 && (
                      <div className="flex justify-between">
                        <span>Incentive</span>
                        <span className="font-medium">{formatCurrency(templateEmployee['INCENTIVE'])}</span>
                      </div>
                    )}
                    <div className="border-t border-green-300 pt-2 mt-2 flex justify-between font-bold text-green-700">
                      <span>GROSS SALARY</span>
                      <span>{formatCurrency(templateEmployee['GROSS SALARY'])}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="border border-red-200 p-4 rounded">
                  <div className="text-sm font-bold text-red-700 mb-3 pb-1 border-b border-red-300">DEDUCTIONS</div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span>Provident Fund</span>
                      <span className="font-medium">{formatCurrency(templateEmployee['PF'])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Employee State Insurance</span>
                      <span className="font-medium">{formatCurrency(templateEmployee['ESI'])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax Deducted at Source</span>
                      <span className="font-medium">{formatCurrency(templateEmployee['TDS'])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Professional Tax</span>
                      <span className="font-medium">{formatCurrency(templateEmployee['PT'])}</span>
                    </div>
                    {templateEmployee['STAFF WELFARE'] > 0 && (
                      <div className="flex justify-between">
                        <span>Staff Welfare</span>
                        <span className="font-medium">{formatCurrency(templateEmployee['STAFF WELFARE'])}</span>
                      </div>
                    )}
                    {templateEmployee['SALARY ADVANCE'] > 0 && (
                      <div className="flex justify-between">
                        <span>Salary Advance</span>
                        <span className="font-medium">{formatCurrency(templateEmployee['SALARY ADVANCE'])}</span>
                      </div>
                    )}
                    <div className="border-t border-red-300 pt-2 mt-2 flex justify-between font-bold text-red-700">
                      <span>TOTAL DEDUCTIONS</span>
                      <span>{formatCurrency(templateEmployee['TOTAL DEDUCTIONS'])}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Pay Section */}
              <div className="bg-green-50 border-2 border-green-500 p-4 rounded text-center mb-6">
                <div className="text-lg font-bold text-green-700">
                  NET PAY: {formatCurrency(templateEmployee['NET PAY'])}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default PayslipGenerator;