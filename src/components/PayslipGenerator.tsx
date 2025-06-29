import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, FileText, Users, Loader2, Eye, Palette, Sparkles, Zap, Moon, Sun } from "lucide-react";
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
type ThemeType = 'gradient' | 'neon' | 'glass' | 'dark' | 'minimal' | 'logo-bg';

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
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('gradient');
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

  // Theme configurations
  const themes = {
    gradient: {
      name: 'Gradient Magic',
      icon: Sparkles,
      bg: 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500',
      card: 'bg-white/20 backdrop-blur-lg border border-white/30',
      text: 'text-white',
      button: 'bg-white/20 hover:bg-white/30 text-white border-white/30'
    },
    neon: {
      name: 'Neon Cyber',
      icon: Zap,
      bg: 'bg-gray-900',
      card: 'bg-gray-800/90 border border-cyan-500/50 shadow-cyan-500/25',
      text: 'text-cyan-100',
      button: 'bg-cyan-600 hover:bg-cyan-700 text-white'
    },
    glass: {
      name: 'Glass Morphism',
      icon: Sparkles,
      bg: 'bg-gradient-to-br from-blue-400 to-teal-500',
      card: 'bg-white/10 backdrop-blur-xl border border-white/20',
      text: 'text-white',
      button: 'bg-white/20 hover:bg-white/30 text-white border-white/20'
    },
    dark: {
      name: 'Dark Elite',
      icon: Moon,
      bg: 'bg-gray-900',
      card: 'bg-gray-800 border border-gray-700',
      text: 'text-gray-100',
      button: 'bg-gray-700 hover:bg-gray-600 text-white'
    },
    minimal: {
      name: 'Clean Minimal',
      icon: Sun,
      bg: 'bg-gradient-to-br from-gray-50 to-blue-50',
      card: 'bg-white border border-gray-200',
      text: 'text-gray-900',
      button: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    'logo-bg': {
      name: 'Logo Background',
      icon: Palette,
      bg: 'bg-gradient-to-br from-green-50 to-blue-50',
      card: 'bg-white/90 backdrop-blur-sm border border-green-200/50',
      text: 'text-gray-900',
      button: 'bg-green-600 hover:bg-green-700 text-white'
    }
  };

  const currentTheme = themes[selectedTheme];

  return (
    <div className={`min-h-screen transition-all duration-500 ${currentTheme.bg} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {selectedTheme === 'logo-bg' && processedLogoUrl && (
          <>
            {/* Large background logo */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 w-96 h-96"
              style={{
                backgroundImage: `url(${processedLogoUrl})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                filter: 'blur(1px)'
              }}
            />
            {/* Smaller floating logos */}
            <div 
              className="absolute top-20 right-20 opacity-10 w-32 h-32 animate-pulse"
              style={{
                backgroundImage: `url(${processedLogoUrl})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
              }}
            />
            <div 
              className="absolute bottom-20 left-20 opacity-10 w-24 h-24 animate-pulse"
              style={{
                backgroundImage: `url(${processedLogoUrl})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
              }}
            />
          </>
        )}
        
        {/* Floating blobs for other themes */}
        {selectedTheme !== 'logo-bg' && (
          <>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-white/5 rounded-full blur-2xl animate-bounce"></div>
          </>
        )}
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with Theme Selector */}
          <div className="text-center mb-8">
            <h1 className={`text-5xl font-bold mb-4 ${currentTheme.text} drop-shadow-lg`}>
              Professional Payslip Generator
            </h1>
            <p className={`text-xl ${currentTheme.text} opacity-90 mb-6`}>
              Convert Excel employee data to stunning PDF payslips
            </p>
            
            {/* Theme Selector */}
            <div className={`inline-flex p-2 rounded-2xl ${currentTheme.card} shadow-2xl mb-6`}>
              {Object.entries(themes).map(([key, theme]) => {
                const Icon = theme.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedTheme(key as ThemeType)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      selectedTheme === key 
                        ? 'bg-white/30 scale-105 shadow-lg' 
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${currentTheme.text}`} />
                    <span className={`text-sm font-medium ${currentTheme.text}`}>
                      {theme.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload and Controls */}
            <Card className={`${currentTheme.card} shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-3 ${currentTheme.text} text-xl`}>
                  <Upload className="h-6 w-6" />
                  Upload Excel File
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="excel-upload" className={`${currentTheme.text} font-medium`}>
                    Select Excel file with employee salary data
                  </Label>
                  <Input
                    id="excel-upload"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className={`mt-2 ${currentTheme.card} ${currentTheme.text} border-white/20`}
                  />
                  <p className={`text-xs ${currentTheme.text} opacity-70 mt-1`}>
                    Excel file should have headers in the first row
                  </p>
                </div>

                {/* Template Selection */}
                <div>
                  <Label className={`${currentTheme.text} font-medium`}>Choose Payslip Template</Label>
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {[
                      { key: 'classic', name: 'Classic', emoji: '📋' },
                      { key: 'modern', name: 'Modern ⭐', emoji: '🚀' },
                      { key: 'professional', name: 'Professional', emoji: '💼' }
                    ].map(({ key, name, emoji }) => (
                      <Button
                        key={key}
                        variant={selectedTemplate === key ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedTemplate(key as TemplateType)}
                        className={`${
                          selectedTemplate === key 
                            ? currentTheme.button 
                            : `${currentTheme.card} ${currentTheme.text} border-white/20 hover:bg-white/10`
                        } transition-all duration-300 hover:scale-105`}
                      >
                        <span className="mr-2">{emoji}</span>
                        {name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Logo Processing Status */}
                {processedLogoUrl && (
                  <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 backdrop-blur-sm">
                    <div className="text-sm font-medium text-green-100 mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      ✅ Logo Processing Complete
                    </div>
                    <div className="text-xs text-green-200">
                      Ultra-high quality logo with advanced processing applied
                    </div>
                  </div>
                )}

                {employees.length > 0 && (
                  <div className="space-y-4">
                    <div className={`flex items-center gap-3 ${currentTheme.text}`}>
                      <Users className="h-5 w-5" />
                      <span className="font-medium">{employees.length} employees loaded successfully</span>
                    </div>

                    <div className="grid gap-3">
                      <Button
                        onClick={generateAllPDFs}
                        disabled={isGenerating}
                        className={`w-full ${currentTheme.button} transition-all duration-300 hover:scale-105 shadow-lg`}
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
                      
                      {selectedEmployee && (
                        <Button
                          onClick={() => setShowPreview(true)}
                          variant="outline"
                          className={`w-full ${currentTheme.card} ${currentTheme.text} border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105`}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview Template
                        </Button>
                      )}
                    </div>

                    <div className={`max-h-60 overflow-y-auto border border-white/20 rounded-xl ${currentTheme.card} backdrop-blur-sm`}>
                      <table className="w-full text-sm">
                        <thead className={`${currentTheme.card} sticky top-0`}>
                          <tr>
                            <th className={`p-3 text-left font-medium ${currentTheme.text}`}>Employee Name</th>
                            <th className={`p-3 text-left font-medium ${currentTheme.text}`}>ID</th>
                            <th className={`p-3 text-left font-medium ${currentTheme.text}`}>Net Pay</th>
                            <th className={`p-3 text-left font-medium ${currentTheme.text}`}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {employees.map((emp, index) => (
                            <tr key={index} className={`border-t border-white/10 hover:bg-white/5 transition-colors ${currentTheme.text}`}>
                              <td className="p-3 font-medium">{emp['EMPLOYEE NAME']}</td>
                              <td className="p-3 opacity-80">{emp['EMPLOYEE ID']}</td>
                              <td className="p-3 text-green-400 font-medium">{formatCurrency(emp['NET PAY'])}</td>
                              <td className="p-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => generatePDF(emp)}
                                  disabled={isGenerating}
                                  className="border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105"
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
            <Card className={`${currentTheme.card} shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105`}>
              <CardHeader>
                <CardTitle className={`${currentTheme.text} text-xl`}>Payslip Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedEmployee ? (
                  <div className="space-y-4">
                    <div className={`text-lg font-bold ${currentTheme.text}`}>
                      {selectedEmployee['EMPLOYEE NAME']}
                    </div>
                    <div className={`${currentTheme.text} opacity-80 space-y-2`}>
                      <div>Employee ID: {selectedEmployee['EMPLOYEE ID']}</div>
                      <div>Department: {selectedEmployee['DEPARTMENT']}</div>
                      <div>Period: {selectedEmployee['AS ON']}</div>
                      <div className="text-green-400 font-bold text-lg">
                        Net Pay: {formatCurrency(selectedEmployee['NET PAY'])}
                      </div>
                    </div>
                    <div className={`text-sm ${currentTheme.text} opacity-70 bg-white/10 p-3 rounded-lg`}>
                      Using {selectedTemplate} template with {currentTheme.name} theme
                    </div>
                  </div>
                ) : (
                  <div className={`text-center py-12 ${currentTheme.text} opacity-60`}>
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Upload Excel file to see employee data</p>
                    <p className="text-sm">Individual PDFs will be generated for each employee</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Template Preview Modal */}
          {showPreview && selectedEmployee && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-5xl max-h-[90vh] overflow-auto">
                <div className="flex justify-between items-center p-6 border-b">
                  <h3 className="text-xl font-bold text-gray-900">
                    Template Preview - {selectedTemplate}
                  </h3>
                  <Button 
                    onClick={() => setShowPreview(false)} 
                    variant="outline" 
                    size="sm"
                    className="hover:scale-105 transition-transform"
                  >
                    Close
                  </Button>
                </div>
                <div className="p-6">
                  <div className="transform scale-50 origin-top-left">
                    {renderTemplate(selectedEmployee)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PDF Generation Template - Hidden */}
          {showPdfTemplate && pdfEmployee && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-2xl max-w-5xl max-h-[90vh] overflow-auto">
                <div className="text-center p-6 border-b">
                  <p className="text-xl font-bold text-gray-900 mb-2">
                    Generating PDF for {pdfEmployee['EMPLOYEE NAME']}...
                  </p>
                  <p className="text-gray-600">Please wait while we capture the payslip</p>
                </div>
                
                <div ref={payslipRef} className="p-6">
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