
import { MiddlewareAnalysis } from '@/types/analyzer';

export class MiddlewareAnalyzer {
  constructor(private files: File[]) {}

  async analyze(): Promise<MiddlewareAnalysis> {
    let count = 0;
    let complexMiddlewares = 0;
    let edgeMiddlewares = 0;
    const issues: string[] = [];

    for (const file of this.files) {
      if (this.isMiddlewareFile(file)) {
        count++;
        
        try {
          const content = await this.readFileContent(file);
          
          // Check for Edge runtime
          if (content.includes('runtime: "edge"') || content.includes("runtime: 'edge'")) {
            edgeMiddlewares++;
          }
          
          // Check for complex middleware (has matchers or complex config)
          if (content.includes('matcher') || 
              content.includes('config') ||
              content.includes('withAuth') ||
              content.includes('middleware.config')) {
            complexMiddlewares++;
          }
          
        } catch (error) {
          issues.push(`Error analyzing middleware ${file.name}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }

    return {
      count,
      complexMiddlewares,
      edgeMiddlewares,
      issues
    };
  }

  private isMiddlewareFile(file: File): boolean {
    return file.name.includes('middleware') && 
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
