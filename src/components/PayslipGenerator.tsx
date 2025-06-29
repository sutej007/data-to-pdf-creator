import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, FileText, Users, Loader2, Eye, FileSpreadsheet, Settings, Info, Play, Folder, FileCheck2, Sparkles, Copyright } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-teal-50/30 to-green-50/40" style={{ fontFamily: '"Inter", system-ui, -apple-system, sans-serif' }}>
      {/* Enhanced Header with Light Blue-Green Mix */}
      <div className="bg-gradient-to-r from-blue-50/60 via-teal-50/50 to-green-50/60 border-b border-teal-100 shadow-sm backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {processedLogoUrl && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-green-200 rounded-full blur-md opacity-30"></div>
                  <img 
                    src={processedLogoUrl}
                    alt="Company Logo"
                    className="relative w-14 h-14 object-contain rounded-full border-2 border-teal-100 shadow-lg"
                  />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
                  Payslip Generator
                </h1>
                <p className="text-slate-600">Convert Excel data to professional PDF payslips</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Upload & Controls */}
          <div className="space-y-6">
            {/* File Upload Card with Light Blue-Green Mix */}
            <Card className="border border-teal-200 shadow-lg bg-gradient-to-br from-blue-50/30 via-teal-50/25 to-green-50/30 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-xl text-slate-800">
                  <div className="p-3 bg-gradient-to-br from-blue-500 via-teal-500 to-green-500 rounded-xl shadow-lg">
                    <FileSpreadsheet className="w-6 h-6 text-white" />
                  </div>
                  <span>1. Upload Excel File</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-teal-300 rounded-xl p-6 hover:border-teal-400 hover:bg-gradient-to-br hover:from-blue-50/40 hover:via-teal-50/35 hover:to-green-50/40 transition-all duration-300 group bg-gradient-to-br from-blue-50/20 via-teal-50/15 to-green-50/20">
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
                      className="mt-4 file:bg-gradient-to-r file:from-blue-500 file:via-teal-500 file:to-green-500 file:text-white file:border-0 file:rounded-lg file:px-4 file:py-2 file:mr-4 file:shadow-md hover:file:shadow-lg file:transition-all bg-gradient-to-br from-blue-50/25 via-teal-50/20 to-green-50/25"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600 bg-gradient-to-r from-blue-50/25 via-teal-50/20 to-green-50/25 p-3 rounded-lg">
                  <Info className="w-4 h-4 text-teal-500" />
                  <span>Excel file should have column headers in the first row</span>
                </div>
              </CardContent>
            </Card>

            {/* Template Selection Card with Light Blue-Green Mix */}
            <Card className="border border-purple-200 shadow-lg bg-gradient-to-br from-blue-50/30 via-teal-50/25 to-green-50/30 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-xl text-slate-800">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <span>2. Choose Template</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'classic', name: 'Classic', desc: 'Traditional', gradient: 'from-amber-400 to-orange-500', bg: 'bg-gradient-to-br from-blue-50/25 via-teal-50/20 to-green-50/25', border: 'border-amber-200' },
                    { key: 'modern', name: 'Modern', desc: 'Recommended', gradient: 'from-blue-400 via-teal-400 to-green-400', bg: 'bg-gradient-to-br from-blue-50/25 via-teal-50/20 to-green-50/25', border: 'border-teal-200' },
                    { key: 'professional', name: 'Professional', desc: 'Corporate', gradient: 'from-slate-400 to-gray-500', bg: 'bg-gradient-to-br from-blue-50/25 via-teal-50/20 to-green-50/25', border: 'border-slate-200' }
                  ].map(({ key, name, desc, gradient, bg, border }) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTemplate(key as TemplateType)}
                      className={`p-4 rounded-xl border-2 text-center transition-all duration-300 transform hover:scale-105 ${
                        selectedTemplate === key 
                          ? `border-teal-400 bg-gradient-to-br from-blue-50/40 via-teal-50/35 to-green-50/40 shadow-lg scale-105` 
                          : `${border} ${bg} hover:shadow-md`
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg mx-auto mb-2 bg-gradient-to-r ${gradient} shadow-sm`}></div>
                      <div className="font-semibold text-slate-800">{name}</div>
                      <div className="text-xs text-slate-600 mt-1">{desc}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Employee Data Card with Light Blue-Green Mix */}
            {employees.length > 0 && (
              <Card className="border border-emerald-200 shadow-lg bg-gradient-to-br from-blue-50/30 via-teal-50/25 to-green-50/30 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3 text-xl text-slate-800">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span>3. Generate PDFs</span>
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
                        className="border-teal-300 hover:bg-gradient-to-br hover:from-blue-50/40 hover:via-teal-50/35 hover:to-green-50/40 transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-blue-50/25 via-teal-50/20 to-green-50/25"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    )}
                  </div>

                  {/* Employee List with Light Blue-Green Mix */}
                  <div className="max-h-64 overflow-y-auto border border-teal-200 rounded-xl shadow-inner bg-gradient-to-br from-blue-50/25 via-teal-50/20 to-green-50/25 backdrop-blur-sm">
                    <table className="w-full text-sm">
                      <thead className="bg-gradient-to-r from-blue-50/40 via-teal-50/35 to-green-50/40 sticky top-0 backdrop-blur-sm">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-700">ID</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-700">Net Pay</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-700">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((emp, index) => (
                          <tr key={index} className="border-t border-teal-100 hover:bg-gradient-to-r hover:from-blue-50/35 hover:via-teal-50/30 hover:to-green-50/35 transition-all duration-200">
                            <td className="px-4 py-3 font-medium text-slate-900">{emp['EMPLOYEE NAME']}</td>
                            <td className="px-4 py-3 text-slate-600">{emp['EMPLOYEE ID']}</td>
                            <td className="px-4 py-3 text-emerald-600 font-semibold">{formatCurrency(emp['NET PAY'])}</td>
                            <td className="px-4 py-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => generatePDF(emp)}
                                disabled={isGenerating}
                                className="text-xs border-teal-200 hover:bg-gradient-to-r hover:from-blue-50/35 hover:via-teal-50/30 hover:to-green-50/35 hover:border-teal-300 transition-all duration-200 bg-gradient-to-br from-blue-50/20 via-teal-50/15 to-green-50/20"
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

          {/* Right Panel - Preview with Light Blue-Green Mix */}
          <div className="space-y-6">
            <Card className="border border-indigo-200 shadow-lg bg-gradient-to-br from-blue-50/30 via-teal-50/25 to-green-50/30 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
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
                    <div className="bg-gradient-to-br from-blue-50/40 via-teal-50/35 to-green-50/40 rounded-xl p-5 border border-teal-200 shadow-sm">
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
                          <div className="font-semibold text-slate-800">{selectedEmployee['DEPARTMENT']}</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-500 text-xs uppercase tracking-wide">Period</span>
                          <div className="font-semibold text-slate-800">{selectedEmployee['AS ON']}</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-500 text-xs uppercase tracking-wide">Template</span>
                          <div className="font-semibold text-slate-800 capitalize">{selectedTemplate}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-50/95 to-green-50/90 border border-emerald-200 rounded-xl p-5 text-center shadow-sm">
                      <div className="flex items-center justify-center mb-2">
                        <Sparkles className="w-4 h-4 text-emerald-600 mr-2" />
                        <div className="text-emerald-700 font-semibold text-sm">Net Salary</div>
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        {formatCurrency(selectedEmployee['NET PAY'])}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="relative mb-4">
                      <Folder className="w-16 h-16 text-slate-300 mx-auto" />
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

      {/* Template Preview Modal with Light Blue-Green Mix */}
      {showPreview && selectedEmployee && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-blue-50/95 via-teal-50/90 to-green-50/95 rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-auto border border-teal-200">
            <div className="flex justify-between items-center p-6 border-b border-teal-200 bg-gradient-to-r from-blue-50/80 via-teal-50/75 to-green-50/80">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center">
                <Eye className="w-6 h-6 mr-3 text-teal-600" />
                Template Preview - {selectedTemplate}
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

      {/* PDF Generation Modal with Light Blue-Green Mix */}
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
              <p className="text-slate-600">Please wait while we process your payslip with high quality...</p>
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