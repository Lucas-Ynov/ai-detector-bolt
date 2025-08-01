import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { FileUpload } from '../types';
import { FileProcessor } from '../services/fileProcessor';

interface FileUploaderProps {
  onFileProcessed: (text: string, filename: string) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileProcessed,
  onError,
  isProcessing,
}) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const fileType = FileProcessor.getFileType(file);
    if (!fileType) {
      onError('Type de fichier non supporté. Utilisez PDF, Word ou TXT.');
      return;
    }

    try {
      const fileUpload: FileUpload = { file, type: fileType };
      const extractedText = await FileProcessor.extractText(fileUpload);
      
      if (extractedText.trim().length < 50) {
        onError('Le fichier doit contenir au moins 50 caractères de texte.');
        return;
      }

      onFileProcessed(extractedText, file.name);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Erreur lors du traitement du fichier');
    }
  }, [onFileProcessed, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
    },
    multiple: false,
    disabled: isProcessing,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }
        ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center space-y-4">
        {isProcessing ? (
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
        ) : (
          <Upload className="w-12 h-12 text-gray-400" />
        )}
        
        <div>
          <p className="text-lg font-medium text-gray-700 mb-2">
            {isProcessing 
              ? 'Traitement du fichier...' 
              : isDragActive 
                ? 'Déposez le fichier ici' 
                : 'Glissez-déposez un fichier ou cliquez pour sélectionner'
            }
          </p>
          <p className="text-sm text-gray-500">
            Formats acceptés: PDF, Word (.docx, .doc), TXT
          </p>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <FileText className="w-4 h-4" />
            <span>Jusqu'à 10 MB</span>
          </div>
          <div className="flex items-center space-x-1">
            <AlertCircle className="w-4 h-4" />
            <span>Texte français recommandé</span>
          </div>
        </div>
      </div>
    </div>
  );
};