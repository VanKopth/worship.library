'use client';

import React, { useState, useRef } from 'react';
import { uploadAudio } from '@/services/songs';

interface AudioUploaderProps {
  songId: number;
  currentAudioUrl?: string | null;
  onUploadSuccess?: (url: string) => void;
}

export default function AudioUploader({ songId, currentAudioUrl, onUploadSuccess }: AudioUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Невірний тип файлу. Дозволені лише аудіо файли (MP3, WAV, OGG)');
        return;
      }

      // Validate file size (max 50MB)
      const maxSize = 50 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setError('Файл занадто великий. Максимальний розмір 50 МБ');
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    if (!songId) {
      setError('ID пісні не знайдено');
      return;
    }

    console.log('Uploading audio for song ID:', songId);
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await uploadAudio(songId, file);
      
      clearInterval(progressInterval);
      setProgress(100);

      if (onUploadSuccess) {
        onUploadSuccess(result.url);
      }

      // Reset after success
      setTimeout(() => {
        setFile(null);
        setProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1000);
    } catch (err) {
      setError('Помилка завантаження файлу. Спробуйте ще раз.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Завантажити аудіо
        </label>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {file && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium truncate">{file.name}</span>
            <button
              onClick={handleRemove}
              disabled={uploading}
              className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
            >
              Видалити
            </button>
          </div>
          <div className="text-xs text-gray-500">
            {(file.size / 1024 / 1024).toFixed(2)} МБ
          </div>
        </div>
      )}

      {uploading && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{progress}% завантажено</p>
        </div>
      )}

      {currentAudioUrl && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-sm text-green-700 mb-2">Поточне аудіо:</p>
          <audio controls className="w-full">
            <source src={currentAudioUrl} />
            Ваш браузер не підтримує аудіо елемент.
          </audio>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {uploading ? 'Завантаження...' : 'Завантажити'}
      </button>
    </div>
  );
}
