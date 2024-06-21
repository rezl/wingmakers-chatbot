
import { toast } from 'react-toastify';
import { supabase } from './supabase-client';

export async function deleteDocument(documentName: string): Promise<void> {
  // Start a transaction
  const { data: deleteData, error: deleteError } = await supabase
    .from('document_info')
    .delete()
    .eq('name', documentName);

  if (deleteError) {
    console.error('Error deleting from document_info:', deleteError);
    throw deleteError;
  }

  // Get all rows from chatbot table
  const { data: chatbotData, error: chatbotError } = await supabase
    .from('chatbots')
    .select('id, documents');

  if (chatbotError) {
    console.error('Error fetching from chatbot table:', chatbotError);
    throw chatbotError;
  }

  // Iterate through each row and update the documents column if needed
  for (const row of chatbotData || []) {
    const documents = row.documents as string[];

    // Check if the document is in the array and remove it
    if (documents.includes(documentName)) {
      const updatedDocuments = documents.filter(doc => doc !== documentName);

      // Update the row with the new documents array
      const { error: updateError } = await supabase
        .from('chatbots')
        .update({ documents: updatedDocuments })
        .eq('id', row.id);

      if (updateError) {
        console.error('Error updating chatbot table:', updateError);
        throw updateError;
      }

    }
  }
}
