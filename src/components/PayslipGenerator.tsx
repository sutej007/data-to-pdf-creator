import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, FileText, Users, Loader2, Eye, Palette, Sparkles, Zap, Moon, Sun, Crown, Gem, Star, Rocket, Shield, Heart, Waves, Mountain, Leaf, Flame, Snowflake, TreePine } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ClassicPayslipTemplate from './templates/ClassicPayslipTemplate';
import ModernPayslipTemplate from './templates/ModernPayslipTemplate';
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

type TemplateType = 'classic' | 'modern' | 'professional';
type ThemeType = 'ocean-breeze' | 'forest-harmony' | 'corporate-elite' | 'digital-wave' | 'nature-zen' | 'tech-fusion';

const PayslipGenerator = () => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [columnMapping, setColumnMapping] = useState<{[key: string]: string}>({});
  const [processedLogoUrl, setProcessedLogoUrl] = useState<string>('');
  const [showPdfTemplate, setShowPdfTemplate] = useState(false);
  const [pdfEmployee, setPdfEmployee] = useState<EmployeeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('ocean-breeze');
  const [showPreview, setShowPreview] = useState(false);
  const payslipRef = useRef<HTMLDivElement>(null);

  // Advanced logo processing function
  const processLogo = async (): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const scale = 6;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        if (!ctx) {
          resolve('');
          return;
        }
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const alpha = data[i + 3];
          
          const brightness = (r + g + b) / 3;
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const saturation = max === 0 ? 0 : (max - min) / max;
          
          const isBlack = brightness < 35 && saturation < 0.3;
          const isVeryDark = brightness < 50 && saturation < 0.2;
          
          if (isBlack) {
            data[i + 3] = 0;
          } else if (isVeryDark) {
            data[i + 3] = Math.max(0, alpha * 0.3);
          } else {
            const contrastFactor = 1.15;
            const brightnessFactor = 1.08;
            const saturationFactor = 1.12;
            
            data[i] = Math.min(255, r * brightnessFactor);
            data[i + 1] = Math.min(255, g * brightnessFactor);
            data[i + 2] = Math.min(255, b * brightnessFactor);
            
            data[i] = Math.min(255, ((data[i] - 128) * contrastFactor) + 128);
            data[i + 1] = Math.min(255, ((data[i + 1] - 128) * contrastFactor) + 128);
            data[i + 2] = Math.min(255, ((data[i + 2] - 128) * contrastFactor) + 128);
            
            const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = Math.min(255, gray + (data[i] - gray) * saturationFactor);
            data[i + 1] = Math.min(255, gray + (data[i + 1] - gray) * saturationFactor);
            data[i + 2] = Math.min(255, gray + (data[i + 2] - gray) * saturationFactor);
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        const sharpenedCanvas = document.createElement('canvas');
        const sharpenedCtx = sharpenedCanvas.getContext('2d');
        sharpenedCanvas.width = canvas.width;
        sharpenedCanvas.height = canvas.height;
        
        if (sharpenedCtx) {
          sharpenedCtx.filter = 'contrast(110%) brightness(105%) saturate(110%)';
          sharpenedCtx.drawImage(canvas, 0, 0);
          
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
                                           standardField === 'AS ON' ? new Date().toLocaleDateString('en-IN') :
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

  const renderTemplate = (employee: EmployeeData) => {
    const templateProps = { employee, processedLogoUrl };
    
    switch (selectedTemplate) {
      case 'classic':
        return <ClassicPayslipTemplate {...templateProps} />;
      case 'modern':
        return <ModernPayslipTemplate {...templateProps} />;
      case 'professional':
        return <ProfessionalPayslipTemplate {...templateProps} />;
      default:
        return <ModernPayslipTemplate {...templateProps} />;
    }
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
      pdf.save(`Payslip_${employee['EMPLOYEE NAME']}_${employee['AS ON']}.pdf`);
      
      setShowPdfTemplate(false);
      setPdfEmployee(null);
      
      if (showToast) {
        toast.success(`PDF generated for ${employee['EMPLOYEE NAME']}`);
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

  // 6 NEW Premium Theme configurations inspired by company logo colors (Blue & Green)
  const themes = {
    'ocean-breeze': {
      name: 'Ocean Breeze',
      icon: Waves,
      bg: 'bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-900',
      card: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/15 backdrop-blur-2xl border border-blue-400/30 shadow-2xl',
      text: 'text-cyan-50',
      button: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-xl',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      accent: 'text-cyan-300',
      glow: 'shadow-cyan-500/30',
      description: 'Inspired by ocean waves with blue-cyan gradients'
    },
    'forest-harmony': {
      name: 'Forest Harmony',
      icon: TreePine,
      bg: 'bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900',
      card: 'bg-gradient-to-br from-green-500/20 to-emerald-500/15 backdrop-blur-2xl border border-green-400/30 shadow-2xl',
      text: 'text-green-50',
      button: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-xl',
      fontFamily: 'Georgia, "Times New Roman", serif',
      accent: 'text-green-300',
      glow: 'shadow-green-500/30',
      description: 'Natural green tones matching company identity'
    },
    'corporate-elite': {
      name: 'Corporate Elite',
      icon: Shield,
      bg: 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900',
      card: 'bg-gradient-to-br from-blue-600/20 to-indigo-600/15 backdrop-blur-2xl border border-blue-500/30 shadow-2xl',
      text: 'text-blue-50',
      button: 'bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white shadow-xl',
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      accent: 'text-blue-300',
      glow: 'shadow-blue-500/30',
      description: 'Professional blue theme for corporate excellence'
    },
    'digital-wave': {
      name: 'Digital Wave',
      icon: Zap,
      bg: 'bg-gradient-to-br from-cyan-900 via-blue-800 to-green-900',
      card: 'bg-gradient-to-br from-cyan-500/20 to-green-500/15 backdrop-blur-2xl border border-cyan-400/30 shadow-2xl',
      text: 'text-cyan-50',
      button: 'bg-gradient-to-r from-cyan-600 to-green-600 hover:from-cyan-700 hover:to-green-700 text-white shadow-xl',
      fontFamily: '"Roboto", "Helvetica Neue", sans-serif',
      accent: 'text-cyan-300',
      glow: 'shadow-cyan-500/30',
      description: 'Futuristic cyan-green blend for digital innovation'
    },
    'nature-zen': {
      name: 'Nature Zen',
      icon: Leaf,
      bg: 'bg-gradient-to-br from-teal-900 via-green-800 to-blue-900',
      card: 'bg-gradient-to-br from-teal-500/20 to-blue-500/15 backdrop-blur-2xl border border-teal-400/30 shadow-2xl',
      text: 'text-teal-50',
      button: 'bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-xl',
      fontFamily: '"Playfair Display", Georgia, serif',
      accent: 'text-teal-300',
      glow: 'shadow-teal-500/30',
      description: 'Peaceful teal-blue harmony for balanced design'
    },
    'tech-fusion': {
      name: 'Tech Fusion',
      icon: Rocket,
      bg: 'bg-gradient-to-br from-indigo-900 via-blue-800 to-green-900',
      card: 'bg-gradient-to-br from-indigo-500/20 to-green-500/15 backdrop-blur-2xl border border-indigo-400/30 shadow-2xl',
      text: 'text-indigo-50',
      button: 'bg-gradient-to-r from-indigo-600 to-green-600 hover:from-indigo-700 hover:to-green-700 text-white shadow-xl',
      fontFamily: '"Source Code Pro", "Courier New", monospace',
      accent: 'text-indigo-300',
      glow: 'shadow-indigo-500/30',
      description: 'High-tech indigo-green fusion for innovation'
    }
  };

  const currentTheme = themes[selectedTheme];

  return (
    <div 
      className={`min-h-screen transition-all duration-1000 ${currentTheme.bg} relative overflow-hidden`}
      style={{ fontFamily: currentTheme.fontFamily }}
    >
      {/* Enhanced Animated Background Elements with Logo Colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs with Company Colors */}
        <div className={`absolute top-20 left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse ${currentTheme.glow}`}></div>
        <div className={`absolute top-40 right-32 w-32 h-32 bg-green-500/15 rounded-full blur-2xl animate-bounce delay-1000 ${currentTheme.glow}`}></div>
        <div className={`absolute bottom-32 left-40 w-48 h-48 bg-cyan-500/8 rounded-full blur-3xl animate-pulse delay-2000 ${currentTheme.glow}`}></div>
        <div className={`absolute bottom-20 right-20 w-36 h-36 bg-teal-500/12 rounded-full blur-2xl animate-bounce delay-500 ${currentTheme.glow}`}></div>
        
        {/* Geometric Patterns with Logo Colors */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400/30 rotate-45 animate-spin" style={{ animationDuration: '10s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-4 h-4 bg-green-400/25 rotate-45 animate-spin" style={{ animationDuration: '15s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-cyan-400/35 rotate-45 animate-spin" style={{ animationDuration: '8s' }}></div>
        
        {/* Company Logo Background (Enhanced with Multiple Positions) */}
        {processedLogoUrl && (
          <>
            {/* Center Watermark */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 w-[500px] h-[500px]"
              style={{
                backgroundImage: `url(${processedLogoUrl})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                filter: 'blur(3px)'
              }}
            />
            {/* Corner Logos */}
            <div 
              className="absolute top-20 right-20 opacity-10 w-24 h-24 animate-pulse"
              style={{
                backgroundImage: `url(${processedLogoUrl})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
              }}
            />
            <div 
              className="absolute bottom-20 left-20 opacity-10 w-20 h-20 animate-pulse delay-1000"
              style={{
                backgroundImage: `url(${processedLogoUrl})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
              }}
            />
            {/* Floating Logos */}
            <div 
              className="absolute top-1/3 right-1/3 opacity-8 w-16 h-16 animate-bounce delay-2000"
              style={{
                backgroundImage: `url(${processedLogoUrl})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
              }}
            />
          </>
        )}
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header with Theme Selector */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <h1 className={`text-7xl font-bold mb-6 ${currentTheme.text} drop-shadow-2xl tracking-tight`}>
                Professional Payslip Generator
              </h1>
              <p className={`text-3xl ${currentTheme.accent} opacity-90 mb-10 tracking-wide`}>
                Transform Excel data into stunning PDF payslips with company-branded themes
              </p>
            </div>
            
            {/* Premium Theme Selector with Company Color Inspiration */}
            <div className={`inline-flex p-6 rounded-3xl ${currentTheme.card} ${currentTheme.glow} mb-10`}>
              <div className="w-full">
                <div className={`text-2xl font-bold ${currentTheme.text} mb-6 flex items-center justify-center gap-3`}>
                  <Palette className="w-8 h-8" />
                  Choose Your Premium Theme
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
                  {Object.entries(themes).map(([key, theme]) => {
                    const Icon = theme.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedTheme(key as ThemeType)}
                        className={`flex flex-col items-center space-y-4 px-8 py-8 rounded-2xl transition-all duration-700 transform ${
                          selectedTheme === key 
                            ? `bg-white/30 scale-110 ${theme.glow} shadow-2xl border-2 border-white/50` 
                            : 'hover:bg-white/15 hover:scale-105 border-2 border-transparent hover:border-white/30'
                        }`}
                        style={{ fontFamily: theme.fontFamily }}
                      >
                        <Icon className={`w-12 h-12 ${currentTheme.text}`} />
                        <div className="text-center">
                          <span className={`text-lg font-bold ${currentTheme.text} tracking-wide block mb-2`}>
                            {theme.name}
                          </span>
                          <span className={`text-sm ${currentTheme.accent} opacity-90 block mb-3`}>
                            {theme.description}
                          </span>
                          <div className={`text-xs ${currentTheme.text} opacity-75 px-3 py-1 rounded-full bg-white/10`}>
                            Font: {theme.fontFamily.split(',')[0].replace(/"/g, '')}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                {/* Current Theme Display */}
                <div className={`mt-8 p-6 rounded-2xl bg-white/10 border border-white/20`}>
                  <div className={`text-xl font-bold ${currentTheme.text} mb-3`}>
                    🎨 Current Theme: {currentTheme.name}
                  </div>
                  <div className={`text-lg ${currentTheme.accent} mb-2`}>
                    📝 Font Family: {currentTheme.fontFamily.split(',')[0].replace(/"/g, '')}
                  </div>
                  <div className={`text-base ${currentTheme.text} opacity-80`}>
                    ✨ {currentTheme.description}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Enhanced Upload and Controls */}
            <Card className={`${currentTheme.card} ${currentTheme.glow} transition-all duration-700 hover:scale-105 transform`}>
              <CardHeader className="pb-8">
                <CardTitle className={`flex items-center gap-4 ${currentTheme.text} text-3xl font-bold`}>
                  <Upload className="h-10 w-10" />
                  Upload Excel File
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-10">
                <div>
                  <Label htmlFor="excel-upload" className={`${currentTheme.text} font-semibold text-xl mb-4 block`}>
                    Select Excel file with employee salary data
                  </Label>
                  <Input
                    id="excel-upload"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className={`mt-4 ${currentTheme.card} ${currentTheme.text} border-white/30 text-lg p-5 rounded-xl`}
                  />
                  <p className={`text-sm ${currentTheme.accent} opacity-80 mt-3`}>
                    Excel file should have headers in the first row
                  </p>
                </div>

                {/* Enhanced Template Selection */}
                <div>
                  <Label className={`${currentTheme.text} font-semibold text-xl mb-5 block`}>Choose Payslip Template</Label>
                  <div className="grid grid-cols-3 gap-5">
                    {[
                      { key: 'classic', name: 'Classic', emoji: '📋', desc: 'Traditional & Elegant' },
                      { key: 'modern', name: 'Modern ⭐', emoji: '🚀', desc: 'Futuristic Design' },
                      { key: 'professional', name: 'Professional', emoji: '💼', desc: 'Corporate Standard' }
                    ].map(({ key, name, emoji, desc }) => (
                      <Button
                        key={key}
                        variant={selectedTemplate === key ? 'default' : 'outline'}
                        size="lg"
                        onClick={() => setSelectedTemplate(key as TemplateType)}
                        className={`${
                          selectedTemplate === key 
                            ? currentTheme.button 
                            : `${currentTheme.card} ${currentTheme.text} border-white/30 hover:bg-white/20`
                        } transition-all duration-500 hover:scale-115 transform flex flex-col p-8 h-auto`}
                      >
                        <span className="text-3xl mb-3">{emoji}</span>
                        <span className="font-bold text-lg">{name}</span>
                        <span className="text-xs opacity-80 mt-1">{desc}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Enhanced Logo Processing Status */}
                {processedLogoUrl && (
                  <div className="bg-green-500/25 border border-green-400/50 rounded-2xl p-8 backdrop-blur-sm">
                    <div className="text-xl font-bold text-green-100 mb-4 flex items-center">
                      <Sparkles className="w-8 h-8 mr-4" />
                      ✅ Company Logo Processing Complete
                    </div>
                    <div className="text-sm text-green-200">
                      Ultra-high quality logo with advanced AI processing applied successfully.
                      Your company branding is now integrated across all themes.
                    </div>
                  </div>
                )}

                {employees.length > 0 && (
                  <div className="space-y-8">
                    <div className={`flex items-center gap-4 ${currentTheme.text} text-xl`}>
                      <Users className="h-8 w-8" />
                      <span className="font-bold">{employees.length} employees loaded successfully</span>
                    </div>

                    <div className="grid gap-5">
                      <Button
                        onClick={generateAllPDFs}
                        disabled={isGenerating}
                        size="lg"
                        className={`w-full ${currentTheme.button} transition-all duration-500 hover:scale-105 transform shadow-2xl text-xl py-8`}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="h-8 w-8 mr-4 animate-spin" />
                            Generating PDFs... ({currentProgress}/{employees.length})
                          </>
                        ) : (
                          <>
                            <Download className="h-8 w-8 mr-4" />
                            Generate All {employees.length} PDFs
                          </>
                        )}
                      </Button>
                      
                      {selectedEmployee && (
                        <Button
                          onClick={() => setShowPreview(true)}
                          variant="outline"
                          size="lg"
                          className={`w-full ${currentTheme.card} ${currentTheme.text} border-white/30 hover:bg-white/20 transition-all duration-500 hover:scale-105 transform text-xl py-8`}
                        >
                          <Eye className="h-8 w-8 mr-4" />
                          Preview Template
                        </Button>
                      )}
                    </div>

                    <div className={`max-h-80 overflow-y-auto border border-white/30 rounded-2xl ${currentTheme.card} backdrop-blur-sm`}>
                      <table className="w-full text-sm">
                        <thead className={`${currentTheme.card} sticky top-0`}>
                          <tr>
                            <th className={`p-5 text-left font-bold ${currentTheme.text} text-lg`}>Employee Name</th>
                            <th className={`p-5 text-left font-bold ${currentTheme.text} text-lg`}>ID</th>
                            <th className={`p-5 text-left font-bold ${currentTheme.text} text-lg`}>Net Pay</th>
                            <th className={`p-5 text-left font-bold ${currentTheme.text} text-lg`}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {employees.map((emp, index) => (
                            <tr key={index} className={`border-t border-white/10 hover:bg-white/15 transition-colors ${currentTheme.text}`}>
                              <td className="p-5 font-semibold text-lg">{emp['EMPLOYEE NAME']}</td>
                              <td className="p-5 opacity-80">{emp['EMPLOYEE ID']}</td>
                              <td className="p-5 text-green-400 font-bold text-lg">{formatCurrency(emp['NET PAY'])}</td>
                              <td className="p-5">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => generatePDF(emp)}
                                  disabled={isGenerating}
                                  className="border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-110 transform"
                                >
                                  <FileText className="h-4 w-4 mr-2" />
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

            {/* Enhanced Preview */}
            <Card className={`${currentTheme.card} ${currentTheme.glow} transition-all duration-700 hover:scale-105 transform`}>
              <CardHeader className="pb-8">
                <CardTitle className={`${currentTheme.text} text-3xl font-bold`}>Payslip Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedEmployee ? (
                  <div className="space-y-8">
                    <div className={`text-3xl font-bold ${currentTheme.text}`}>
                      {selectedEmployee['EMPLOYEE NAME']}
                    </div>
                    <div className={`${currentTheme.accent} space-y-4 text-xl`}>
                      <div>Employee ID: <span className="font-semibold">{selectedEmployee['EMPLOYEE ID']}</span></div>
                      <div>Department: <span className="font-semibold">{selectedEmployee['DEPARTMENT']}</span></div>
                      <div>Period: <span className="font-semibold">{selectedEmployee['AS ON']}</span></div>
                      <div className="text-green-400 font-bold text-3xl mt-6">
                        Net Pay: {formatCurrency(selectedEmployee['NET PAY'])}
                      </div>
                    </div>
                    <div className={`text-sm ${currentTheme.text} opacity-80 bg-white/15 p-6 rounded-xl backdrop-blur-sm`}>
                      <div className="font-semibold mb-3 text-lg">Configuration:</div>
                      <div className="space-y-2">
                        <div>Template: <span className="font-bold">{selectedTemplate}</span></div>
                        <div>Theme: <span className="font-bold">{currentTheme.name}</span></div>
                        <div>Font: <span className="font-bold">{currentTheme.fontFamily.split(',')[0].replace(/"/g, '')}</span></div>
                        <div>Company Branding: <span className="font-bold text-green-400">✅ Integrated</span></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`text-center py-20 ${currentTheme.text} opacity-70`}>
                    <FileText className="h-24 w-24 mx-auto mb-8 opacity-50" />
                    <p className="text-3xl mb-4 font-bold">Upload Excel file to see employee data</p>
                    <p className="text-xl">Individual PDFs will be generated for each employee with your company branding</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Template Preview Modal */}
          {showPreview && selectedEmployee && (
            <div className="fixed inset-0 bg-black/95 backdrop-blur-lg flex items-center justify-center z-50 p-6">
              <div className="bg-white rounded-3xl shadow-2xl max-w-6xl max-h-[95vh] overflow-auto">
                <div className="flex justify-between items-center p-10 border-b border-gray-200">
                  <h3 className="text-4xl font-bold text-gray-900">
                    Template Preview - {selectedTemplate} ({currentTheme.name})
                  </h3>
                  <Button 
                    onClick={() => setShowPreview(false)} 
                    variant="outline" 
                    size="lg"
                    className="hover:scale-110 transition-transform text-xl px-8 py-4"
                  >
                    Close
                  </Button>
                </div>
                <div className="p-10">
                  <div className="transform scale-50 origin-top-left">
                    {renderTemplate(selectedEmployee)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced PDF Generation Template - Hidden */}
          {showPdfTemplate && pdfEmployee && (
            <div className="fixed inset-0 bg-black/95 backdrop-blur-lg flex items-center justify-center z-50">
              <div className="bg-white rounded-3xl shadow-2xl max-w-6xl max-h-[95vh] overflow-auto">
                <div className="text-center p-10 border-b border-gray-200">
                  <p className="text-4xl font-bold text-gray-900 mb-6">
                    Generating PDF for {pdfEmployee['EMPLOYEE NAME']}...
                  </p>
                  <p className="text-2xl text-gray-600 mb-8">Please wait while we capture the payslip with premium quality</p>
                  <div className="flex justify-center items-center space-x-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                    <div className="text-lg text-blue-600 font-semibold">Processing with {currentTheme.name} theme...</div>
                  </div>
                </div>
                
                <div ref={payslipRef} className="p-10">
                  {renderTemplate(pdfEmployee)}
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