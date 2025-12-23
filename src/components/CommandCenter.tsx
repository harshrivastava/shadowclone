import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Zap, MicOff, Volume2, VolumeX } from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';

interface CommandCenterProps {
    userProfile: UserProfile;
    userAvatar: string | null;
    themeColors: string[];
    isDarkMode?: boolean;
}

const CommandCenter: React.FC<CommandCenterProps> = ({ userProfile, userAvatar, themeColors, isDarkMode }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [vocalLevel, setVocalLevel] = useState(0);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyzerRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Audio Analysis for Visualizer
    const startAudioAnalysis = async (stream: MediaStream) => {
        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            audioContextRef.current = new AudioContextClass();
            analyzerRef.current = audioContextRef.current.createAnalyser();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            source.connect(analyzerRef.current);
            analyzerRef.current.fftSize = 256;

            const bufferLength = analyzerRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const updateLevel = () => {
                if (!analyzerRef.current) return;
                analyzerRef.current.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((prev, curr) => prev + curr, 0) / bufferLength;
                setVocalLevel(average);
                animationFrameRef.current = requestAnimationFrame(updateLevel);
            };

            updateLevel();
        } catch (err) {
            console.error('Mic analysis failed:', err);
        }
    };

    const stopAudioAnalysis = () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (audioContextRef.current) {
            audioContextRef.current.close().catch(e => console.error("Error closing audio context:", e));
            audioContextRef.current = null;
        }
        setVocalLevel(0);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const options = { mimeType: 'audio/webm' };
            let recorder: MediaRecorder;

            try {
                if (MediaRecorder.isTypeSupported('audio/webm')) {
                    recorder = new MediaRecorder(stream, options);
                } else {
                    recorder = new MediaRecorder(stream);
                }
            } catch (e) {
                recorder = new MediaRecorder(stream);
            }

            audioChunksRef.current = [];

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            recorder.onstop = async () => {
                const finalMimeType = recorder.mimeType;
                const audioBlob = new Blob(audioChunksRef.current, { type: finalMimeType });
                const arrayBuffer = await audioBlob.arrayBuffer();

                setIsListening(false);
                setIsThinking(true);
                stopAudioAnalysis();

                try {
                    const result = await window.api.transcribe({
                        audioBuffer: new Uint8Array(arrayBuffer),
                        mimeType: finalMimeType
                    });

                    if (result.success && result.text) {
                        handleSendMessage(result.text);
                    } else {
                        console.error('Transcription failed:', result.error);
                        setMessages(prev => [...prev, {
                            role: 'assistant',
                            content: `Sorry, I couldn't hear you correctly. Please try again.`,
                            timestamp: Date.now()
                        }]);
                        setIsThinking(false);
                    }
                } catch (error) {
                    console.error('Transcription error:', error);
                    setIsThinking(false);
                }

                stream.getTracks().forEach(track => track.stop());
            };

            recorder.onstart = () => console.log('[MediaRecorder] Recording started');
            recorder.onerror = (e: any) => console.error('[MediaRecorder] Error:', e.error);

            recorder.start();
            setMediaRecorder(recorder);
            setIsListening(true);
            startAudioAnalysis(stream);
        } catch (err) {
            console.error('Failed to start recording:', err);
            setIsListening(false);
            setIsThinking(false);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
    };

    const speak = (text: string) => {
        if (isMuted) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Microsoft David')) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        window.speechSynthesis.getVoices();
    }, []);

    useEffect(() => {
        if (messages.length === 0) {
            const greeting = `Online. Systems normal. What's on the agenda, ${userProfile.name}?`;
            setMessages([{
                role: 'assistant',
                content: greeting,
                timestamp: Date.now()
            }]);
            setTimeout(() => speak(greeting), 1000);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const toggleListening = () => {
        if (isListening) {
            stopRecording();
        } else {
            setInput('');
            startRecording();
        }
    };

    const handleSendMessage = async (rawInput?: string) => {
        const textToSend = rawInput || input;
        if (!textToSend.trim()) return;

        const userMsg: ChatMessage = {
            role: 'user',
            content: textToSend,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        try {
            const response = await window.api.sendChatMessage(userMsg.content);
            setMessages(prev => [...prev, response]);
            speak(response.content);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMsg = 'Connection interrupted. Please check neural link (Internet).';
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: errorMsg,
                timestamp: Date.now()
            }]);
            speak(errorMsg);
        } finally {
            setIsThinking(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] max-w-5xl mx-auto">
            <div className="flex-1 flex flex-col items-center justify-center relative min-h-[400px]">
                {(isThinking || isListening) && (
                    <>
                        <div
                            className={`absolute rounded-full border-4 transition-all duration-75 ${isListening ? 'border-red-500/20' : 'border-blue-500/20'}`}
                            style={{
                                width: isListening ? 200 + (vocalLevel * 2) : 256,
                                height: isListening ? 200 + (vocalLevel * 2) : 256,
                                opacity: isListening ? 0.3 + (vocalLevel / 100) : 0.5
                            }}
                        ></div>
                        <div
                            className={`absolute rounded-full border-2 transition-all duration-150 ${isListening ? 'border-red-400/10' : 'border-blue-400/10'} animate-ping`}
                            style={{ width: 300, height: 300 }}
                        ></div>
                    </>
                )}

                <div
                    className={`relative z-10 w-48 h-48 rounded-full shadow-[0_0_50px_rgba(0,0,0,0.1)] border-4 p-1 transition-all duration-75 ${isListening ? 'border-red-400' : isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-white bg-white'} bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden`}
                    style={{
                        transform: `scale(${isListening ? 1 + (vocalLevel / 400) : 1})`,
                        boxShadow: isListening ? `0 0 ${20 + vocalLevel}px rgba(239, 68, 68, 0.3)` : isThinking ? `0 0 40px rgba(59, 130, 246, 0.2)` : 'none'
                    }}
                >
                    <div className="w-full h-full rounded-full flex items-center justify-center text-6xl bg-white text-gray-800">
                        {userAvatar || '🤖'}
                    </div>
                    <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${isListening ? 'opacity-30 bg-red-500/20' : isThinking ? 'opacity-30 bg-blue-500/20' : 'opacity-0'}`}></div>
                </div>

                <div className="mt-8 relative">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-1 h-3 rounded-full transition-all duration-150 ${isListening && vocalLevel > (i * 20) ? 'bg-red-500 h-6' : 'bg-gray-200'}`}
                            ></div>
                        ))}
                    </div>
                    <h2 className={`text-2xl font-bold tracking-tight text-center ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                        AI Assistant
                    </h2>
                    <p className={`text-sm font-medium tracking-widest uppercase mt-1 text-center transition-colors duration-300 ${isListening ? 'text-red-600' : 'text-blue-600'}`}>
                        {isListening ? 'LISTENING' : isThinking ? 'THINKING' : 'READY'}
                    </p>
                </div>

                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm transition-all border shadow-sm ${isDarkMode ? 'bg-gray-800/50 hover:bg-gray-700 text-gray-300 border-gray-700' : 'bg-white/50 hover:bg-white text-gray-600 border-gray-100'}`}
                    title={isMuted ? "Unmute Assistant" : "Mute Assistant"}
                >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
            </div>

            <div className={`flex-1 rounded-t-3xl border-t transition-colors duration-300 flex flex-col overflow-hidden ${isDarkMode ? 'bg-gray-900 border-gray-800 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]' : 'bg-white/80 border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] backdrop-blur-md'}`}>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm relative ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : isDarkMode ? 'bg-gray-800 border border-gray-700 text-gray-100 rounded-bl-none'
                                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                                }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                {msg.type === 'action_request' && (
                                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 p-1.5 rounded-full shadow-md animate-bounce">
                                        <Zap className="w-3 h-3 fill-current" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isThinking && (
                        <div className="flex justify-start">
                            <div className={`rounded-2xl rounded-bl-none px-5 py-3 shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className={`p-4 border-t transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                    <div className={`relative flex items-center rounded-xl border transition-all duration-300 ${isListening ? 'border-red-300 ring-4 ring-red-50 bg-red-50/50' : isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-gray-50 border-gray-200 hover:border-blue-300'} focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500`}>
                        <button
                            onClick={toggleListening}
                            className={`pl-4 transition-all duration-300 ${isListening ? 'text-red-600 scale-125' : 'text-gray-400 hover:text-blue-600'}`}
                        >
                            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={isListening ? "I'm listening..." : "Type a command or chat..."}
                            className={`flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-lg ${isDarkMode ? 'text-gray-100 placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                            disabled={isThinking}
                            autoFocus
                        />
                        <button
                            onClick={() => handleSendMessage()}
                            disabled={!input.trim() || isThinking || isListening}
                            className={`p-2 mr-2 rounded-lg transition-all ${!input.trim() || isListening ? 'text-gray-300' : 'bg-blue-600 text-white shadow-md hover:bg-blue-700'}`}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommandCenter;
