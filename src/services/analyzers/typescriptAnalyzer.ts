
import { TypeScriptAnalysis } from '@/types/analyzer';

export class TypeScriptAnalyzer {
  constructor(private files: File[]) {}

  async analyze(): Promise<TypeScriptAnalysis> {
    let totalTypes = 0;
    let nextJsTypes = 0;
    let customTypes = 0;
    const issues: string[] = [];

    for (const file of this.files) {
      if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
        try {
          const content = await this.readFileContent(file);
          
          // Count Next.js specific types
          const nextTypeMatches = content.match(/Next(?:Page|Api\w+|Config|Router|App\w+)/g);
          if (nextTypeMatches) {
            nextJsTypes += nextTypeMatches.length;
          }
          
          // Count custom types and interfaces
          const typeMatches = content.match(/(?:type|interface)\s+\w+/g);
          if (typeMatches) {
            customTypes += typeMatches.length;
          }
          
          totalTypes = nextJsTypes + customTypes;
        } catch (error) {
          issues.push(`Error analyzing ${file.name}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }

    return {
      totalTypes,
      nextJsTypes,
      customTypes,
      issues
    };
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
