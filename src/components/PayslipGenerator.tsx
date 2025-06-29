import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, FileText, Users, Loader2, Eye, Palette, Sparkles, Zap, Moon, Sun, Crown, Gem, Star, Rocket, Shield, Heart } from "lucide-react";
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
type ThemeType = 'royal-luxury' | 'cosmic-nebula' | 'emerald-forest' | 'sunset-paradise' | 'arctic-frost' | 'golden-empire';

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
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('royal-luxury');
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

  // 6 Premium Theme configurations with unique fonts and styles
  const themes = {
    'royal-luxury': {
      name: 'Royal Luxury',
      icon: Crown,
      bg: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800',
      card: 'bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl',
      text: 'text-white',
      button: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg',
      font: 'font-serif',
      accent: 'text-purple-300',
      glow: 'shadow-purple-500/25'
    },
    'cosmic-nebula': {
      name: 'Cosmic Nebula',
      icon: Star,
      bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
      card: 'bg-gradient-to-br from-cyan-500/10 to-purple-500/10 backdrop-blur-2xl border border-cyan-400/30 shadow-2xl',
      text: 'text-cyan-100',
      button: 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg',
      font: 'font-mono',
      accent: 'text-cyan-300',
      glow: 'shadow-cyan-500/25'
    },
    'emerald-forest': {
      name: 'Emerald Forest',
      icon: Gem,
      bg: 'bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900',
      card: 'bg-gradient-to-br from-emerald-500/15 to-teal-500/10 backdrop-blur-xl border border-emerald-400/30 shadow-2xl',
      text: 'text-emerald-100',
      button: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg',
      font: 'font-sans',
      accent: 'text-emerald-300',
      glow: 'shadow-emerald-500/25'
    },
    'sunset-paradise': {
      name: 'Sunset Paradise',
      icon: Heart,
      bg: 'bg-gradient-to-br from-orange-600 via-pink-600 to-red-600',
      card: 'bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border border-white/25 shadow-2xl',
      text: 'text-white',
      button: 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg',
      font: 'font-sans',
      accent: 'text-orange-200',
      glow: 'shadow-orange-500/25'
    },
    'arctic-frost': {
      name: 'Arctic Frost',
      icon: Shield,
      bg: 'bg-gradient-to-br from-slate-800 via-blue-900 to-slate-800',
      card: 'bg-gradient-to-br from-blue-500/15 to-slate-500/10 backdrop-blur-xl border border-blue-400/30 shadow-2xl',
      text: 'text-blue-100',
      button: 'bg-gradient-to-r from-blue-600 to-slate-600 hover:from-blue-700 hover:to-slate-700 text-white shadow-lg',
      font: 'font-sans',
      accent: 'text-blue-300',
      glow: 'shadow-blue-500/25'
    },
    'golden-empire': {
      name: 'Golden Empire',
      icon: Rocket,
      bg: 'bg-gradient-to-br from-yellow-600 via-orange-600 to-amber-700',
      card: 'bg-gradient-to-br from-white/20 to-yellow-500/10 backdrop-blur-xl border border-yellow-400/30 shadow-2xl',
      text: 'text-white',
      button: 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white shadow-lg',
      font: 'font-serif',
      accent: 'text-yellow-200',
      glow: 'shadow-yellow-500/25'
    }
  };

  const currentTheme = themes[selectedTheme];

  return (
    <div className={`min-h-screen transition-all duration-700 ${currentTheme.bg} ${currentTheme.font} relative overflow-hidden`}>
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className={`absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse ${currentTheme.glow}`}></div>
        <div className={`absolute top-40 right-32 w-24 h-24 bg-white/10 rounded-full blur-xl animate-bounce delay-1000 ${currentTheme.glow}`}></div>
        <div className={`absolute bottom-32 left-40 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse delay-2000 ${currentTheme.glow}`}></div>
        <div className={`absolute bottom-20 right-20 w-28 h-28 bg-white/8 rounded-full blur-2xl animate-bounce delay-500 ${currentTheme.glow}`}></div>
        
        {/* Geometric Patterns */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rotate-45 animate-spin" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-white/15 rotate-45 animate-spin" style={{ animationDuration: '12s' }}></div>
        
        {/* Company Logo Background (for all themes) */}
        {processedLogoUrl && (
          <>
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 w-96 h-96"
              style={{
                backgroundImage: `url(${processedLogoUrl})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                filter: 'blur(2px)'
              }}
            />
            <div 
              className="absolute top-16 right-16 opacity-8 w-20 h-20 animate-pulse"
              style={{
                backgroundImage: `url(${processedLogoUrl})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
              }}
            />
            <div 
              className="absolute bottom-16 left-16 opacity-8 w-16 h-16 animate-pulse delay-1000"
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
          <div className="text-center mb-12">
            <div className="mb-6">
              <h1 className={`text-6xl font-bold mb-4 ${currentTheme.text} drop-shadow-2xl tracking-tight`}>
                Professional Payslip Generator
              </h1>
              <p className={`text-2xl ${currentTheme.accent} opacity-90 mb-8 tracking-wide`}>
                Transform Excel data into stunning PDF payslips with premium themes
              </p>
            </div>
            
            {/* Premium Theme Selector */}
            <div className={`inline-flex p-3 rounded-3xl ${currentTheme.card} ${currentTheme.glow} mb-8`}>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(themes).map(([key, theme]) => {
                  const Icon = theme.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedTheme(key as ThemeType)}
                      className={`flex flex-col items-center space-y-2 px-6 py-4 rounded-2xl transition-all duration-500 transform ${
                        selectedTheme === key 
                          ? `bg-white/25 scale-110 ${theme.glow} shadow-2xl` 
                          : 'hover:bg-white/10 hover:scale-105'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${currentTheme.text}`} />
                      <span className={`text-sm font-bold ${currentTheme.text} tracking-wide`}>
                        {theme.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Enhanced Upload and Controls */}
            <Card className={`${currentTheme.card} ${currentTheme.glow} transition-all duration-500 hover:scale-105 transform`}>
              <CardHeader className="pb-6">
                <CardTitle className={`flex items-center gap-4 ${currentTheme.text} text-2xl font-bold`}>
                  <Upload className="h-8 w-8" />
                  Upload Excel File
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <Label htmlFor="excel-upload" className={`${currentTheme.text} font-semibold text-lg mb-3 block`}>
                    Select Excel file with employee salary data
                  </Label>
                  <Input
                    id="excel-upload"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className={`mt-3 ${currentTheme.card} ${currentTheme.text} border-white/30 text-lg p-4 rounded-xl`}
                  />
                  <p className={`text-sm ${currentTheme.accent} opacity-80 mt-2`}>
                    Excel file should have headers in the first row
                  </p>
                </div>

                {/* Enhanced Template Selection */}
                <div>
                  <Label className={`${currentTheme.text} font-semibold text-lg mb-4 block`}>Choose Payslip Template</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { key: 'classic', name: 'Classic', emoji: '📋', desc: 'Traditional' },
                      { key: 'modern', name: 'Modern ⭐', emoji: '🚀', desc: 'Futuristic' },
                      { key: 'professional', name: 'Professional', emoji: '💼', desc: 'Corporate' }
                    ].map(({ key, name, emoji, desc }) => (
                      <Button
                        key={key}
                        variant={selectedTemplate === key ? 'default' : 'outline'}
                        size="lg"
                        onClick={() => setSelectedTemplate(key as TemplateType)}
                        className={`${
                          selectedTemplate === key 
                            ? currentTheme.button 
                            : `${currentTheme.card} ${currentTheme.text} border-white/30 hover:bg-white/15`
                        } transition-all duration-300 hover:scale-110 transform flex flex-col p-6 h-auto`}
                      >
                        <span className="text-2xl mb-2">{emoji}</span>
                        <span className="font-bold">{name}</span>
                        <span className="text-xs opacity-80">{desc}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Enhanced Logo Processing Status */}
                {processedLogoUrl && (
                  <div className="bg-green-500/20 border border-green-400/40 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="text-lg font-bold text-green-100 mb-3 flex items-center">
                      <Sparkles className="w-6 h-6 mr-3" />
                      ✅ Logo Processing Complete
                    </div>
                    <div className="text-sm text-green-200">
                      Ultra-high quality logo with advanced AI processing applied successfully
                    </div>
                  </div>
                )}

                {employees.length > 0 && (
                  <div className="space-y-6">
                    <div className={`flex items-center gap-4 ${currentTheme.text} text-lg`}>
                      <Users className="h-6 w-6" />
                      <span className="font-bold">{employees.length} employees loaded successfully</span>
                    </div>

                    <div className="grid gap-4">
                      <Button
                        onClick={generateAllPDFs}
                        disabled={isGenerating}
                        size="lg"
                        className={`w-full ${currentTheme.button} transition-all duration-300 hover:scale-105 transform shadow-2xl text-lg py-6`}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                            Generating PDFs... ({currentProgress}/{employees.length})
                          </>
                        ) : (
                          <>
                            <Download className="h-6 w-6 mr-3" />
                            Generate All {employees.length} PDFs
                          </>
                        )}
                      </Button>
                      
                      {selectedEmployee && (
                        <Button
                          onClick={() => setShowPreview(true)}
                          variant="outline"
                          size="lg"
                          className={`w-full ${currentTheme.card} ${currentTheme.text} border-white/30 hover:bg-white/15 transition-all duration-300 hover:scale-105 transform text-lg py-6`}
                        >
                          <Eye className="h-6 w-6 mr-3" />
                          Preview Template
                        </Button>
                      )}
                    </div>

                    <div className={`max-h-72 overflow-y-auto border border-white/30 rounded-2xl ${currentTheme.card} backdrop-blur-sm`}>
                      <table className="w-full text-sm">
                        <thead className={`${currentTheme.card} sticky top-0`}>
                          <tr>
                            <th className={`p-4 text-left font-bold ${currentTheme.text}`}>Employee Name</th>
                            <th className={`p-4 text-left font-bold ${currentTheme.text}`}>ID</th>
                            <th className={`p-4 text-left font-bold ${currentTheme.text}`}>Net Pay</th>
                            <th className={`p-4 text-left font-bold ${currentTheme.text}`}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {employees.map((emp, index) => (
                            <tr key={index} className={`border-t border-white/10 hover:bg-white/10 transition-colors ${currentTheme.text}`}>
                              <td className="p-4 font-semibold">{emp['EMPLOYEE NAME']}</td>
                              <td className="p-4 opacity-80">{emp['EMPLOYEE ID']}</td>
                              <td className="p-4 text-green-400 font-bold">{formatCurrency(emp['NET PAY'])}</td>
                              <td className="p-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => generatePDF(emp)}
                                  disabled={isGenerating}
                                  className="border-white/30 hover:bg-white/15 transition-all duration-300 hover:scale-110 transform"
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
            <Card className={`${currentTheme.card} ${currentTheme.glow} transition-all duration-500 hover:scale-105 transform`}>
              <CardHeader className="pb-6">
                <CardTitle className={`${currentTheme.text} text-2xl font-bold`}>Payslip Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedEmployee ? (
                  <div className="space-y-6">
                    <div className={`text-2xl font-bold ${currentTheme.text}`}>
                      {selectedEmployee['EMPLOYEE NAME']}
                    </div>
                    <div className={`${currentTheme.accent} space-y-3 text-lg`}>
                      <div>Employee ID: <span className="font-semibold">{selectedEmployee['EMPLOYEE ID']}</span></div>
                      <div>Department: <span className="font-semibold">{selectedEmployee['DEPARTMENT']}</span></div>
                      <div>Period: <span className="font-semibold">{selectedEmployee['AS ON']}</span></div>
                      <div className="text-green-400 font-bold text-2xl mt-4">
                        Net Pay: {formatCurrency(selectedEmployee['NET PAY'])}
                      </div>
                    </div>
                    <div className={`text-sm ${currentTheme.text} opacity-80 bg-white/10 p-4 rounded-xl backdrop-blur-sm`}>
                      <div className="font-semibold mb-2">Configuration:</div>
                      <div>Template: <span className="font-bold">{selectedTemplate}</span></div>
                      <div>Theme: <span className="font-bold">{currentTheme.name}</span></div>
                      <div>Font: <span className="font-bold">{currentTheme.font.replace('font-', '')}</span></div>
                    </div>
                  </div>
                ) : (
                  <div className={`text-center py-16 ${currentTheme.text} opacity-70`}>
                    <FileText className="h-20 w-20 mx-auto mb-6 opacity-50" />
                    <p className="text-2xl mb-3 font-bold">Upload Excel file to see employee data</p>
                    <p className="text-lg">Individual PDFs will be generated for each employee</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Template Preview Modal */}
          {showPreview && selectedEmployee && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50 p-6">
              <div className="bg-white rounded-3xl shadow-2xl max-w-6xl max-h-[95vh] overflow-auto">
                <div className="flex justify-between items-center p-8 border-b border-gray-200">
                  <h3 className="text-3xl font-bold text-gray-900">
                    Template Preview - {selectedTemplate} ({currentTheme.name})
                  </h3>
                  <Button 
                    onClick={() => setShowPreview(false)} 
                    variant="outline" 
                    size="lg"
                    className="hover:scale-110 transition-transform text-lg px-6 py-3"
                  >
                    Close
                  </Button>
                </div>
                <div className="p-8">
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
                <div className="text-center p-8 border-b border-gray-200">
                  <p className="text-3xl font-bold text-gray-900 mb-4">
                    Generating PDF for {pdfEmployee['EMPLOYEE NAME']}...
                  </p>
                  <p className="text-xl text-gray-600">Please wait while we capture the payslip with premium quality</p>
                  <div className="mt-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                </div>
                
                <div ref={payslipRef} className="p-8">
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