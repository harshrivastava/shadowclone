import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Zap, Clock, User, Bot, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';
import { Button } from './ui/Button';

interface CommandCenterProps {
    userProfile: UserProfile;
    userAvatar: string | null;
    themeColors: string[];
}

const CommandCenter: React.FC<CommandCenterProps> = ({ userProfile }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [vocalLevel, setVocalLevel] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const animationFrameRef = useRef<number | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                role: 'assistant',
                content: `KRACHET Workspace initialized. Systems normal. How can I assist you today, ${userProfile.name}?`,
                timestamp: Date.now(),
                type: 'text'
            }]);
        }
    }, [userProfile.name]);

    // VOICE RECORDING LOGIC
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            // Visualizer setup
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const updateVolume = () => {
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                }
                const average = sum / bufferLength;
                setVocalLevel(average);
                animationFrameRef.current = requestAnimationFrame(updateVolume);
            };
            updateVolume();

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const arrayBuffer = await audioBlob.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);

                setIsThinking(true);
                try {
                    const result = await (window as any).api.transcribe({
                        audioBuffer: uint8Array,
                        mimeType: 'audio/webm'
                    });

                    if (result && result.success && result.text && result.text.trim()) {
                        setInputValue(result.text);
                    }
                } catch (error) {
                    console.error('[CommandCenter] Transcription failed:', error);
                } finally {
                    setIsThinking(false);
                    // Cleanup stream
                    stream.getTracks().forEach(track => track.stop());
                }
            };

            mediaRecorder.start();
            setIsListening(true);
        } catch (error) {
            console.error('[CommandCenter] Microphone access failed:', error);
            setIsListening(false);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        setIsListening(false);
        setVocalLevel(0);
    };

    const toggleListening = () => {
        if (isListening) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isThinking) return;

        const userMsg: ChatMessage = {
            role: 'user',
            content: inputValue,
            timestamp: Date.now(),
            type: 'text'
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsThinking(true);

        try {
            const response = await (window as any).api.sendChatMessage(inputValue);
            setMessages(prev => [...prev, response]);
        } catch (error) {
            console.error('[CommandCenter] Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm having trouble connecting to my engine. Please check your connection.",
                timestamp: Date.now(),
                type: 'text'
            }]);
        } finally {
            setIsThinking(false);
        }
    };

    /**
     * FLEXIBLE UI RENDERER
     * Dynamically renders workflow results from n8n.
     */
    const WorkflowResultRenderer = ({ result }: { result: any }) => {
        if (!result) return null;

        return (
            <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-100 space-y-4 shadow-sm text-gray-900">
                <div className="flex items-center space-x-2 border-b border-gray-200 pb-2 mb-2">
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Workflow Execution Engine</span>
                </div>

                {result.summary && (
                    <div>
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">Summary</h4>
                        <p className="text-sm text-gray-700 leading-normal">{result.summary}</p>
                    </div>
                )}

                {Object.entries(result).map(([key, value]) => {
                    if (key === 'summary' || !Array.isArray(value) || value.length === 0) return null;
                    const label = key.replace(/_/g, ' ').toUpperCase();
                    return (
                        <div key={key}>
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">{label}</h4>
                            <ul className="space-y-1.5">
                                {value.map((item: any, i: number) => (
                                    <li key={i} className="flex items-start space-x-2 text-sm text-gray-600">
                                        <div className="mt-1.5 w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                                        <span>{typeof item === 'string' ? item : JSON.stringify(item)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Activity Stream */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth overflow-x-hidden">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                        <div className={`flex max-w-[85%] space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-gray-100 border border-gray-200' : 'bg-gray-900 border border-gray-900'
                                }`}>
                                {msg.role === 'user' ? <User className="w-4 h-4 text-gray-600" /> : <Bot className="w-4 h-4 text-gray-100" />}
                            </div>

                            <div className="space-y-1 flex-1 min-w-0">
                                <div className={`px-4 py-2.5 rounded-lg text-sm leading-relaxed shadow-sm border ${msg.role === 'user'
                                    ? 'bg-white border-gray-200 text-gray-800'
                                    : 'bg-gray-900 border-gray-800 text-gray-100'
                                    }`}>
                                    <div className="whitespace-pre-wrap">{msg.content}</div>

                                    {/* Workflow Results */}
                                    {(msg as any).workflow_result && (
                                        <WorkflowResultRenderer result={(msg as any).workflow_result} />
                                    )}

                                    {/* Error State */}
                                    {(msg as any).metadata?.error && (
                                        <div className="mt-3 p-3 rounded bg-red-500/10 border border-red-500/20 flex items-center space-x-2 text-red-100 text-xs">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            <span>Execution failed. Please check system configurations.</span>
                                        </div>
                                    )}
                                </div>
                                <div className={`text-[10px] text-gray-400 flex items-center space-x-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <Clock className="w-3 h-3" />
                                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    {msg.role === 'assistant' && (
                                        <>
                                            <span className="text-gray-200">|</span>
                                            <div className="flex items-center space-x-1">
                                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                                <span className="text-gray-500">Verified by KRACHET</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {isThinking && (
                    <div className="flex justify-start animate-pulse">
                        <div className="flex space-x-3">
                            <div className="w-8 h-8 rounded-md bg-gray-900 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-gray-100" />
                            </div>
                            <div className="bg-gray-100 h-9 w-24 rounded-lg border border-gray-200"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Dashboard */}
            <div className="p-6 border-t border-gray-200 bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.02)]">
                <div className="max-w-4xl mx-auto flex items-end space-x-3">
                    <div className="flex-1 relative">
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Type a command or ask KRACHET to run a workflow..."
                            className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:ring-0 resize-none min-h-[44px] max-h-[200px]"
                            rows={1}
                        />
                    </div>
                    <div className="flex space-x-2 shrink-0 h-11 items-center">
                        {isListening && (
                            <div className="flex items-center space-x-1 px-3 h-full">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-1 bg-red-500 rounded-full transition-all duration-75"
                                        style={{ height: `${Math.max(4, (vocalLevel * (1 + i * 0.2)) / 4)}px` }}
                                    ></div>
                                ))}
                            </div>
                        )}
                        <Button
                            variant="secondary"
                            size="sm"
                            className={`h-11 w-11 p-0 rounded-lg transition-all duration-300 ${isListening ? 'ring-2 ring-red-500 bg-red-50' : ''}`}
                            onClick={toggleListening}
                        >
                            {isListening ? <Mic className="w-4 h-4 text-red-600 animate-pulse" /> : <MicOff className="w-4 h-4 text-gray-400" />}
                        </Button>
                        <Button
                            onClick={handleSendMessage}
                            isLoading={isThinking}
                            className="h-11 px-6 rounded-lg font-bold tracking-tight"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div className="max-w-4xl mx-auto mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-1.5 text-[10px] text-gray-400 font-medium">
                            <Zap className="w-3 h-3 text-amber-500" />
                            <span>8 Workflows Available</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-[10px] text-gray-400 font-medium cursor-pointer hover:text-gray-900 transition-colors">
                            <Clock className="w-3 h-3" />
                            <span>Recent: Generate MOM</span>
                        </div>
                    </div>
                    <div className="text-[10px] text-gray-300 font-mono">
                        v1.2.0-SaaS
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommandCenter;
