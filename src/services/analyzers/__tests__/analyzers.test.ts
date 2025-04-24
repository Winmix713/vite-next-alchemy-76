
import { TypeScriptAnalyzer } from '../typescriptAnalyzer';
import { APIAnalyzer } from '../apiAnalyzer';
import { MiddlewareAnalyzer } from '../middlewareAnalyzer';
import { RouteAnalyzer } from '../routeAnalyzer';

describe('Analyzers', () => {
  describe('TypeScriptAnalyzer', () => {
    it('should detect Next.js types', async () => {
      const files = [
        new File(['type NextPage = {}'], 'page.ts', { type: 'text/typescript' })
      ];
      
      const analyzer = new TypeScriptAnalyzer(files);
      const result = await analyzer.analyze();
      
      expect(result.nextJsTypes).toBeGreaterThan(0);
    });
  });
  
  describe('APIAnalyzer', () => {
    it('should detect API endpoints', async () => {
      const files = [
        new File(['export default function handler() {}'], 'pages/api/test.ts', 
          { type: 'text/typescript' })
      ];
      
      const analyzer = new APIAnalyzer(files);
      const result = await analyzer.analyze();
      
      expect(result.endpoints).toBe(1);
    });
  });
  
  describe('MiddlewareAnalyzer', () => {
    it('should detect middleware files', async () => {
      const files = [
        new File(['export default function middleware() {}'], 'middleware.ts', 
          { type: 'text/typescript' })
      ];
      
      const analyzer = new MiddlewareAnalyzer(files);
      const result = await analyzer.analyze();
      
      expect(result.count).toBe(1);
    });
  });
  
  describe('RouteAnalyzer', () => {
    it('should detect dynamic routes', () => {
      const routes = [
        { path: '/posts/[id]', type: 'dynamic', parameters: ['id'], complexity: 'simple', components: [] }
      ];
      
      const analyzer = new RouteAnalyzer(routes);
      const result = analyzer.analyze();
      
      expect(result.dynamicRoutes).toBe(1);
    });
  });
});
