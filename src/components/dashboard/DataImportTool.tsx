
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Upload, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface DataImportToolProps {
  className?: string;
  onImportComplete?: () => void;
}

const DataImportTool: React.FC<DataImportToolProps> = ({ className, onImportComplete }) => {
  const [csvData, setCsvData] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importStats, setImportStats] = useState<{
    success: number;
    failed: number;
    total: number;
  } | null>(null);

  const handleImport = async () => {
    if (!csvData.trim()) {
      toast.error('Please paste CSV data first');
      return;
    }

    setIsImporting(true);
    setImportStats(null);
    
    try {
      // Parse CSV data
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const rows = lines.slice(1).filter(line => line.trim());
      
      let successCount = 0;
      let failCount = 0;
      
      // Process each row
      for (const row of rows) {
        const values = row.split(',').map(v => v.trim());
        const rowData: Record<string, any> = {};
        
        // Map CSV columns to data structure
        headers.forEach((header, index) => {
          if (index < values.length) {
            // Handle numeric values
            if (!isNaN(Number(values[index]))) {
              rowData[header] = Number(values[index]);
            } else {
              rowData[header] = values[index];
            }
          }
        });
        
        // Create record based on detected column structure
        try {
          let result;
          
          // Determine what kind of data this is
          if ('measurement_time' in rowData || 'tag_id' in rowData || 'value' in rowData) {
            // This looks like energy metrics data
            result = await supabase.from('energy_metrics').insert({
              measurement_time: rowData.measurement_time || new Date().toISOString(),
              machine_id: rowData.machine_id || 'machine-1',
              tag_id: rowData.tag_id || 'UNKNOWN',
              value: rowData.value || 0,
              unit: rowData.unit || 'kWh'
            });
          } else if ('title' in rowData && 'severity' in rowData) {
            // This looks like incident data
            result = await supabase.from('energy_incidents').insert({
              title: rowData.title || 'Untitled Incident',
              description: rowData.description || 'No description provided',
              severity: rowData.severity || 'medium',
              machine_id: rowData.machine_id || 'machine-1',
              status: rowData.status || 'new'
            });
          } else if ('parameter_name' in rowData || 'current_value' in rowData || 'optimal_value' in rowData) {
            // This looks like optimization data
            result = await supabase.from('machine_optimizations').insert({
              machine_id: rowData.machine_id || 'machine-1',
              parameter_name: rowData.parameter_name || 'unknown',
              current_value: rowData.current_value || 0,
              optimal_value: rowData.optimal_value || 0,
              unit: rowData.unit || '',
              potential_savings: rowData.potential_savings || null
            });
          } else {
            // Unknown data format
            throw new Error('Unrecognized data format');
          }
          
          if (result.error) {
            throw result.error;
          }
          
          successCount++;
        } catch (error) {
          console.error('Error importing row:', error);
          failCount++;
        }
      }
      
      // Update stats
      setImportStats({
        success: successCount,
        failed: failCount,
        total: rows.length
      });
      
      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} records`);
        if (onImportComplete) {
          onImportComplete();
        }
      }
      
      if (failCount > 0) {
        toast.warning(`Failed to import ${failCount} records`);
      }
      
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import data');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload size={18} />
          Data Import Tool
        </CardTitle>
        <CardDescription>
          Import CSV data directly to the Supabase database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Paste CSV data below:</p>
            <Textarea 
              placeholder="measurement_time,machine_id,tag_id,value,unit" 
              value={csvData} 
              onChange={(e) => setCsvData(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <Button 
              onClick={handleImport} 
              disabled={isImporting || !csvData.trim()}
              className="flex items-center gap-2"
            >
              {isImporting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground"></div>
                  Importing...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Import Data
                </>
              )}
            </Button>
            
            {importStats && (
              <div className="text-sm flex items-center gap-2">
                {importStats.failed === 0 ? (
                  <CheckCircle2 size={16} className="text-green-500" />
                ) : (
                  <AlertCircle size={16} className="text-yellow-500" />
                )}
                <span>
                  {importStats.success}/{importStats.total} records imported
                </span>
              </div>
            )}
          </div>
          
          {importStats && importStats.failed > 0 && (
            <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
              <XCircle size={16} />
              <span>{importStats.failed} records failed to import. Check console for details.</span>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground">
            <p>Example CSV format:</p>
            <pre className="bg-muted p-2 rounded mt-1 overflow-auto">
              measurement_time,machine_id,tag_id,value,unit<br />
              2023-05-15T12:00:00Z,machine-1,ENERGY_KWH,125.7,kWh<br />
              2023-05-15T12:05:00Z,machine-1,VOLTAGE,412.3,V
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataImportTool;
