import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, FileText, Users, Loader2, Eye, FileSpreadsheet, Info, Copyright } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ProfessionalPayslipTemplate from './templates/ProfessionalPayslipTemplate';

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

// Custom SR Logo Component - Premium 3D Style
const CustomSRLogo = ({ size = 56, className = "" }) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Outer glow effect with animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-teal-400 to-green-400 rounded-2xl blur-lg opacity-40 animate-pulse"></div>
      
      {/* Main logo container with enhanced 3D effect */}
      <div className="relative w-full h-full bg-gradient-to-br from-blue-600 via-teal-600 to-green-600 rounded-2xl shadow-2xl border-2 border-white/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
        {/* Inner gradient overlay for glass effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-white/10 to-transparent rounded-2xl"></div>
        
        {/* SR Letters with Premium 3D Design */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            width={size * 0.75} 
            height={size * 0.6} 
            viewBox="0 0 120 80" 
            className="drop-shadow-2xl"
          >
            <defs>
              {/* Enhanced gradients for 3D effect */}
              <linearGradient id="srGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="30%" stopColor="#f0f9ff" stopOpacity="0.95" />
                <stop offset="70%" stopColor="#e0f2fe" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#cffafe" stopOpacity="0.85" />
              </linearGradient>
              
              {/* Shadow filter for depth */}
              <filter id="letterShadow3D">
                <feDropShadow dx="3" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.4"/>
                <feDropShadow dx="1" dy="1" stdDeviation="2" floodColor="#1e40af" floodOpacity="0.3"/>
              </filter>
            </defs>
            
            {/* S Letter - Enhanced 3D Design */}
            <path
              d="M45 15 C45 8, 38 2, 30 2 L15 2 C8 2, 2 8, 2 15 C2 22, 8 26, 15 26 L35 26 C42 26, 45 30, 45 35 C45 42, 42 46, 35 46 L12 46 C8 46, 5 49, 5 52 C5 55, 8 58, 12 58 L42 58 C49 58, 55 52, 55 45 C55 38, 49 34, 42 34 L22 34 C15 34, 12 30, 12 25 C12 18, 15 15, 22 15 L45 15 Z"
              fill="url(#srGradient)"
              filter="url(#letterShadow3D)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
            />
            
            {/* R Letter - Enhanced 3D Design */}
            <path
              d="M65 2 L65 58 M65 2 L85 2 C92 2, 98 8, 98 15 C98 22, 92 28, 85 28 L65 28 M85 28 L98 58"
              fill="none"
              stroke="url(#srGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#letterShadow3D)"
            />
            
            {/* R Letter Fill */}
            <path
              d="M65 2 L85 2 C92 2, 98 8, 98 15 C98 22, 92 28, 85 28 L65 28 L65 2 Z"
              fill="url(#srGradient)"
              filter="url(#letterShadow3D)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1"
            />
            
            {/* Highlight effects for 3D depth */}
            <path
              d="M45 15 C45 8, 38 2, 30 2 L15 2 C8 2, 2 8, 2 15 C2 18, 4 21, 8 23"
              fill="none"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            
            <path
              d="M65 2 L85 2 C88 2, 91 4, 93 7"
              fill="none"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        
        {/* Enhanced corner accent elements */}
        <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-white/50 rounded-full shadow-sm"></div>
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-white/40 rounded-full shadow-sm"></div>
        <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-white/30 rounded-full"></div>
        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-white/35 rounded-full"></div>
        
        {/* Subtle inner border for premium feel */}
        <div className="absolute inset-1 border border-white/20 rounded-xl pointer-events-none"></div>
      </div>
    </div>
  );
};

const PayslipGenerator = () => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [columnMapping, setColumnMapping] = useState<{[key: string]: string}>({});
  const [processedLogoUrl, setProcessedLogoUrl] = useState<string>('/company_logo.jpeg');
  const [showPdfTemplate, setShowPdfTemplate] = useState(false);
  const [pdfEmployee, setPdfEmployee] = useState<EmployeeData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const payslipRef = useRef<HTMLDivElement>(null);

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
        
        if (jsonData.length === 0) {
          toast.error('Excel file appears to be empty');
          return;
        }

        const firstRow = jsonData[0];
        const excelHeaders = Object.keys(firstRow);
        
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
        
        const processedData = jsonData.map((row, index) => {
          const processedRow: any = {};
          
          Object.entries(fieldMappings).forEach(([standardField]) => {
            const excelColumn = mapping[standardField];
            if (excelColumn && row[excelColumn] !== undefined) {
              let value = row[excelColumn];
              
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
              if (['NET PAY', 'GROSS SALARY', 'TOTAL DEDUCTIONS', 'EARNED BASIC', 'HRA', 
                   'LOCAN CONVEY', 'MEDICAL ALLOW', 'CITY COMPENSATORY ALLOWANCE (CCA)', 
                   'CHILDREN EDUCATION ALLOWANCE (CEA)', 'OTHER ALLOWANCE', 'INCENTIVE', 
                   'PF', 'ESI', 'TDS', 'PT', 'STAFF WELFARE', 'SALARY ADVANCE', 
                   'TOTAL DAYS', 'PRESENT DAYS', 'SALARY DAYS', 'LOP'].includes(standardField)) {
                processedRow[standardField] = 0;
              } else {
                processedRow[standardField] = standardField === 'EMPLOYEE NAME' ? `Employee ${index + 1}` :
                                           standardField === 'EMPLOYEE ID' ? `EMP${String(index + 1).padStart(3, '0')}` :
                                           standardField === 'AS ON' ? getCurrentMonthYear() :
                                           '';
              }
            }
          });
          
          return processedRow;
        });
        
        setEmployees(processedData);
        setSelectedEmployee(processedData[0] || null);
        toast.success(`Successfully loaded ${processedData.length} employee records`);
        
      } catch (error) {
        toast.error('Error reading Excel file. Please check the format.');
        console.error('Excel parsing error:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const getCurrentMonthYear = () => {
    const now = new Date();
    return now.toLocaleDateString('en-IN', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatMonthYearForFilename = (dateString: string) => {
    console.log('Formatting for filename - raw data:', dateString);
    
    if (!dateString) {
      const now = new Date();
      return now.toLocaleDateString('en-GB', { 
        month: 'short', 
        year: 'numeric' 
      }).replace(' ', '_');
    }
    
    const cleanDateString = String(dateString).trim();
    console.log('Cleaned data for filename:', cleanDateString);
    
    // Handle "FEB 2023" or "February 2023" format directly
    if (cleanDateString.match(/^[A-Za-z]{3,9}\s+\d{4}$/)) {
      const parts = cleanDateString.split(/\s+/);
      if (parts.length === 2) {
        const monthAbbr = parts[0].toUpperCase();
        const year = parts[1];
        
        const monthMap: {[key: string]: string} = {
          'JAN': 'Jan', 'JANUARY': 'Jan', 'FEB': 'Feb', 'FEBRUARY': 'Feb',
          'MAR': 'Mar', 'MARCH': 'Mar', 'APR': 'Apr', 'APRIL': 'Apr',
          'MAY': 'May', 'JUN': 'Jun', 'JUNE': 'Jun', 'JUL': 'Jul', 'JULY': 'Jul',
          'AUG': 'Aug', 'AUGUST': 'Aug', 'SEP': 'Sep', 'SEPTEMBER': 'Sep',
          'OCT': 'Oct', 'OCTOBER': 'Oct', 'NOV': 'Nov', 'NOVEMBER': 'Nov',
          'DEC': 'Dec', 'DECEMBER': 'Dec'
        };
        
        const shortMonth = monthMap[monthAbbr] || monthAbbr.charAt(0).toUpperCase() + monthAbbr.slice(1).toLowerCase();
        const result = `${shortMonth}_${year}`;
        console.log('Final formatted filename period:', result);
        return result;
      }
    }
    
    // Handle MM/YYYY format
    if (cleanDateString.match(/^\d{1,2}\/\d{4}$/)) {
      const parts = cleanDateString.split('/');
      const month = parseInt(parts[0]);
      const year = parts[1];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      if (month >= 1 && month <= 12) {
        return `${monthNames[month - 1]}_${year}`;
      }
    }
    
    // Handle Excel serial number
    if (!isNaN(Number(cleanDateString))) {
      const excelEpoch = new Date(1900, 0, 1);
      const date = new Date(excelEpoch.getTime() + (Number(cleanDateString) - 2) * 24 * 60 * 60 * 1000);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-GB', { 
          month: 'short', 
          year: 'numeric' 
        }).replace(' ', '_');
      }
    }
    
    // Fallback
    const now = new Date();
    return now.toLocaleDateString('en-GB', { 
      month: 'short', 
      year: 'numeric' 
    }).replace(' ', '_');
  };

  const renderTemplate = (employee: EmployeeData) => {
    const templateProps = { employee, processedLogoUrl };
    return <ProfessionalPayslipTemplate {...templateProps} />;
  };

  const generatePDF = async (employee: EmployeeData, showToast: boolean = true) => {
    try {
      setPdfEmployee(employee);
      setShowPdfTemplate(true);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (!payslipRef.current) {
        throw new Error('PDF template not found');
      }
      
      const canvas = await html2canvas(payslipRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 794,
        height: 1123,
        windowWidth: 1200,
        windowHeight: 1600
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Enhanced filename with proper salary period from Excel
      const salaryPeriod = formatMonthYearForFilename(employee['AS ON']);
      const employeeName = employee['EMPLOYEE NAME'].replace(/[^a-zA-Z0-9]/g, '_');
      const employeeId = employee['EMPLOYEE ID'];
      
      const filename = `${employeeId}_${employeeName}_${salaryPeriod}.pdf`;
      console.log('Final filename:', filename);
      
      pdf.save(filename);
      
      setShowPdfTemplate(false);
      setPdfEmployee(null);
      
      if (showToast) {
        toast.success(`PDF generated: ${filename}`);
      }
      
      return true;
    } catch (error) {
      console.error('PDF generation error:', error);
      setShowPdfTemplate(false);
      setPdfEmployee(null);
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
      
      const success = await generatePDF(employee, false);
      
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
      
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

  // Helper function to format month/year for filename
  const formatMonthYear = (dateString: string) => {
    if (!dateString) {
      const now = new Date();
      return now.toLocaleDateString('en-IN', { 
        month: 'short', 
        year: 'numeric' 
      }).replace(' ', '_');
    }
    
    const cleanDateString = String(dateString).trim();
    
    // Check if it's already in Month Year format
    if (cleanDateString.match(/^[A-Za-z]{3,9}\s+\d{4}$/)) {
      const parts = cleanDateString.split(/\s+/);
      if (parts.length === 2) {
        const monthAbbr = parts[0].toUpperCase();
        const year = parts[1];
        
        const monthMap: {[key: string]: string} = {
          'JAN': 'Jan', 'JANUARY': 'Jan', 'FEB': 'Feb', 'FEBRUARY': 'Feb',
          'MAR': 'Mar', 'MARCH': 'Mar', 'APR': 'Apr', 'APRIL': 'Apr',
          'MAY': 'May', 'JUN': 'Jun', 'JUNE': 'Jun', 'JUL': 'Jul', 'JULY': 'Jul',
          'AUG': 'Aug', 'AUGUST': 'Aug', 'SEP': 'Sep', 'SEPTEMBER': 'Sep',
          'OCT': 'Oct', 'OCTOBER': 'Oct', 'NOV': 'Nov', 'NOVEMBER': 'Nov',
          'DEC': 'Dec', 'DECEMBER': 'Dec'
        };
        
        const shortMonth = monthMap[monthAbbr] || monthAbbr;
        return `${shortMonth}_${year}`;
      }
    }
    
    // Fallback
    const now = new Date();
    return now.toLocaleDateString('en-IN', { 
      month: 'short', 
      year: 'numeric' 
    }).replace(' ', '_');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Enhanced Header with Rao's Branding */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Enhanced Logo Design with Rao's Branding */}
              <div className="relative">
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black shadow-2xl transform hover:scale-105 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    color: '#1e40af',
                    border: '4px solid rgba(255,255,255,0.3)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <span style={{ 
                    fontFamily: '"Playfair Display", serif',
                    textShadow: '0 2px 4px rgba(30, 64, 175, 0.3)',
                    letterSpacing: '1px'
                  }}>
                    R
                  </span>
                </div>
                {/* Decorative Elements */}
                <div 
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(251, 191, 36, 0.4)'
                  }}
                >
                  ✨
                </div>
              </div>
              
              <div>
                <h1 
                  className="text-4xl font-black mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  Rao's Payslip Generator
                </h1>
                <div className="flex items-center space-x-4">
                  <p className="text-blue-100 font-semibold">Professional • Fast • Secure</p>
                  <div 
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    ✨ Designed & Powered by Lovable
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Action Buttons */}
            <div className="flex items-center space-x-4">
              <div 
                className="px-4 py-2 rounded-xl font-bold text-sm"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                💼 Professional Tool
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Upload & Controls */}
          <div className="space-y-6">
            {/* File Upload Card */}
            <Card className="border border-teal-200 shadow-lg bg-gradient-to-br from-blue-50/50 via-teal-50/45 to-green-50/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-xl text-slate-800">
                  <div className="p-3 bg-gradient-to-br from-blue-500 via-teal-500 to-green-500 rounded-xl shadow-lg">
                    <FileSpreadsheet className="w-6 h-6 text-white" />
                  </div>
                  <span>1. Upload Excel File</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-teal-300 rounded-xl p-6 hover:border-teal-400 hover:bg-gradient-to-br hover:from-blue-50/60 hover:via-teal-50/55 hover:to-green-50/60 transition-all duration-300 group bg-gradient-to-br from-blue-50/40 via-teal-50/35 to-green-50/40">
                  <div className="text-center">
                    <div className="relative mb-4">
                      <Upload className="w-12 h-12 text-teal-400 mx-auto group-hover:text-teal-500 transition-colors" />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    </div>
                    <Label htmlFor="excel-upload" className="text-lg font-semibold text-slate-700 cursor-pointer hover:text-teal-600 transition-colors">
                      Choose Excel File
                    </Label>
                    <p className="text-sm text-slate-500 mt-2">Supports .xlsx and .xls formats</p>
                    <Input
                      id="excel-upload"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileUpload}
                      className="mt-4 file:bg-gradient-to-r file:from-blue-500 file:via-teal-500 file:to-green-500 file:text-white file:border-0 file:rounded-lg file:px-4 file:py-2 file:mr-4 file:shadow-md hover:file:shadow-lg file:transition-all bg-gradient-to-br from-blue-50/45 via-teal-50/40 to-green-50/45"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600 bg-gradient-to-r from-blue-50/45 via-teal-50/40 to-green-50/45 p-3 rounded-lg">
                  <Info className="w-4 h-4 text-teal-500" />
                  <span>Excel file should have column headers in the first row</span>
                </div>
              </CardContent>
            </Card>

            {/* Employee Data Card */}
            {employees.length > 0 && (
              <Card className="border border-emerald-200 shadow-lg bg-gradient-to-br from-blue-50/50 via-teal-50/45 to-green-50/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3 text-xl text-slate-800">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span>2. Generate Professional Payslips</span>
                    <div className="ml-auto bg-gradient-to-r from-emerald-100/90 to-green-100/80 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                      {employees.length} employees
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={generateAllPDFs}
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 hover:from-blue-600 hover:via-teal-600 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating... ({currentProgress}/{employees.length})
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Generate All PDFs
                        </>
                      )}
                    </Button>
                    
                    {selectedEmployee && (
                      <Button
                        onClick={() => setShowPreview(true)}
                        variant="outline"
                        className="border-teal-300 hover:bg-gradient-to-br hover:from-blue-50/60 hover:via-teal-50/55 hover:to-green-50/60 transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-blue-50/45 via-teal-50/40 to-green-50/45"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    )}
                  </div>

                  {/* Employee List */}
                  <div className="max-h-64 overflow-y-auto border border-teal-200 rounded-xl shadow-inner bg-gradient-to-br from-blue-50/45 via-teal-50/40 to-green-50/45 backdrop-blur-sm">
                    <table className="w-full text-sm">
                      <thead className="bg-gradient-to-r from-blue-50/60 via-teal-50/55 to-green-50/60 sticky top-0 backdrop-blur-sm">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-700">ID</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-700">Net Pay</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-700">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((emp, index) => (
                          <tr key={index} className="border-t border-teal-100 hover:bg-gradient-to-r hover:from-blue-50/55 hover:via-teal-50/50 hover:to-green-50/55 transition-all duration-200">
                            <td className="px-4 py-3 font-medium text-slate-900">{emp['EMPLOYEE NAME']}</td>
                            <td className="px-4 py-3 text-slate-600">{emp['EMPLOYEE ID']}</td>
                            <td className="px-4 py-3 text-emerald-600 font-semibold">{formatCurrency(emp['NET PAY'])}</td>
                            <td className="px-4 py-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => generatePDF(emp)}
                                disabled={isGenerating}
                                className="text-xs border-teal-200 hover:bg-gradient-to-r hover:from-blue-50/55 hover:via-teal-50/50 hover:to-green-50/55 hover:border-teal-300 transition-all duration-200 bg-gradient-to-br from-blue-50/40 via-teal-50/35 to-green-50/40"
                              >
                                <FileText className="w-3 h-3 mr-1" />
                                PDF
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Preview */}
          <div className="space-y-6">
            <Card className="border border-indigo-200 shadow-lg bg-gradient-to-br from-blue-50/50 via-teal-50/45 to-green-50/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-xl text-slate-800">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <span>Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedEmployee ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-50/60 via-teal-50/55 to-green-50/60 rounded-xl p-5 border border-teal-200 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mr-2"></div>
                        {selectedEmployee['EMPLOYEE NAME']}
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <span className="text-slate-500 text-xs uppercase tracking-wide">Employee ID</span>
                          <div className="font-semibold text-slate-800">{selectedEmployee['EMPLOYEE ID']}</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-500 text-xs uppercase tracking-wide">Department</span>
                          <div className="font-semibold text-slate-800">{selectedEmployee['DEPARTMENT'] || 'General'}</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-500 text-xs uppercase tracking-wide">Period</span>
                          <div className="font-semibold text-slate-800">{selectedEmployee['AS ON'] || getCurrentMonthYear()}</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-500 text-xs uppercase tracking-wide">Template</span>
                          <div className="font-semibold text-slate-800">Professional</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-50/95 to-green-50/90 border border-emerald-200 rounded-xl p-5 text-center shadow-sm">
                      <div className="flex items-center justify-center mb-2">
                        <div className="text-emerald-700 font-semibold text-sm">Net Salary</div>
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        {formatCurrency(selectedEmployee['NET PAY'] || 12765)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="relative mb-4">
                      <FileSpreadsheet className="w-16 h-16 text-slate-300 mx-auto" />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-green-300 rounded-full blur-xl opacity-20"></div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No Data Loaded</h3>
                    <p className="text-slate-500">Upload an Excel file to see employee data and preview payslips</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Copyright Badge at Bottom */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="bg-gradient-to-r from-blue-600/90 via-teal-600/90 to-green-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-lg border border-white/20 flex items-center space-x-2 text-sm font-medium">
          <Copyright className="w-4 h-4" />
          <span>Powered & Developed by Sutejrao K S</span>
        </div>
      </div>

      {/* Template Preview Modal */}
      {showPreview && selectedEmployee && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-blue-50/95 via-teal-50/90 to-green-50/95 rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-auto border border-teal-200">
            <div className="flex justify-between items-center p-6 border-b border-teal-200 bg-gradient-to-r from-blue-50/80 via-teal-50/75 to-green-50/80">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center">
                <Eye className="w-6 h-6 mr-3 text-teal-600" />
                Professional Payslip Preview
              </h3>
              <Button 
                onClick={() => setShowPreview(false)} 
                variant="outline"
                size="sm"
                className="hover:bg-gradient-to-r hover:from-blue-100/80 hover:via-teal-100/75 hover:to-green-100/80 transition-colors bg-gradient-to-br from-blue-50/60 via-teal-50/55 to-green-50/60"
              >
                Close
              </Button>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-50/60 via-teal-50/55 to-green-50/60">
              <div className="transform scale-50 origin-top-left bg-white rounded-lg shadow-lg">
                {renderTemplate(selectedEmployee)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Generation Modal */}
      {showPdfTemplate && pdfEmployee && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-blue-50/95 via-teal-50/90 to-green-50/95 rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-auto border border-teal-200">
            <div className="text-center p-8 border-b border-teal-200 bg-gradient-to-r from-blue-50/80 via-teal-50/75 to-green-50/80">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="relative">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600 rounded-full blur-lg opacity-20"></div>
                </div>
                <span className="text-xl font-bold text-slate-900">
                  Generating PDF for {pdfEmployee['EMPLOYEE NAME']}
                </span>
              </div>
              <p className="text-slate-600">Please wait while we process your professional payslip...</p>
            </div>
            
            <div ref={payslipRef} className="p-6 bg-gradient-to-br from-blue-50/60 via-teal-50/55 to-green-50/60">
              {renderTemplate(pdfEmployee)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayslipGenerator;
