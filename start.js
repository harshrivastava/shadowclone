const { spawn } = require('child_process');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('Starting Minimal AI Assistant...');
console.log('GROQ_API_KEY present:', !!process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_actual_groq_api_key_here');

const electron = require('electron');

// Spawn Electron process with environment variables
const proc = spawn(electron, ['.'], {
    stdio: 'inherit',
    env: process.env
});

proc.on('close', (code) => {
    console.log(`Assistant process exited with code ${code}`);
    process.exit(code);
});
