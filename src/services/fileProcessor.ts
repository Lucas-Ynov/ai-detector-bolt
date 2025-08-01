import mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';
import { FileUpload } from '../types';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export class FileProcessor {
  static async extractText(fileUpload: FileUpload): Promise<string> {
    const { file, type } = fileUpload;
    
    try {
      switch (type) {
        case 'pdf':
          return await this.extractFromPDF(file);
        case 'docx':
          return await this.extractFromDocx(file);
        case 'txt':
          return await this.extractFromText(file);
        default:
          throw new Error('Type de fichier non supporté');
      }
    } catch (error) {
      throw new Error(`Erreur d'extraction: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  private static async extractFromPDF(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      text += pageText + '\n';
    }
    
    return text.trim();
  }

  private static async extractFromDocx(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  private static async extractFromText(file: File): Promise<string> {
    return await file.text();
  }

  static getFileType(file: File): 'pdf' | 'docx' | 'txt' | null {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return 'pdf';
      case 'docx':
      case 'doc':
        return 'docx';
      case 'txt':
        return 'txt';
      default:
        return null;
    }
  }
}