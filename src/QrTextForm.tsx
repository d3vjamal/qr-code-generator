import React from 'react';
import { TextField } from '@mui/material';
import { MessageSquare } from 'lucide-react';

interface QrTextFormProps {
    t: (key: string) => string;
    textInput: string;
    setTextInput: React.Dispatch<React.SetStateAction<string>>;
}

const QrTextForm: React.FC<QrTextFormProps> = ({ t, textInput, setTextInput }) => {
    return (
        <TextField
            fullWidth
            multiline
            rows={4}
            label={t('textContent')}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={t('textPlaceholder')}
            InputProps={{
                startAdornment: <MessageSquare style={{ marginRight: '8px' }} />,
            }}
        />
    );
};

export default QrTextForm;
