import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Zap, Clock, User, Bot, AlertCircle, CheckCircle2, Volume2, VolumeX } from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';
import { Button } from './ui/Button';
import { useSpeech } from '../hooks/useSpeech';

interface CommandCenterProps {
    userProfile: UserProfile;
}

const CommandCenter: React.FC<CommandCenterProps> = ({ userProfile }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [vocalLevel, setVocalLevel] = useState(0);
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
    const { speak, stop: stopSpeech, isSpeaking } = useSpeech();

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
            if (isVoiceEnabled) {
                speak(`KRACHET Workspace initialized. Systems normal. How can I assist you today, ${userProfile.name}?`);
            }
        }
    }, [userProfile.name, isVoiceEnabled, speak]);

    // VOICE RECORDING LOGIC
    const startRecording = async () => {
        try {
            stopSpeech(); // Stop any ongoing AI speech when user starts talking
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

            if (isVoiceEnabled && response.content) {
                speak(response.content);
            }
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
            <div className="mt-4 p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-4 shadow-2xl backdrop-blur-md transition-all hover:bg-white/[0.04]">
                <div className="flex items-center space-x-2 border-b border-white/5 pb-3 mb-3">
                    <Zap className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Neural Workflow Engine</span>
                </div>

                {result.summary && (
                    <div className="animate-in fade-in slide-in-from-top-1 duration-500">
                        <h4 className="text-[10px] font-bold text-violet-400 uppercase tracking-tight mb-2 opacity-70">Analysis Summary</h4>
                        <p className="text-sm text-slate-300 leading-relaxed font-light">{result.summary}</p>
                    </div>
                )}

                {Object.entries(result).map(([key, value]) => {
                    if (key === 'summary' || !Array.isArray(value) || value.length === 0) return null;
                    const label = key.replace(/_/g, ' ').toUpperCase();
                    return (
                        <div key={key} className="animate-in fade-in slide-in-from-top-2 duration-700">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-2">{label}</h4>
                            <ul className="space-y-2">
                                {value.map((item: any, i: number) => (
                                    <li key={i} className="flex items-start space-x-3 text-sm text-slate-400">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-500/50 shadow-[0_0_8px_rgba(124,58,237,0.3)] shrink-0" />
                                        <span className="font-light">{typeof item === 'string' ? item : JSON.stringify(item)}</span>
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
        <div className="flex flex-col h-full bg-transparent">
            {/* Activity Stream */}
            <div className="flex-1 overflow-y-auto px-8 py-10 space-y-10 scroll-smooth overflow-x-hidden custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in-up duration-500`}>
                        <div className={`flex max-w-[85%] space-x-4 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xl transition-transform hover:scale-110 relative group ${msg.role === 'user'
                                ? 'bg-white/5 border border-white/10'
                                : 'bg-gradient-to-br from-violet-500 to-indigo-600 border border-white/10'
                                } ${msg.role === 'assistant' && isSpeaking && idx === messages.length - 1 ? 'ring-2 ring-violet-400 shadow-glow scale-105' : ''}`}>
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                                {msg.role === 'user' ? <User className="w-5 h-5 text-slate-300" /> : <Bot className={`w-5 h-5 text-white ${isSpeaking && idx === messages.length - 1 ? 'animate-pulse' : ''}`} />}
                            </div>

                            <div className="space-y-2 flex-1 min-w-0">
                                <div className={`px-5 py-3.5 rounded-2xl text-[14px] leading-relaxed shadow-2xl border backdrop-blur-xl transition-all ${msg.role === 'user'
                                    ? 'bg-white/[0.03] border-white/10 text-slate-200'
                                    : 'bg-white/[0.01] border-white/5 text-slate-100'
                                    }`}>
                                    <div className="whitespace-pre-wrap font-light tracking-wide">{msg.content}</div>

                                    {/* Workflow Results */}
                                    {(msg as any).workflow_result && (
                                        <WorkflowResultRenderer result={(msg as any).workflow_result} />
                                    )}

                                    {/* Error State */}
                                    {(msg as any).metadata?.error && (
                                        <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center space-x-3 text-red-100 text-[11px] font-bold tracking-tight">
                                            <AlertCircle className="w-4 h-4 text-red-400" />
                                            <span className="uppercase tracking-widest">System Warning: Protocol Interrupted</span>
                                        </div>
                                    )}
                                </div>
                                <div className={`px-1 text-[10px] text-slate-500 flex items-center space-x-3 font-bold tracking-widest uppercase ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className="flex items-center space-x-1">
                                        <Clock className="w-3 h-3 opacity-50" />
                                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    {msg.role === 'assistant' && (
                                        <>
                                            <span className="opacity-20">•</span>
                                            <div className="flex items-center space-x-1.5">
                                                <CheckCircle2 className="w-3 h-3 text-violet-500" />
                                                <span className="text-violet-400/70">Secure Hash Verified</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {isThinking && (
                    <div className="flex justify-start animate-pulse duration-1000">
                        <div className="flex space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-600/20 border border-white/5 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-violet-400 opacity-50" />
                            </div>
                            <div className="bg-white/[0.02] h-11 w-32 rounded-2xl border border-white/5 backdrop-blur-sm"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Dashboard */}
            <div className="p-8 border-t border-white/5 bg-[#030014]/40 backdrop-blur-2xl">
                <div className="max-w-5xl mx-auto flex items-end space-x-4">
                    <div className="flex-1 relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Initialize neural command or ask KRACHET to synthesize a workflow..."
                            className="relative block w-full rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 text-sm text-white placeholder-slate-500 focus:border-violet-500/50 focus:ring-0 resize-none min-h-[56px] max-h-[200px] transition-all font-light"
                            rows={1}
                        />
                    </div>
                    <div className="flex space-x-3 shrink-0 h-[56px] items-center">
                        {isListening && (
                            <div className="flex items-center space-x-1.5 px-4 h-full animate-in fade-in duration-300">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-1 bg-violet-500 rounded-full transition-all duration-75 shadow-glow"
                                        style={{ height: `${Math.max(4, (vocalLevel * (1 + i * 0.2)) / 3)}px` }}
                                    ></div>
                                ))}
                            </div>
                        )}
                        <Button
                            variant="secondary"
                            className={`h-[56px] w-[56px] p-0 rounded-xl transition-all duration-300 ${isListening ? 'ring-2 ring-violet-500 bg-violet-500/10' : ''}`}
                            onClick={toggleListening}
                        >
                            {isListening ? <Mic className="w-5 h-5 text-white animate-pulse" /> : <MicOff className="w-5 h-5 text-slate-500" />}
                        </Button>
                        <Button
                            variant="secondary"
                            className={`h-[56px] w-[56px] p-0 rounded-xl transition-all duration-300 ${isVoiceEnabled ? 'text-violet-400' : 'text-slate-500'}`}
                            onClick={() => {
                                if (isVoiceEnabled) stopSpeech();
                                setIsVoiceEnabled(!isVoiceEnabled);
                            }}
                            title={isVoiceEnabled ? "Mute AI Voice" : "Enable AI Voice"}
                        >
                            {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                        </Button>
                        <Button
                            onClick={handleSendMessage}
                            isLoading={isThinking}
                            className="h-[56px] px-8 rounded-xl font-display font-bold tracking-wider text-sm premium-button"
                            variant="premium"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div className="max-w-5xl mx-auto mt-5 flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            <Zap className="w-3.5 h-3.5 text-violet-500" />
                            <span>12 Neural Workflows Ready</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest cursor-pointer hover:text-violet-400 transition-colors group">
                            <Clock className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                            <span>Recent Persistence: MOM Synthesis</span>
                        </div>
                    </div>
                    <div className="text-[10px] text-slate-600 font-mono font-bold tracking-tighter opacity-70">
                        V2.0.4-PROTO-SaaS
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommandCenter;
