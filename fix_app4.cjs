const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const locationFunc = `
  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    setLocationError('');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(\`https://nominatim.openstreetmap.org/reverse?format=json&lat=\${latitude}&lon=\${longitude}\`);
            const data = await res.json();
            if (data && data.display_name) {
              setPickupAddress(data.display_name);
            }
          } catch (err) {
            setLocationError('Could not fetch address details.');
          } finally {
            setIsLocating(false);
          }
        },
        (error) => {
          setLocationError('Location access denied or unavailable.');
          setIsLocating(false);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLocating(false);
    }
  };
`;

code = code.replace(/const handleCompleteBooking/, locationFunc + '\n  const handleCompleteBooking');
fs.writeFileSync('src/App.tsx', code);
