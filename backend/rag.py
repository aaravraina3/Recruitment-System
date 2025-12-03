import os
from typing import List, Dict
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_chroma import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

# Basic Knowledge Base to fallback on if no docs found
DEFAULT_KNOWLEDGE = """
Generate is Northeastern University's student-led product development studio.
We build real software and hardware products for actual clients.
Our branches include:
- Software: Builds web and mobile apps.
- Hardware: Mechanical and Electrical engineering projects.
- Data: Data science, ML, and analytics.
- Operations: Finance, Marketing, Community.

Application Tips:
- Be authentic.
- Show passion for building and learning.
- Technical experience is good but growth mindset is better.
- Applications close in mid-November.
"""

class ChatHandler:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.persist_directory = "chroma_db"
        
        if not self.api_key:
            print("ChatHandler: No Google API Key provided")
            return

        # Use Google Gemini Models
        self.embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=self.api_key)
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-pro",
            temperature=0.3,
            google_api_key=self.api_key
        )
        
        # Initialize Vector Store
        self.vector_store = Chroma(
            persist_directory=self.persist_directory,
            embedding_function=self.embeddings
        )
        
        # Check if empty, if so, load default
        # Note: Chroma count might throw if collection doesn't exist, try/except block added
        try:
            if self.vector_store._collection.count() == 0:
                print("Vector store empty, loading default knowledge...")
                self.ingest_text(DEFAULT_KNOWLEDGE, {"source": "default"})
        except Exception as e:
             print(f"Vector store init warning: {e}. Loading default...")
             self.ingest_text(DEFAULT_KNOWLEDGE, {"source": "default"})

    def ingest_text(self, text: str, metadata: Dict):
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50
        )
        docs = [Document(page_content=x, metadata=metadata) for x in text_splitter.split_text(text)]
        self.vector_store.add_documents(docs)

    async def get_response(self, query: str) -> Dict:
        if not self.vector_store:
            return {"response": "System error: Vector store not initialized", "sources": []}

        # Create specific prompt
        prompt_template = """Use the following pieces of context to answer the question at the end. 
        If you don't know the answer, just say that you don't know, don't try to make up an answer.
        Keep the answer helpful and encouraging.
        
        Context: {context}
        
        Question: {question}
        Answer:"""
        
        PROMPT = PromptTemplate(
            template=prompt_template, input_variables=["context", "question"]
        )
        
        qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vector_store.as_retriever(search_kwargs={"k": 3}),
            return_source_documents=True,
            chain_type_kwargs={"prompt": PROMPT}
        )
        
        try:
            result = qa_chain.invoke({"query": query})
            
            answer = result.get("result", "")
            source_docs = result.get("source_documents", [])
            
            sources = list(set([doc.metadata.get("source", "unknown") for doc in source_docs]))
            
            return {
                "response": answer,
                "sources": sources
            }
        except Exception as e:
            print(f"RAG Error: {e}")
            return {
                "response": "I'm having trouble processing that right now. (Gemini API Error or similar)",
                "sources": []
            }
