import React from 'react';
import { TextField, Box } from '@mui/material';

interface WhatsappInfo {
    phone: string;
    message: string;
}

interface QrWhatsappFormProps {
    t: (key: string) => string;
    whatsappInfo: WhatsappInfo;
    setWhatsappInfo: (info: WhatsappInfo) => void;
}

const QrWhatsappForm: React.FC<QrWhatsappFormProps> = ({ t, whatsappInfo, setWhatsappInfo }) => {
    return (
        <Box>
            <TextField
                label={t('whatsappNumber')}
                value={whatsappInfo.phone}
                onChange={(e) => setWhatsappInfo({ ...whatsappInfo, phone: e.target.value })}
                fullWidth
                margin="normal"
                placeholder={t('whatsappNumberPlaceholder')}
                helperText={t('whatsappNumberHelp')}
            />
            <TextField
                label={t('whatsappMessage')}
                value={whatsappInfo.message}
                onChange={(e) => setWhatsappInfo({ ...whatsappInfo, message: e.target.value })}
                fullWidth
                margin="normal"
                multiline
                rows={4}
                placeholder={t('whatsappMessagePlaceholder')}
            />
        </Box>
    );
};

export default QrWhatsappForm;