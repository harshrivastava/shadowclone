import { useState, useCallback, useEffect } from 'react';

export const useSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

    // Initialize/Find best voice
    useEffect(() => {
        const loadVoices = () => {
            const allVoices = window.speechSynthesis.getVoices();
            // Preference order for "premium" sounding voices
            const preferredVoices = [
                'premium',
                'google',
                'microsoft aria',
                'samantha',
                'daniel',
                'english'
            ];

            let bestVoice = allVoices.find(v =>
                preferredVoices.some(pref => v.name.toLowerCase().includes(pref) && v.lang.startsWith('en'))
            ) || allVoices.find(v => v.lang.startsWith('en')) || allVoices[0];

            setVoice(bestVoice);
        };

        loadVoices();
        if (typeof window !== 'undefined' && window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const speak = useCallback((text: string) => {
        if (!text || typeof window === 'undefined') return;

        // Cancel any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        if (voice) utterance.voice = voice;

        utterance.pitch = 1.05; // Slightly higher for "AI" feel
        utterance.rate = 1.0;   // Natural pace

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
            console.error('TTS Error:', e);
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    }, [voice]);

    const stop = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, []);

    return { speak, stop, isSpeaking, voiceName: voice?.name };
};
