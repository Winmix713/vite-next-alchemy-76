
import { APIAnalysis } from '@/types/analyzer';

export class APIAnalyzer {
  constructor(private files: File[]) {}

  async analyze(): Promise<APIAnalysis> {
    let endpoints = 0;
    let dynamicEndpoints = 0;
    const methods = {
      GET: 0,
      POST: 0,
      PUT: 0,
      DELETE: 0,
      PATCH: 0
    };
    const issues: string[] = [];

    for (const file of this.files) {
      if (this.isAPIFile(file)) {
        endpoints++;
        
        try {
          const content = await this.readFileContent(file);
          
          // Check for dynamic routes
          if (file.name.includes('[') && file.name.includes(']')) {
            dynamicEndpoints++;
          }
          
          // Count HTTP methods
          Object.keys(methods).forEach(method => {
            const regex = new RegExp(`\\b${method.toLowerCase()}\\b`, 'i');
            if (regex.test(content)) {
              methods[method as keyof typeof methods]++;
            }
          });
          
        } catch (error) {
          issues.push(`Error analyzing API endpoint ${file.name}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }

    return {
      endpoints,
      dynamicEndpoints,
      methods,
      issues
    };
  }

  private isAPIFile(file: File): boolean {
    return (file.name.includes('/api/') || file.name.includes('\\api\\')) && 
           (file.name.endsWith('.ts') || file.name.endsWith('.js'));
  }

  private readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(new Error("File reading error"));
      reader.readAsText(file);
    });
  }
}
