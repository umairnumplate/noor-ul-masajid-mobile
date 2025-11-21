import React, { useState } from 'react';
import { runGemini } from '../lib/gemini';
import { SparklesIcon } from './Icons';

interface GenerateAnnouncementModalProps {
    onClose: () => void;
    onGenerate: (announcement: { title: string, content: string }) => void;
}

const GenerateAnnouncementModal: React.FC<GenerateAnnouncementModalProps> = ({ onClose, onGenerate }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt) {
            setError('Please enter a topic for the announcement.');
            return;
        }
        setIsLoading(true);
        setError('');
        
        const fullPrompt = `
          You are an administrator for an Islamic education system named "Noor ul Masajid".
          Generate a concise and professional announcement for the notice board based on the following topic.
          The topic is: "${prompt}".
          Return the response as a single, valid JSON object with two keys: "title" (a short, suitable headline) and "content" (the full announcement text, about 2-3 sentences).
          Do not include any other text or markdown formatting outside of the JSON object.
          Example: { "title": "Holiday Announcement", "content": "The Madrasa will be closed on [Date] for [Occasion]. Classes will resume on [Date]." }
        `;

        try {
            const responseJson = await runGemini('gemini-3-pro-preview', fullPrompt);
            const parsedResponse = JSON.parse(responseJson);
            
            if (parsedResponse.title && parsedResponse.content) {
                onGenerate(parsedResponse);
            } else {
                throw new Error("Invalid JSON structure in AI response.");
            }
        } catch (e) {
            console.error("Failed to generate or parse announcement:", e);
            setError("Sorry, there was an error generating the announcement. Please try a different prompt.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
            <div className="bg-surface rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-on-surface">Generate Announcement</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="announcement-prompt" className="block text-sm font-medium text-gray-700">
                            What is the announcement about?
                        </label>
                        <input
                            id="announcement-prompt"
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                            placeholder="e.g., Holiday for Eid al-Adha"
                        />
                         {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleGenerate}
                            disabled={isLoading || !prompt}
                            className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark flex items-center justify-center gap-2 disabled:bg-primary/50"
                        >
                            <SparklesIcon className="h-5 w-5" />
                            {isLoading ? 'Generating...' : 'Generate'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerateAnnouncementModal;
