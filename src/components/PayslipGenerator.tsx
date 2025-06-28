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
        setSelectedEmployee(processedData[0]); // Set first employee as selected for preview
        toast.success(`Successfully loaded ${processedData.length} employee records`);
        
      } catch (error) {
        toast.error('Error reading Excel file. Please check the format.');
        console.error('Excel parsing error:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Create a payslip template component
  const PayslipTemplate = ({ employee }: { employee: EmployeeData }) => {
    return (
      <div 
        className="bg-white p-8 border-2 border-gray-300"
        style={{ 
          width: '794px', 
          minHeight: '1123px',
          fontSize: '11px', 
          lineHeight: '1.4', 
          fontFamily: 'Arial, sans-serif'
        }}
      >
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
            <div className="text-sm text-gray-600 mt-2">For the month of {employee['AS ON']}</div>
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
                <span className="font-medium flex-1">{employee['EMPLOYEE NAME']}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 w-32">Employee ID:</span>
                <span className="font-medium flex-1">{employee['EMPLOYEE ID']}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 w-32">Designation:</span>
                <span className="font-medium flex-1">{employee['DESIGNATION']}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 w-32">Department:</span>
                <span className="font-medium flex-1">{employee['DEPARTMENT']}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 w-32">Branch:</span>
                <span className="font-medium flex-1">{employee['BRANCH']}</span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-sm font-bold text-blue-700 mb-3 pb-1 border-b border-blue-200">STATUTORY INFO</div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600 w-32">Date of Joining:</span>
                <span className="font-medium flex-1">{employee['DOJ']}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 w-32">PF Number:</span>
                <span className="font-medium flex-1">{employee['PF NO']}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 w-32">ESI Number:</span>
                <span className="font-medium flex-1">{employee['ESI NO']}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 w-32">UAN:</span>
                <span className="font-medium flex-1">{employee['UAN']}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 w-32">Status:</span>
                <span className="font-medium flex-1">{employee['STATUS']}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance */}
        <div className="mb-6">
          <div className="text-sm font-bold text-blue-700 mb-3 pb-1 border-b border-blue-200">ATTENDANCE SUMMARY</div>
          <div className="grid grid-cols-4 gap-4 text-xs">
            <div className="text-center p-2 bg-gray-50 rounded border">
              <div className="font-bold text-blue-600 text-sm">{employee['TOTAL DAYS']}</div>
              <div className="text-gray-600 text-xs">Total Days</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded border">
              <div className="font-bold text-green-600 text-sm">{employee['PRESENT DAYS']}</div>
              <div className="text-gray-600 text-xs">Present Days</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded border">
              <div className="font-bold text-blue-600 text-sm">{employee['SALARY DAYS']}</div>
              <div className="text-gray-600 text-xs">Paid Days</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded border">
              <div className="font-bold text-red-600 text-sm">{employee['LOP']}</div>
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
                <span className="font-medium">{formatCurrency(employee['EARNED BASIC'])}</span>
              </div>
              <div className="flex justify-between">
                <span>House Rent Allowance</span>
                <span className="font-medium">{formatCurrency(employee['HRA'])}</span>
              </div>
              <div className="flex justify-between">
                <span>Conveyance Allowance</span>
                <span className="font-medium">{formatCurrency(employee['LOCAN CONVEY'])}</span>
              </div>
              <div className="flex justify-between">
                <span>Medical Allowance</span>
                <span className="font-medium">{formatCurrency(employee['MEDICAL ALLOW'])}</span>
              </div>
              <div className="flex justify-between">
                <span>City Compensatory Allow.</span>
                <span className="font-medium">{formatCurrency(employee['CITY COMPENSATORY ALLOWANCE (CCA)'])}</span>
              </div>
              {employee['CHILDREN EDUCATION ALLOWANCE (CEA)'] > 0 && (
                <div className="flex justify-between">
                  <span>Children Education Allow.</span>
                  <span className="font-medium">{formatCurrency(employee['CHILDREN EDUCATION ALLOWANCE (CEA)'])}</span>
                </div>
              )}
              {employee['OTHER ALLOWANCE'] > 0 && (
                <div className="flex justify-between">
                  <span>Other Allowances</span>
                  <span className="font-medium">{formatCurrency(employee['OTHER ALLOWANCE'])}</span>
                </div>
              )}
              {employee['INCENTIVE'] > 0 && (
                <div className="flex justify-between">
                  <span>Incentive</span>
                  <span className="font-medium">{formatCurrency(employee['INCENTIVE'])}</span>
                </div>
              )}
              <div className="border-t border-green-300 pt-2 mt-2 flex justify-between font-bold text-green-700">
                <span>GROSS SALARY</span>
                <span>{formatCurrency(employee['GROSS SALARY'])}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="border border-red-200 p-4 rounded">
            <div className="text-sm font-bold text-red-700 mb-3 pb-1 border-b border-red-300">DEDUCTIONS</div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span>Provident Fund</span>
                <span className="font-medium">{formatCurrency(employee['PF'])}</span>
              </div>
              <div className="flex justify-between">
                <span>Employee State Insurance</span>
                <span className="font-medium">{formatCurrency(employee['ESI'])}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax Deducted at Source</span>
                <span className="font-medium">{formatCurrency(employee['TDS'])}</span>
              </div>
              <div className="flex justify-between">
                <span>Professional Tax</span>
                <span className="font-medium">{formatCurrency(employee['PT'])}</span>
              </div>
              {employee['STAFF WELFARE'] > 0 && (
                <div className="flex justify-between">
                  <span>Staff Welfare</span>
                  <span className="font-medium">{formatCurrency(employee['STAFF WELFARE'])}</span>
                </div>
              )}
              {employee['SALARY ADVANCE'] > 0 && (
                <div className="flex justify-between">
                  <span>Salary Advance</span>
                  <span className="font-medium">{formatCurrency(employee['SALARY ADVANCE'])}</span>
                </div>
              )}
              <div className="border-t border-red-300 pt-2 mt-2 flex justify-between font-bold text-red-700">
                <span>TOTAL DEDUCTIONS</span>
                <span>{formatCurrency(employee['TOTAL DEDUCTIONS'])}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Pay Section */}
        <div className="bg-green-50 border-2 border-green-500 p-4 rounded text-center mb-6">
          <div className="text-lg font-bold text-green-700">
            NET PAY: {formatCurrency(employee['NET PAY'])}
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
    );
  };

  const generatePDF = async (employee: EmployeeData, showToast: boolean = true) => {
    try {
      console.log('🔄 Starting PDF generation for:', employee['EMPLOYEE NAME']);

      // Create a temporary container with proper styling
      const tempContainer = document.createElement('div');
      tempContainer.style.cssText = `
        position: fixed;
        top: -10000px;
        left: -10000px;
        width: 794px;
        height: auto;
        background-color: white;
        font-family: Arial, sans-serif;
        z-index: -1000;
        visibility: hidden;
        pointer-events: none;
      `;
      
      // Add to body
      document.body.appendChild(tempContainer);

      // Create the payslip HTML directly
      tempContainer.innerHTML = `
        <div style="
          background: white;
          padding: 32px;
          border: 2px solid #d1d5db;
          width: 794px;
          min-height: 1123px;
          font-size: 11px;
          line-height: 1.4;
          font-family: Arial, sans-serif;
          box-sizing: border-box;
        ">
          <!-- Company Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; padding-bottom: 16px; border-bottom: 2px solid #2563eb;">
            <!-- Logo -->
            <div style="flex-shrink: 0;">
              ${processedLogoUrl ? `
                <img src="${processedLogoUrl}" alt="Nava Chetana Logo" style="
                  width: 112px;
                  height: 112px;
                  object-fit: contain;
                  background: white;
                  border-radius: 8px;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                  border: 1px solid #e5e7eb;
                  padding: 8px;
                  image-rendering: crisp-edges;
                  filter: contrast(110%) brightness(105%);
                " />
              ` : `
                <div style="
                  width: 112px;
                  height: 112px;
                  background: #f3f4f6;
                  border-radius: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border: 1px solid #e5e7eb;
                ">
                  <span style="font-size: 12px; color: #6b7280;">Logo</span>
                </div>
              `}
            </div>
            
            <!-- Company Info -->
            <div style="text-align: center; flex: 1; margin: 0 24px;">
              <div style="font-size: 24px; font-weight: bold; color: #1e40af; margin-bottom: 8px;">PAYSLIP</div>
              <div style="font-size: 18px; font-weight: 600; color: #374151; margin-bottom: 4px;">NAVA CHETANA</div>
              <div style="font-size: 14px; color: #2563eb; font-weight: 500;">SOUHARDA SAHAKARI</div>
              <div style="font-size: 14px; color: #4b5563; margin-top: 8px;">For the month of ${employee['AS ON']}</div>
            </div>
            
            <!-- Right space -->
            <div style="width: 112px;"></div>
          </div>

          <!-- Employee Information -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 24px;">
            <div>
              <div style="font-size: 14px; font-weight: bold; color: #1d4ed8; margin-bottom: 12px; padding-bottom: 4px; border-bottom: 1px solid #bfdbfe;">EMPLOYEE DETAILS</div>
              <div style="font-size: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="color: #4b5563; width: 128px;">Name:</span>
                  <span style="font-weight: 500; flex: 1;">${employee['EMPLOYEE NAME']}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="color: #4b5563; width: 128px;">Employee ID:</span>
                  <span style="font-weight: 500; flex: 1;">${employee['EMPLOYEE ID']}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="color: #4b5563; width: 128px;">Designation:</span>
                  <span style="font-weight: 500; flex: 1;">${employee['DESIGNATION']}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="color: #4b5563; width: 128px;">Department:</span>
                  <span style="font-weight: 500; flex: 1;">${employee['DEPARTMENT']}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #4b5563; width: 128px;">Branch:</span>
                  <span style="font-weight: 500; flex: 1;">${employee['BRANCH']}</span>
                </div>
              </div>
            </div>
            
            <div>
              <div style="font-size: 14px; font-weight: bold; color: #1d4ed8; margin-bottom: 12px; padding-bottom: 4px; border-bottom: 1px solid #bfdbfe;">STATUTORY INFO</div>
              <div style="font-size: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="color: #4b5563; width: 128px;">Date of Joining:</span>
                  <span style="font-weight: 500; flex: 1;">${employee['DOJ']}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="color: #4b5563; width: 128px;">PF Number:</span>
                  <span style="font-weight: 500; flex: 1;">${employee['PF NO']}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="color: #4b5563; width: 128px;">ESI Number:</span>
                  <span style="font-weight: 500; flex: 1;">${employee['ESI NO']}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="color: #4b5563; width: 128px;">UAN:</span>
                  <span style="font-weight: 500; flex: 1;">${employee['UAN']}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #4b5563; width: 128px;">Status:</span>
                  <span style="font-weight: 500; flex: 1;">${employee['STATUS']}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Attendance -->
          <div style="margin-bottom: 24px;">
            <div style="font-size: 14px; font-weight: bold; color: #1d4ed8; margin-bottom: 12px; padding-bottom: 4px; border-bottom: 1px solid #bfdbfe;">ATTENDANCE SUMMARY</div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; font-size: 12px;">
              <div style="text-align: center; padding: 8px; background: #f9fafb; border-radius: 4px; border: 1px solid #e5e7eb;">
                <div style="font-weight: bold; color: #2563eb; font-size: 14px;">${employee['TOTAL DAYS']}</div>
                <div style="color: #4b5563; font-size: 12px;">Total Days</div>
              </div>
              <div style="text-align: center; padding: 8px; background: #f9fafb; border-radius: 4px; border: 1px solid #e5e7eb;">
                <div style="font-weight: bold; color: #059669; font-size: 14px;">${employee['PRESENT DAYS']}</div>
                <div style="color: #4b5563; font-size: 12px;">Present Days</div>
              </div>
              <div style="text-align: center; padding: 8px; background: #f9fafb; border-radius: 4px; border: 1px solid #e5e7eb;">
                <div style="font-weight: bold; color: #2563eb; font-size: 14px;">${employee['SALARY DAYS']}</div>
                <div style="color: #4b5563; font-size: 12px;">Paid Days</div>
              </div>
              <div style="text-align: center; padding: 8px; background: #f9fafb; border-radius: 4px; border: 1px solid #e5e7eb;">
                <div style="font-weight: bold; color: #dc2626; font-size: 14px;">${employee['LOP']}</div>
                <div style="color: #4b5563; font-size: 12px;">LOP Days</div>
              </div>
            </div>
          </div>

          <!-- Salary Details -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 24px;">
            <!-- Earnings -->
            <div style="border: 1px solid #bbf7d0; padding: 16px; border-radius: 4px;">
              <div style="font-size: 14px; font-weight: bold; color: #15803d; margin-bottom: 12px; padding-bottom: 4px; border-bottom: 1px solid #86efac;">EARNINGS</div>
              <div style="font-size: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span>Basic Salary</span>
                  <span style="font-weight: 500;">${formatCurrency(employee['EARNED BASIC'])}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span>House Rent Allowance</span>
                  <span style="font-weight: 500;">${formatCurrency(employee['HRA'])}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span>Conveyance Allowance</span>
                  <span style="font-weight: 500;">${formatCurrency(employee['LOCAN CONVEY'])}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span>Medical Allowance</span>
                  <span style="font-weight: 500;">${formatCurrency(employee['MEDICAL ALLOW'])}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span>City Compensatory Allow.</span>
                  <span style="font-weight: 500;">${formatCurrency(employee['CITY COMPENSATORY ALLOWANCE (CCA)'])}</span>
                </div>
                ${employee['CHILDREN EDUCATION ALLOWANCE (CEA)'] > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                    <span>Children Education Allow.</span>
                    <span style="font-weight: 500;">${formatCurrency(employee['CHILDREN EDUCATION ALLOWANCE (CEA)'])}</span>
                  </div>
                ` : ''}
                ${employee['OTHER ALLOWANCE'] > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                    <span>Other Allowances</span>
                    <span style="font-weight: 500;">${formatCurrency(employee['OTHER ALLOWANCE'])}</span>
                  </div>
                ` : ''}
                ${employee['INCENTIVE'] > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                    <span>Incentive</span>
                    <span style="font-weight: 500;">${formatCurrency(employee['INCENTIVE'])}</span>
                  </div>
                ` : ''}
                <div style="border-top: 1px solid #86efac; padding-top: 8px; margin-top: 8px; display: flex; justify-content: space-between; font-weight: bold; color: #15803d;">
                  <span>GROSS SALARY</span>
                  <span>${formatCurrency(employee['GROSS SALARY'])}</span>
                </div>
              </div>
            </div>

            <!-- Deductions -->
            <div style="border: 1px solid #fecaca; padding: 16px; border-radius: 4px;">
              <div style="font-size: 14px; font-weight: bold; color: #b91c1c; margin-bottom: 12px; padding-bottom: 4px; border-bottom: 1px solid #fca5a5;">DEDUCTIONS</div>
              <div style="font-size: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span>Provident Fund</span>
                  <span style="font-weight: 500;">${formatCurrency(employee['PF'])}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span>Employee State Insurance</span>
                  <span style="font-weight: 500;">${formatCurrency(employee['ESI'])}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span>Tax Deducted at Source</span>
                  <span style="font-weight: 500;">${formatCurrency(employee['TDS'])}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span>Professional Tax</span>
                  <span style="font-weight: 500;">${formatCurrency(employee['PT'])}</span>
                </div>
                ${employee['STAFF WELFARE'] > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                    <span>Staff Welfare</span>
                    <span style="font-weight: 500;">${formatCurrency(employee['STAFF WELFARE'])}</span>
                  </div>
                ` : ''}
                ${employee['SALARY ADVANCE'] > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                    <span>Salary Advance</span>
                    <span style="font-weight: 500;">${formatCurrency(employee['SALARY ADVANCE'])}</span>
                  </div>
                ` : ''}
                <div style="border-top: 1px solid #fca5a5; padding-top: 8px; margin-top: 8px; display: flex; justify-content: space-between; font-weight: bold; color: #b91c1c;">
                  <span>TOTAL DEDUCTIONS</span>
                  <span>${formatCurrency(employee['TOTAL DEDUCTIONS'])}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Net Pay Section -->
          <div style="background: #f0fdf4; border: 2px solid #22c55e; padding: 16px; border-radius: 4px; text-align: center; margin-bottom: 24px;">
            <div style="font-size: 18px; font-weight: bold; color: #15803d;">
              NET PAY: ${formatCurrency(employee['NET PAY'])}
            </div>
            <div style="font-size: 12px; color: #059669; margin-top: 4px;">
              (Gross Salary - Total Deductions)
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; font-size: 12px; color: #4b5563; border-top: 1px solid #e5e7eb; padding-top: 16px;">
            <p style="margin-bottom: 4px;">This is a computer generated payslip and does not require signature.</p>
            <p>Generated on: ${new Date().toLocaleDateString('en-IN')}</p>
          </div>
        </div>
      `;

      // Wait for images to load
      const images = tempContainer.querySelectorAll('img');
      if (images.length > 0) {
        await Promise.all(Array.from(images).map(img => {
          return new Promise((resolve) => {
            if (img.complete) {
              resolve(true);
            } else {
              img.onload = () => resolve(true);
              img.onerror = () => resolve(true);
              // Timeout after 3 seconds
              setTimeout(() => resolve(true), 3000);
            }
          });
        }));
      }

      // Additional wait for rendering
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('📸 Capturing canvas...');

      // Generate canvas with optimized settings
      const canvas = await html2canvas(tempContainer.firstElementChild as HTMLElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        logging: false,
        imageTimeout: 5000,
        removeContainer: false,
        foreignObjectRendering: false,
        onclone: (clonedDoc) => {
          // Ensure all styles are properly applied in the cloned document
          const clonedElement = clonedDoc.querySelector('[style*="794px"]') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.width = '794px';
            clonedElement.style.minHeight = '1123px';
            clonedElement.style.backgroundColor = 'white';
          }
        }
      });

      console.log('📄 Creating PDF...');

      // Create PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Save PDF
      const fileName = `Payslip_${employee['EMPLOYEE NAME'].replace(/[^a-zA-Z0-9]/g, '_')}_${employee['AS ON'].replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      pdf.save(fileName);
      
      // Clean up
      document.body.removeChild(tempContainer);
      
      console.log('✅ PDF generated successfully for:', employee['EMPLOYEE NAME']);
      
      if (showToast) {
        toast.success(`PDF generated for ${employee['EMPLOYEE NAME']}`);
      }
      
      return true;
    } catch (error) {
      console.error('❌ PDF generation error:', error);
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
      await new Promise(resolve => setTimeout(resolve, 2000));
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
                <div className="space-y-4">
                  <div className="text-sm font-medium text-gray-900">
                    Preview for: {selectedEmployee['EMPLOYEE NAME']}
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Employee ID: {selectedEmployee['EMPLOYEE ID']}</div>
                    <div>Department: {selectedEmployee['DEPARTMENT']}</div>
                    <div>Period: {selectedEmployee['AS ON']}</div>
                    <div className="font-medium text-green-600">Net Pay: {formatCurrency(selectedEmployee['NET PAY'])}</div>
                  </div>
                  
                  {/* Live Preview */}
                  <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
                    <div className="transform scale-50 origin-top-left" style={{ width: '200%', height: '200%' }}>
                      <PayslipTemplate employee={selectedEmployee} />
                    </div>
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

        {/* Hidden reference element for PDF generation */}
        <div ref={payslipRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default PayslipGenerator;
