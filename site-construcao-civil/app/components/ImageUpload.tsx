'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface ImageUploadProps {
  onUploadComplete: (urls: string[]) => void;
  initialImages?: string[];
  resetKey?: number;
}

export default function ImageUpload({ onUploadComplete, initialImages = [], resetKey = 0 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>(initialImages);

  useEffect(() => {
    setPreviews([]);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }, [resetKey]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError(null);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Selecione pelo menos uma imagem para fazer upload.');
      }

      const files = Array.from(event.target.files);
      const uploadedUrls: string[] = [];

      const newPreviews = files.map(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
        });
      });

      const previewResults = await Promise.all(newPreviews);
      setPreviews([...previews, ...previewResults]);

      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          throw new Error('Um dos arquivos selecionados não é uma imagem.');
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error('As imagens devem ter no máximo 5MB cada.');
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        console.log('Iniciando upload para:', filePath);

        const { error: uploadError, data } = await supabase.storage
          .from('projetos')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Erro detalhado do upload:', uploadError);
          throw new Error(`Erro no upload: ${uploadError.message}`);
        }

        console.log('Upload concluído:', data);

        const { data: { publicUrl } } = supabase.storage
          .from('projetos')
          .getPublicUrl(filePath);

        console.log('URL pública gerada:', publicUrl);
        uploadedUrls.push(publicUrl);
      }

      onUploadComplete(uploadedUrls);
    } catch (error) {
      console.error('Erro completo:', error);
      setError(error instanceof Error ? error.message : 'Erro ao fazer upload das imagens. Tente novamente.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
    onUploadComplete(newPreviews);
  };

  return (
    <div className="w-full space-y-4">
      <label className="block w-full">
        <span className="sr-only">Escolha as imagens</span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-yellow-50 file:text-yellow-700
            hover:file:bg-yellow-100"
        />
      </label>

      {previews.length > 0 && (
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative aspect-square group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg shadow-sm"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="mt-2 text-sm text-gray-500 flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Fazendo upload...
        </div>
      )}

      {error && (
        <div className="mt-2 text-sm text-red-500 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
} 