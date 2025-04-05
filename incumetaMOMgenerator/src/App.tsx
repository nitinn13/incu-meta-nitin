import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-6 text-gray-800">
          <FileText className="text-indigo-600 w-8 h-8" />
          MOM Generator (Gemini)
        </h1>

        {aiError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{aiError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border-2 border-dashed p-6 rounded-lg text-center">
            <input
              type="file"
              accept=".txt,.json"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              <Upload className="w-4 h-4 inline-block mr-2" />
              Upload File
            </button>
            <p className="text-sm mt-2 text-gray-600">Supports .txt and .json files</p>
            {fileName && <p className="text-sm font-medium mt-1 text-indigo-700">Selected: {fileName}</p>}
          </div>

          <div className="bg-gray-50 border p-6 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">File Stats</h3>
            <p>Total Messages: {messages.length}</p>
            <p>
              Last Updated:{' '}
              {messages.length > 0
                ? new Date(messages[messages.length - 1].timestamp).toLocaleString()
                : 'N/A'}
            </p>
            {summary?.duration && <p>Meeting Duration: {summary.duration}</p>}
          </div>
        </div>

        {isGeneratingAISummary ? (
          <p className="text-indigo-600 font-medium text-center">Generating AI Summary...</p>
        ) : (
          summary && (
            <div className="mt-6 bg-indigo-50 p-6 rounded-lg space-y-3">
              <h2 className="text-xl font-bold text-indigo-700">Meeting Summary</h2>
              {summary.aiSummary && (
                <div>
                  <h3 className="font-semibold">AI Summary</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{summary.aiSummary}</p>
                </div>
              )}
              {summary.participants && (
                <div>
                  <h3 className="font-semibold">Participants</h3>
                  <ul className="list-disc ml-5 text-sm text-gray-700">
                    {summary.participants.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              )}
              {summary.keyPoints && (
                <div>
                  <h3 className="font-semibold">Key Points</h3>
                  <ul className="list-disc ml-5 text-sm text-gray-700">
                    {summary.keyPoints.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              )}
              {summary.actionItems && (
                <div>
                  <h3 className="font-semibold">Action Items</h3>
                  <ul className="list-disc ml-5 text-sm text-gray-700">
                    {summary.actionItems.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )
        )}

        {summary && (
          <div className="mt-6 flex gap-4">
            <button onClick={handleDownloadJSON} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              <Download className="w-4 h-4 inline-block mr-1" />
              Download JSON
            </button>
            <button onClick={handleDownloadText} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
              <Download className="w-4 h-4 inline-block mr-1" />
              Download Text
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

