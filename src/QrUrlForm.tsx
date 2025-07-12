import React from 'react';
import { TextField } from '@mui/material';
import { Link } from 'lucide-react';

interface QrUrlFormProps {
    t: (key: string) => string;
    urlInput: string;
    setUrlInput: React.Dispatch<React.SetStateAction<string>>;
}

const QrUrlForm: React.FC<QrUrlFormProps> = ({ t, urlInput, setUrlInput }) => {
    return (
        <TextField
            fullWidth
            label={t('websiteUrl')}
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={t('urlPlaceholder')}
            helperText={t('urlHelp')}
            InputProps={{
                startAdornment: <Link style={{ marginRight: '8px' }} />,
            }}
            sx={{
                '.MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                },
                '.MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                }
            }}
        />
    );
};

export default QrUrlForm;
