import { useState } from 'react';

const useLocalFonts = () => {
  const [fonts, setFonts] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  const requestFonts = async () => {
    setLoading(true);
    try {
      if (!window.queryLocalFonts) {
        throw new Error('Local Font Access API not supported');
      }
      
      const available = await window.queryLocalFonts();
      // Deduplicate by family name
      const families = [...new Set(available.map(f => f.family))].sort();
      setFonts(families);
      setPermissionGranted(true);
    } catch (err) {
      console.warn('Font access denied or not supported. Falling back to standard fonts.', err);
      setFonts([
        'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat',
        'Arial', 'Georgia', 'Times New Roman', 'Courier New',
        'Verdana', 'Trebuchet MS', 'Impact', 'Comic Sans MS'
      ]);
      setPermissionGranted(false);
    } finally {
      setLoading(false);
    }
  };

  return { fonts, permissionGranted, requestFonts, loading };
};

export default useLocalFonts;
