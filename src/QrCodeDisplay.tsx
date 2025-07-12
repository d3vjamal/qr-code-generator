import React from 'react';
import { Box, Paper, Typography, Button, Stack } from '@mui/material';

interface QrCodeDisplayProps {
    qrData: string;
    qrRef: React.RefObject<HTMLDivElement | null>;
    onDownload: () => void;
    onCopy: () => void;
    copied: boolean;
    t: (key: string) => string;
}

const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({ qrData, qrRef, onDownload, onCopy, copied, t }) => {
    return (
        <Box mt={{ xs: 2, md: 4 }} width="100%">
            <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, mb: 2, bgcolor: 'grey.50' }}>
                {qrData ? (
                    <Stack alignItems="center" spacing={2}>
                        <Box ref={qrRef} display="flex" justifyContent="center" sx={{
                            '& canvas': {
                                width: '100% !important',
                                height: 'auto !important'
                            }
                        }} />
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                            {t('scanQrCode')}
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} width="100%">
                            <Button variant="contained" color="primary" fullWidth onClick={onDownload}>
                                {t('download')}
                            </Button>
                            <Button variant="outlined" color="primary" fullWidth onClick={onCopy}>
                                {copied ? t('copied') : t('copyData')}
                            </Button>
                        </Stack>

                    </Stack>
                ) : (
                    <Stack alignItems="center" spacing={2} py={{ xs: 4, sm: 6 }}>
                        <Typography variant="h4" color="grey.300">QR</Typography>
                        <Typography color="text.secondary" textAlign="center">{t('fillFormPrompt')}</Typography>
                    </Stack>
                )}
            </Paper>
        </Box>
    );
};

export default QrCodeDisplay;
