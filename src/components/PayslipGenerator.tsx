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
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoDataUrl, setLogoDataUrl] = useState<string>('');
  const [highResLogoDataUrl, setHighResLogoDataUrl] = useState<string>('');
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

  // Function to format date consistently
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    
    // If it's already in DD-MMM-YYYY format, return as is
    if (dateString.match(/^\d{2}-[A-Za-z]{3}-\d{4}$/)) {
      return dateString;
    }
    
    // Try to parse various date formats
    let date: Date;
    
    // Handle Excel date serial numbers
    if (!isNaN(Number(dateString))) {
      const excelDate = Number(dateString);
      // Excel date serial number (days since 1900-01-01, with 1900 incorrectly treated as leap year)
      date = new Date((excelDate - 25569) * 86400 * 1000);
    } else {
      // Try to parse as regular date
      date = new Date(dateString);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original if can't parse
    }
    
    // Format as DD-MMM-YYYY
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  };

  // Enhanced function to convert image to high-quality data URL
  const loadImageAsHighQualityDataUrl = (src: string, targetWidth: number = 200, targetHeight: number = 200): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set high resolution canvas
        const scale = 3; // 3x resolution for crisp output
        canvas.width = targetWidth * scale;
        canvas.height = targetHeight * scale;
        
        // Configure context for high quality
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Calculate aspect ratio and positioning
          const imgAspectRatio = img.width / img.height;
          const canvasAspectRatio = targetWidth / targetHeight;
          
          let drawWidth, drawHeight, offsetX, offsetY;
          
          if (imgAspectRatio > canvasAspectRatio) {
            // Image is wider than canvas
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgAspectRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
          } else {
            // Image is taller than canvas
            drawHeight = canvas.height;
            drawWidth = canvas.height * imgAspectRatio;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
          }
          
          // Fill background with white
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw image with high quality
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }
        
        // Convert to high quality PNG
        resolve(canvas.toDataURL('image/png', 1.0));
      };
      img.onerror = (error) => {
        console.error('Failed to load image:', error);
        reject(error);
      };
      img.src = src;
    });
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

    // Load and convert logo to high-quality data URL
    const loadLogo = async () => {
      try {
        console.log('Loading logo image with high quality...');
        
        // Try multiple logo paths
        const logoPaths = [
          '/WhatsApp Image 2025-06-28 at 23.24.54 copy copy.jpeg',
          '/WhatsApp Image 2025-06-28 at 23.24.54 copy.jpeg',
          '/WhatsApp Image 2025-06-28 at 23.24.54.jpeg'
        ];
        
        let logoLoaded = false;
        
        for (const logoPath of logoPaths) {
          try {
            console.log(`Trying to load logo from: ${logoPath}`);
            
            // Load standard resolution for preview
            const standardDataUrl = await loadImageAsHighQualityDataUrl(logoPath, 80, 80);
            setLogoDataUrl(standardDataUrl);
            
            // Load high resolution for PDF
            const highResDataUrl = await loadImageAsHighQualityDataUrl(logoPath, 240, 240);
            setHighResLogoDataUrl(highResDataUrl);
            
            setLogoLoaded(true);
            logoLoaded = true;
            console.log(`Logo loaded successfully from: ${logoPath}`);
            break;
          } catch (error) {
            console.warn(`Failed to load logo from ${logoPath}:`, error);
            continue;
          }
        }
        
        if (!logoLoaded) {
          console.error('Failed to load logo from all paths');
          setLogoLoaded(false);
        }
        
      } catch (error) {
        console.error('Failed to load logo image:', error);
        setLogoLoaded(false);
      }
    };

    loadLogo();

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
                                           standardField === 'DOJ' ? '01-Jan-2020' :
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
    try {
      console.log('Starting PDF generation for:', employee['EMPLOYEE NAME']);
      
      // Create a temporary container for the payslip
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.top = '0px';
      tempContainer.style.left = '0px';
      tempContainer.style.width = '794px';
      tempContainer.style.height = '1123px';
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.fontSize = '11px';
      tempContainer.style.lineHeight = '1.4';
      tempContainer.style.zIndex = '10000';
      
      // Use high-resolution logo for PDF
      const logoToUse = highResLogoDataUrl || logoDataUrl;
      
      // Create the payslip HTML content with enhanced logo styling
      tempContainer.innerHTML = `
        <div style="padding: 24px; height: 100%; background: white; border: 2px solid #e5e7eb;">
          <!-- Company Header with High-Quality Logo -->
          <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #1e40af;">
            <!-- Left Side - Logo and Company Info -->
            <div style="display: flex; align-items: flex-start; gap: 16px;">
              <!-- Company Logo with Enhanced Quality -->
              <div style="width: 80px; height: 80px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border: 2px solid #e5e7eb; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                ${logoLoaded && logoToUse ? 
                  `<img src="${logoToUse}" alt="Nava Chetana Logo" style="width: 76px; height: 76px; object-fit: contain; display: block; max-width: 100%; max-height: 100%; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; image-rendering: pixelated;" />` :
                  `<div style="width: 76px; height: 76px; background-color: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #6b7280; text-align: center; font-weight: bold; border-radius: 4px;">NAVA<br/>CHETANA<br/>LOGO</div>`
                }
              </div>
              
              <!-- Company Details -->
              <div>
                <h1 style="font-size: 14px; line-height: 1.2; font-weight: bold; color: #1e40af; margin-bottom: 4px;">
                  NAVACHETANA VIVIDODDESHA SOUHARDA SAHAKARI NIYAMIT
                </h1>
                <div style="font-size: 10px; color: #374151; line-height: 1.3;">
                  <div>HITAISHI PALACE, SHIRUR GROUP BUILDING P B ROAD, HAVERI</div>
                  <div>HAVERI - 581110, KARNATAKA</div>
                </div>
              </div>
            </div>
            
            <!-- Right Side - Payslip Title and Month -->
            <div style="text-align: right;">
              <div style="font-size: 16px; font-weight: bold; color: #1e40af; margin-bottom: 4px;">PAYSLIP</div>
              <div style="font-size: 12px; color: #6b7280;">Payslip for ${employee['AS ON']}</div>
            </div>
          </div>

          <!-- Employee Information Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
            <!-- Left Column - Employee Details -->
            <div>
              <div style="font-size: 12px; font-weight: bold; color: #1e40af; margin-bottom: 12px; padding-bottom: 4px; border-bottom: 1px solid #bfdbfe;">
                EMPLOYEE DETAILS
              </div>
              <div style="font-size: 10px; line-height: 1.5;">
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px; margin-bottom: 6px;">
                  <span style="color: #6b7280;">Employee Code:</span>
                  <span style="font-weight: 500;">${employee['EMPLOYEE ID']}</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px; margin-bottom: 6px;">
                  <span style="color: #6b7280;">Name:</span>
                  <span style="font-weight: 500;">${employee['EMPLOYEE NAME']}</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px; margin-bottom: 6px;">
                  <span style="color: #6b7280;">Designation:</span>
                  <span style="font-weight: 500;">${employee['DESIGNATION']}</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px; margin-bottom: 6px;">
                  <span style="color: #6b7280;">Department:</span>
                  <span style="font-weight: 500;">${employee['DEPARTMENT']}</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px; margin-bottom: 6px;">
                  <span style="color: #6b7280;">Gender:</span>
                  <span style="font-weight: 500;">Male</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px; margin-bottom: 6px;">
                  <span style="color: #6b7280;">Date of Birth:</span>
                  <span style="font-weight: 500;">02-Jul-1992</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px; margin-bottom: 6px;">
                  <span style="color: #6b7280;">Date of Joining:</span>
                  <span style="font-weight: 500;">${formatDate(employee['DOJ'])}</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px; margin-bottom: 6px;">
                  <span style="color: #6b7280;">Attendance:</span>
                  <span style="font-weight: 500;">Base,Elig: ${employee['PRESENT DAYS']}.00, ${employee['TOTAL DAYS']}.00</span>
                </div>
              </div>
            </div>
            
            <!-- Right Column - Bank & Statutory Details -->
            <div>
              <div style="font-size: 12px; font-weight: bold; color: #1e40af; margin-bottom: 12px; padding-bottom: 4px; border-bottom: 1px solid #bfdbfe;">
                BANK & STATUTORY INFO
              </div>
              <div style="font-size: 10px; line-height: 1.5;">
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px; margin-bottom: 6px;">
                  <span style="color: #6b7280;">Bank:</span>
                  <span style="font-weight: 500;">UJJIVAN SMALL FINANCE BANK</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px; margin-bottom: 6px;">
                  <span style="color: #6b7280;">Bank A/C No.:</span>
                  <span style="font-weight: 500;">113111008005138</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px; margin-bottom: 6px;">
                  <span style="color: #6b7280;">Location:</span>
                  <span style="font-weight: 500;">${employee['BRANCH']}</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px; margin-bottom: 6px;">
                  <span style="color: #6b7280;">PAN:</span>
                  <span style="font-weight: 500;">DZXPM7034M</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px; margin-bottom: 6px;">
                  <span style="color: #6b7280;">UAN:</span>
                  <span style="font-weight: 500;">${employee['UAN']}</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px; margin-bottom: 6px;">
                  <span style="color: #6b7280;">PF A/C No.:</span>
                  <span style="font-weight: 500;">${employee['PF NO']}</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px; margin-bottom: 6px;">
                  <span style="color: #6b7280;">ESI No.:</span>
                  <span style="font-weight: 500;">${employee['ESI NO']}</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px; margin-bottom: 6px;">
                  <span style="color: #6b7280;">Previous Period LOP:</span>
                  <span style="font-weight: 500;">LOP Reversal Days: 0.0, 0.0</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Earnings and Deductions Table -->
          <div style="margin-bottom: 24px;">
            <table style="width: 100%; font-size: 10px; border-collapse: collapse; border: 1px solid #d1d5db;">
              <thead>
                <tr style="background-color: #059669;">
                  <th style="padding: 8px; text-align: left; color: white; font-weight: bold; border: 1px solid #d1d5db;">Earnings</th>
                  <th style="padding: 8px; text-align: center; color: white; font-weight: bold; border: 1px solid #d1d5db;">Fixed Amount</th>
                  <th style="padding: 8px; text-align: center; color: white; font-weight: bold; border: 1px solid #d1d5db;">Earning Amount</th>
                  <th style="padding: 8px; text-align: left; color: white; font-weight: bold; border: 1px solid #d1d5db;">Deductions</th>
                  <th style="padding: 8px; text-align: center; color: white; font-weight: bold; border: 1px solid #d1d5db;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 8px; border: 1px solid #d1d5db;">Basic</td>
                  <td style="padding: 8px; text-align: right; border: 1px solid #d1d5db;">${employee['EARNED BASIC'].toFixed(2)}</td>
                  <td style="padding: 8px; text-align: right; border: 1px solid #d1d5db;">${employee['EARNED BASIC'].toFixed(2)}</td>
                  <td style="padding: 8px; border: 1px solid #d1d5db;">Employees StateInsurance</td>
                  <td style="padding: 8px; text-align: right; border: 1px solid #d1d5db;">${employee['ESI'].toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #d1d5db;">HouseRentAllowance</td>
                  <td style="padding: 8px; text-align: right; border: 1px solid #d1d5db;">${employee['HRA'].toFixed(2)}</td>
                  <td style="padding: 8px; text-align: right; border: 1px solid #d1d5db;">${employee['HRA'].toFixed(2)}</td>
                  <td style="padding: 8px; border: 1px solid #d1d5db;">Staff Welfare Fund</td>
                  <td style="padding: 8px; text-align: right; border: 1px solid #d1d5db;">${employee['STAFF WELFARE'].toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #d1d5db;">LocalConveyanceAllowance</td>
                  <td style="padding: 8px; text-align: right; border: 1px solid #d1d5db;">${employee['LOCAN CONVEY'].toFixed(2)}</td>
                  <td style="padding: 8px; text-align: right; border: 1px solid #d1d5db;">${employee['LOCAN CONVEY'].toFixed(2)}</td>
                  <td style="padding: 8px; border: 1px solid #d1d5db;">Staff Security Deposit</td>
                  <td style="padding: 8px; text-align: right; border: 1px solid #d1d5db;">200.00</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #d1d5db;">MedicalAllowance</td>
                  <td style="padding: 8px; text-align: right; border: 1px solid #d1d5db;">${employee['MEDICAL ALLOW'].toFixed(2)}</td>
                  <td style="padding: 8px; text-align: right; border: 1px solid #d1d5db;">${employee['MEDICAL ALLOW'].toFixed(2)}</td>
                  <td style="padding: 8px; border: 1px solid #d1d5db;">ProfessionalTax</td>
                  <td style="padding: 8px; text-align: right; border: 1px solid #d1d5db;">${employee['PT'].toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #d1d5db;">Incentive Pay</td>
                  <td style="padding: 8px; text-align: right; border: 1px solid #d1d5db;"></td>
                  <td style="padding: 8px; text-align: right; border: 1px solid #d1d5db;">${employee['INCENTIVE'].toFixed(2)}</td>
                  <td style="padding: 8px; border: 1px solid #d1d5db;">ProvidentFund</td>
                  <td style="padding: 8px; text-align: right; border: 1px solid #d1d5db;">${employee['PF'].toFixed(2)}</td>
                </tr>
                <tr style="background-color: #059669;">
                  <td style="padding: 8px; font-weight: bold; color: white; border: 1px solid #d1d5db;">Total Earnings</td>
                  <td style="padding: 8px; text-align: right; font-weight: bold; color: white; border: 1px solid #d1d5db;">${(employee['EARNED BASIC'] + employee['HRA'] + employee['LOCAN CONVEY'] + employee['MEDICAL ALLOW']).toFixed(2)}</td>
                  <td style="padding: 8px; text-align: right; font-weight: bold; color: white; border: 1px solid #d1d5db;">${employee['GROSS SALARY'].toFixed(2)}</td>
                  <td style="padding: 8px; font-weight: bold; color: white; border: 1px solid #d1d5db;">Total Deductions</td>
                  <td style="padding: 8px; text-align: right; font-weight: bold; color: white; border: 1px solid #d1d5db;">${employee['TOTAL DEDUCTIONS'].toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Net Salary -->
          <div style="text-align: center; margin-bottom: 24px; padding: 12px; background-color: #f0f9ff; border: 2px solid #0ea5e9;">
            <div style="font-size: 14px; font-weight: bold; color: #1e40af;">
              Net Salary: ₹${employee['NET PAY'].toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Rupees ${convertNumberToWords(employee['NET PAY'])})
            </div>
          </div>

          <!-- Footer Note -->
          <div style="text-align: center; font-size: 10px; color: #6b7280; border-top: 1px solid #d1d5db; padding-top: 12px;">
            <p style="margin-bottom: 4px;">
              <strong>Note:</strong> This is system generated payslip signature or company seal not required, your salary is confidential and should not be shared with other colleague.
            </p>
            <div style="display: flex; justify-content: space-between; margin-top: 12px;">
              <span>Page 1 of 1</span>
              <span>Downloaded On ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-US', { hour12: true })}</span>
            </div>
          </div>
        </div>
      `;

      // Add to document temporarily
      document.body.appendChild(tempContainer);

      // Wait for images to load and render
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Capturing element with html2canvas...');
      
      const canvas = await html2canvas(tempContainer, {
        scale: isMobile ? 2 : 3, // Higher scale for better quality
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        logging: false,
        imageTimeout: 20000,
        removeContainer: false,
        foreignObjectRendering: true,
        onclone: (clonedDoc) => {
          // Ensure images in cloned document have proper rendering
          const images = clonedDoc.querySelectorAll('img');
          images.forEach(img => {
            img.style.imageRendering = 'high-quality';
            img.style.imageRendering = '-webkit-optimize-contrast';
          });
        }
      });

      // Remove temporary container
      document.body.removeChild(tempContainer);

      console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas has no content - check if element is properly rendered');
      }

      const imgData = canvas.toDataURL('image/png', 1.0); // Maximum quality
      
      if (imgData === 'data:,') {
        throw new Error('Canvas is empty - no content captured');
      }

      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
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
                    <div>Date of Joining: {formatDate(selectedEmployee['DOJ'])}</div>
                    <div>Period: {selectedEmployee['AS ON']}</div>
                    <div className="font-medium text-green-600">Net Pay: {formatCurrency(selectedEmployee['NET PAY'])}</div>
                  </div>
                  <div className="text-xs text-blue-600 mt-3">
                    PDF will be generated with professional formatting and high-quality company logo
                  </div>
                  <div className={`text-xs mt-2 ${logoLoaded ? 'text-green-600' : 'text-orange-600'}`}>
                    {logoLoaded ? '✅ High-quality company logo loaded successfully' : '⚠️ Company logo is loading...'}
                  </div>
                  {logoLoaded && (
                    <div className="mt-3 p-2 bg-gray-50 rounded border">
                      <div className="text-xs text-gray-600 mb-2">Logo Preview:</div>
                      <img 
                        src={logoDataUrl} 
                        alt="Company Logo Preview" 
                        className="w-16 h-16 object-contain border border-gray-200 rounded"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 md:py-12 text-gray-500">
                  <FileText className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Upload Excel file to see employee data</p>
                  <p className="text-xs text-gray-400 mt-1">Individual PDFs will be generated for each employee with high-quality logo</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Hidden payslip template for reference only */}
        <div
          ref={payslipRef}
          style={{ display: 'none' }}
        >
          {/* This is kept for reference but not used in PDF generation */}
        </div>
      </div>
    </div>
  );
};

export default PayslipGenerator;