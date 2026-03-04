import React, { useEffect, useState } from 'react';
import { FileText, ChevronRight, Search } from 'lucide-react';
import Markdown from 'react-markdown';

export default function DocsCard() {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/docs')
      .then(res => res.json())
      .then(setFiles);
  }, []);

  const handleFileClick = async (file: string) => {
    const res = await fetch(`/api/docs/${file}`);
    const data = await res.json();
    setContent(data.content);
    setSelectedFile(file);
  };

  const filteredFiles = files.filter(file => 
    file.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white/50 backdrop-blur-sm border border-black/5 rounded-2xl p-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-indigo-600" />
        <h2 className="font-semibold text-gray-900">Documentation</h2>
      </div>

      {!selectedFile && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-black/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      )}

      {selectedFile ? (
        <div className="flex-1 overflow-y-auto pr-2">
          <button 
            onClick={() => setSelectedFile(null)}
            className="text-xs text-indigo-600 hover:underline mb-4 flex items-center gap-1"
          >
            ← Back to list
          </button>
          <div className="prose prose-sm max-w-none">
            <Markdown>{content}</Markdown>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredFiles.map(file => (
            <button
              key={file}
              onClick={() => handleFileClick(file)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-black/5 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group text-left"
            >
              <span className="text-sm text-gray-700 truncate">{file}</span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            </button>
          ))}
          {filteredFiles.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">
              {files.length === 0 ? "No documents found." : "No matching documents."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
