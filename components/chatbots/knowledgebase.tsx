"use client";

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from '@/lib/supabase-client';
import { Button } from '../ui/button';
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from 'react-toastify';
import { IoDocumentTextSharp } from "react-icons/io5";
import { usePathname } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';

interface Document {
  name: string;
}

export function Knowledgbase() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [saving , setSaving] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    const fetchDocuments = async () => {
      const { data, error } = await supabase
        .from('document_info')
        .select('name');

      if (error) {
        console.error(error);
      } else {
        setDocuments(data || []);
      }
    };

    const fetchSelectedDocuments = async () => {
      const botName = pathName.substring(pathName.lastIndexOf('/') + 1);
      const { data, error } = await supabase
        .from('chatbots')
        .select('documents')
        .eq('chatbot_name', botName)
        .single();

      if (error) {
        console.error(error);
      } else {
        setSelectedDocuments(data?.documents || []);
      }
    };

    fetchDocuments();
    fetchSelectedDocuments();
  }, [pathName]);

  const handleCheckboxChange = (documentName: string) => {
    setSelectedDocuments(prev =>
      prev.includes(documentName)
        ? prev.filter(name => name !== documentName)
        : [...prev, documentName]
    );
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    const botName = pathName.substring(pathName.lastIndexOf('/') + 1);

    const { error } = await supabase
      .from('chatbots')
      .update({ documents: selectedDocuments })
      .eq('chatbot_name', botName);

    if (error) {
      console.error(error);
      toast.error('Failed to save changes!');
    } else {
      toast.success('Changes saved!');
    }
    setSaving(false);
  };

  return (
    <div className='flex flex-col w-full space-y-2'>
      <div className='flex w-full'>
        <Button onClick={handleSaveChanges} size={'sm'}>{saving? <span className='flex items-center'>Saving changes<FaSpinner className='ml-2 animate-spin'/> </span>:'Save Changes'}</Button>
      </div>
      <div className="max-h-[430px] min-h-12 overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Select</TableHead>
            <TableHead>Document name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.name}>
              <TableCell>
                <Checkbox
                  checked={selectedDocuments.includes(document.name)}
                  onCheckedChange={() => handleCheckboxChange(document.name)}
                />
              </TableCell>
              <TableCell className="font-medium flex items-center">
                <IoDocumentTextSharp className='mr-2'/>
                {document.name}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
       <div className='text-sm text-muted-foreground w-full text-center mt-5'>Select documents to use as knowledgebase of your chatbot.</div>
    </div>
  );
}
