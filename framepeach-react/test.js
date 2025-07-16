import { app } from 'electron';

console.log('Test script started');
console.log('Electron version:', process.versions.electron);

app.whenReady().then(() => {
  console.log('App ready');
  app.quit();
});

console.log('Test script loaded');