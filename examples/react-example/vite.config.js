import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // `r16n` is linked from the repository root, which has its own copy of React.
    // Make sure the example and r16n share one React and one react-redux.
    dedupe: ['react', 'react-dom', 'react-redux', 'redux', 'moment'],
  },
});
