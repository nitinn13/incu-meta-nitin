import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, AlertCircle, Clock, Users, List, CheckSquare } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  content: string;
  timestamp: string;
}

interface MOMFormat {
  version: string;
  timestamp: string;
  messageCount: number;
  messages: Message[];
  summary?: {
    participants?: string[];
    keyPoints?: string[];
    actionItems?: string[];
    duration?: string;
    aiSummary?: string;
  };
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [summary, setSummary] = useState<MOMFormat['summary']>();
  const [isGeneratingAISummary, setIsGeneratingAISummary] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateAISummary = async (msgs: Message[]) => {
    try {
      setIsGeneratingAISummary(true);
      setAiError(null);

      if (!msgs.length) {
        setAiError('No messages to summarize.');
        return null;
      }

      const chatText = msgs.map(m => m.content).join('\n');
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const prompt = `Summarize this conversation into key points, action items, participants, and duration: also tell the solution of the problem \n\n${chatText}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (err: any) {
      setAiError('Error generating summary using Gemini.');
      return null;
    } finally {
      setIsGeneratingAISummary(false);
    }
  };

  const generateBasicSummary = (msgs: Message[]) => {
    const participants = new Set<string>();
    msgs.forEach(msg => {
      const match = msg.content.match(/^([A-Z][a-z]+):/);
      if (match) participants.add(match[1]);
    });

    const keyPoints = msgs
      .map(msg => msg.content)
      .filter(c => c.includes('!') || c.includes('?') || c.includes(':'))
      .slice(0, 5);

    const actionItems = msgs
      .map(m => m.content)
      .filter(c =>
        ['need to', 'should', 'will', 'todo'].some(keyword =>
          c.toLowerCase().includes(keyword)
        )
      )
      .slice(0, 5);

    const timestamps = msgs.map(m => new Date(m.timestamp).getTime());
    const duration =
      timestamps.length > 1
        ? Math.round((Math.max(...timestamps) - Math.min(...timestamps)) / 60000)
        : 0;

    return {
      participants: Array.from(participants),
      keyPoints,
      actionItems,
      duration: `${duration} minutes`,
    };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setAiError(null);

    const reader = new FileReader();

    reader.onload = async e => {
      const text = e.target?.result as string;

      try {
        const jsonData = JSON.parse(text) as MOMFormat;
        setMessages(jsonData.messages);
        const basic = generateBasicSummary(jsonData.messages);
        const ai = await generateAISummary(jsonData.messages);
        setSummary({ ...basic, aiSummary: ai ?? undefined });
      } catch {
        const lines = text.split('\n').filter(Boolean);
        const newMsgs = lines.map(line => ({
          content: line,
          timestamp: new Date().toISOString(),
        }));
        setMessages(newMsgs);
        const basic = generateBasicSummary(newMsgs);
        const ai = await generateAISummary(newMsgs);
        setSummary({ ...basic, aiSummary: ai ?? undefined });
      }
    };

    reader.readAsText(file);
  };

  const handleDownloadJSON = () => {
    const output: MOMFormat = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      messageCount: messages.length,
      messages,
      summary,
    };

    const blob = new Blob([JSON.stringify(output, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName?.split('.')[0] ?? 'meeting'}_MOM.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadText = () => {
    let text = '=== Meeting Summary ===\n\n';

    if (summary?.aiSummary) {
      text += `AI Summary:\n${summary.aiSummary}\n\n`;
    }

    if (summary?.participants?.length) {
      text += 'Participants:\n' + summary.participants.map(p => `- ${p}`).join('\n') + '\n\n';
    }

    if (summary?.keyPoints?.length) {
      text += 'Key Points:\n' + summary.keyPoints.map(p => `- ${p}`).join('\n') + '\n\n';
    }

    if (summary?.actionItems?.length) {
      text += 'Action Items:\n' + summary.actionItems.map(a => `- ${a}`).join('\n') + '\n\n';
    }

    text += `Duration: ${summary?.duration ?? 'N/A'}\n\n=== Full Messages ===\n\n`;

    text += messages
      .map(msg => `${msg.content}\n[${new Date(msg.timestamp).toLocaleString()}]`)
      .join('\n\n');

    const blob = new Blob([text], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName?.split('.')[0] ?? 'meeting'}_MOM.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
            <FileText className="text-blue-600 w-8 h-8" />
            MOM Generator
          </h1>
          <div className="text-sm text-white font-medium bg-blue-600 px-3 py-1 rounded-full">
            Powered by Gemini AI
          </div>
        </div>

        {aiError && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{aiError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border-2 border-dashed border-blue-300 p-8 rounded-lg text-center bg-white flex flex-col items-center justify-center">
            <input
              type="file"
              accept=".txt,.json"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <Upload className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Upload Meeting File</h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-md"
            >
              Select File
            </button>
            <p className="text-sm mt-3 text-gray-600">Supports .txt and .json files</p>
            {fileName && (
              <div className="mt-3 bg-blue-50 px-3 py-1 rounded-full text-sm font-medium text-blue-700">
                Selected: {fileName}
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              File Statistics
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <List className="w-4 h-4 mr-2 text-blue-600" />
                <span className="font-medium">Total Messages:</span>
                <span className="ml-2">{messages.length || "No file uploaded"}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Clock className="w-4 h-4 mr-2 text-blue-600" />
                <span className="font-medium">Last Update:</span>
                <span className="ml-2">
                  {messages.length > 0
                    ? new Date(messages[messages.length - 1].timestamp).toLocaleString()
                    : 'N/A'}
                </span>
              </div>
              
              {summary?.duration && (
                <div className="flex items-center text-gray-700">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium">Duration:</span>
                  <span className="ml-2">{summary.duration}</span>
                </div>
              )}
              
              {summary?.participants && (
                <div className="flex items-center text-gray-700">
                  <Users className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium">Participants:</span>
                  <span className="ml-2">{summary.participants.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {isGeneratingAISummary ? (
          <div className="bg-white border border-blue-100 rounded-lg p-6 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-blue-200 h-12 w-12 mb-4"></div>
              <div className="h-4 bg-blue-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-blue-200 rounded w-1/3"></div>
            </div>
            <p className="text-blue-600 font-medium mt-4">Generating AI Summary...</p>
          </div>
        ) : (
          summary && (
            <div className="mt-6 bg-white border border-gray-200 p-6 rounded-lg shadow-md space-y-5">
              <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Meeting Summary</h2>
              
              {summary.aiSummary && (
                <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                  <h3 className="font-semibold text-gray-800 flex items-center mb-2">
                    <span className="bg-blue-100 p-1 rounded-full mr-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </span>
                    AI Summary
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">{summary.aiSummary}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {summary.participants && summary.participants.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <h3 className="font-semibold text-gray-800 flex items-center mb-3">
                      <span className="bg-blue-100 p-1 rounded-full mr-2">
                        <Users className="w-4 h-4 text-blue-600" />
                      </span>
                      Participants
                    </h3>
                    <ul className="space-y-1">
                      {summary.participants.map((p, i) => (
                        <li key={i} className="flex items-center text-gray-700">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {summary.keyPoints && summary.keyPoints.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <h3 className="font-semibold text-gray-800 flex items-center mb-3">
                      <span className="bg-blue-100 p-1 rounded-full mr-2">
                        <List className="w-4 h-4 text-blue-600" />
                      </span>
                      Key Points
                    </h3>
                    <ul className="space-y-2">
                      {summary.keyPoints.map((p, i) => (
                        <li key={i} className="flex text-gray-700">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 mt-2"></div>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {summary.actionItems && summary.actionItems.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <h3 className="font-semibold text-gray-800 flex items-center mb-3">
                    <span className="bg-blue-100 p-1 rounded-full mr-2">
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    </span>
                    Action Items
                  </h3>
                  <ul className="space-y-2">
                    {summary.actionItems.map((p, i) => (
                      <li key={i} className="flex text-gray-700">
                        <div className="w-5 h-5 rounded-md flex items-center justify-center border border-blue-400 mr-2">
                          <div className="w-2 h-2 rounded-sm bg-blue-600"></div>
                        </div>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        )}

        {summary && (
          <div className="mt-8 flex gap-4 justify-center">
            <button 
              onClick={handleDownloadJSON} 
              className="bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition-colors shadow-md flex items-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Download JSON
            </button>
            <button 
              onClick={handleDownloadText} 
              className="bg-white text-blue-600 border border-blue-600 px-5 py-3 rounded-md hover:bg-blue-50 transition-colors shadow-sm flex items-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Text
            </button>
          </div>
        )}
        
        <div className="mt-8 text-center text-xs text-gray-400">
          MOM Generator • Minutes of Meeting • v1.0
        </div>
      </div>
    </div>
  );
}

export default App;