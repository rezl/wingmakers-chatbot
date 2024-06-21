import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from "@langchain/openai";
import { CustomPDFLoader } from '@/lib/custom-document-loader';
import { PineconeStore } from "@langchain/pinecone";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { NextRequest, NextResponse } from "next/server";
import { pinecone } from '@/lib/pinecone-client';
import fs from 'fs';

const filePath = 'data';


export async function POST(request: NextRequest) {
    try {

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
    }

      /*load raw docs from the all files in the directory */
      const directoryLoader = new DirectoryLoader(filePath, {
        '.pdf': (path) => new CustomPDFLoader(path),
      });
  
      // const loader = new PDFLoader(filePath);
      const rawDocs = await directoryLoader.load();
  
      /* Split text into chunks */
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
  
      const docs = await textSplitter.splitDocuments(rawDocs);
      console.log('split docs', docs);
  
      console.log('creating vector store...');
      /*create and store the embeddings in the vectorStore*/
      const embeddings = new OpenAIEmbeddings(
      );

      const index = pinecone.Index(process.env.PINECONE_INDEX_NAME ? process.env.PINECONE_INDEX_NAME :''); 
  
      //embed the PDF documents
      const response = await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex: index,
        textKey: 'text',
      });
      console.log(response)
      return NextResponse.json({ message: 'File ingested successfully' });
    } catch (error) {
      console.log('error', error);
      return NextResponse.json({ error: 'Error ingesting file' }, { status: 500 });
    }
}
