// app/components/FileUploadButton.tsx

'use client';

import React, { useRef } from 'react';
import { Button } from '../ui/button';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdOutlineAddCircle } from "react-icons/md";
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { supabase } from '@/lib/supabase-client';

const FileUploadButton: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {

        const { error } = await supabase
                  .from('document_info')
                  .insert([
                    { name: file.name, size: file.size , status: "processing" }
                  ]);
    
                if (error) {
                  throw new Error(error.message);
                }

      const resPromise = fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const promiseOptions = {
        pending: 'Uploading files...',
        success: 'Files uploaded successfully', 
        error: 'Files uploading failed!'
      };
  
      // Use toast.promise to handle the toast messages based on the response
      await toast.promise(
        resPromise.then(async (res) => {
          if (!res.ok) {
            throw new Error(await res.text());
          }
          return res.json();
        }), // The promise to track
        promiseOptions
      );
    } catch (e: any) {
        // Handle errors here
        console.error(e);
        toast.error('File uploading failed!');
      }
    
    
    await handleIngest(file);
    await handleDelete();
  };

  const handleIngest = async (file: File) => {
    try {
        const resPromise = fetch('/api/ingest', {
          method: 'POST',
        });
  
        const promiseOptions = {
          pending: 'ingesting files...',
          success: 'Files ingested successfully', 
          error: 'Files ingesting failed!'
        };
    
        // Use toast.promise to handle the toast messages based on the response
        await toast.promise(
          resPromise.then(async (res) => {
            if (!res.ok) {
              throw new Error(await res.text());
            }
            if (res.ok) {
                const { error } = await supabase
                  .from('document_info')
                  .update({ status: 'success' })
                    .eq('name', file.name);
    
                if (error) {
                  throw new Error(error.message);
                }
              }
            return res.json();
          }), // The promise to track
          promiseOptions
        );
      } catch (e: any) {
          // Handle errors here
          console.error(e);
          toast.error('File ingesting failed!');
        }
  }

  const handleDelete = async () => {
    try {
        const resPromise = fetch('/api/delete-local-files', {
          method: 'POST',
        });
  
        const promiseOptions = {
          pending: 'Clearing local directory...',
          success: 'All good!', 
          error: 'Error clearing local directory'
        };
    
        // Use toast.promise to handle the toast messages based on the response
        await toast.promise(
          resPromise.then(async (res) => {
            if (!res.ok) {
              throw new Error(await res.text());
            }
            return res.json();
          }), // The promise to track
          promiseOptions
        );
      } catch (e: any) {
          // Handle errors here
          console.error(e);
          toast.error('Clearing local files failed!');
        }
  }

  return (
    <div>
      <Button onClick={handleButtonClick}>Add New <MdOutlineAddCircle className='ml-2 w-5 h-5'/></Button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        className='w-0 h-0'
      />
    </div>
  );
};

export default FileUploadButton;
