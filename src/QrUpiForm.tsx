import React from 'react';
import { Grid, TextField } from '@mui/material';
import { CreditCard, User, MessageSquare } from 'lucide-react';

interface UPIInfo {
    upiId: string;
    amount: string;
    recipientName: string;
    note: string;
}

interface QrUpiFormProps {
    t: (key: string) => string;
    upiInfo: UPIInfo;
    setUpiInfo: React.Dispatch<React.SetStateAction<UPIInfo>>;
    validateUpiId: (upiId: string) => boolean;
    validateAmount: (amount: string) => boolean;
    handleAmountChange: (value: string) => void;
}

const QrUpiForm: React.FC<QrUpiFormProps> = ({ t, upiInfo, setUpiInfo, validateUpiId, validateAmount, handleAmountChange }) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    required
                    label={t('upiId')}
                    value={upiInfo.upiId}
                    onChange={(e) => setUpiInfo({ ...upiInfo, upiId: e.target.value })}
                    placeholder={t('upiIdPlaceholder')}
                    helperText={t('upiIdHelp')}
                    error={!!upiInfo.upiId && !validateUpiId(upiInfo.upiId)}
                    InputProps={{ startAdornment: <CreditCard style={{ marginRight: '8px' }} /> }}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField fullWidth label={t('recipientName')} value={upiInfo.recipientName} onChange={(e) => setUpiInfo({ ...upiInfo, recipientName: e.target.value })} placeholder={t('recipientNamePlaceholder')} InputProps={{ startAdornment: <User style={{ marginRight: '8px' }} /> }} />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label={t('amount')}
                    value={upiInfo.amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder={t('amountPlaceholder')}
                    helperText={t('amountHelp')}
                    error={!!upiInfo.amount && !validateAmount(upiInfo.amount)}
                    InputProps={{ startAdornment: <CreditCard style={{ marginRight: '8px' }} /> }}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField fullWidth name='notes' label={t('paymentNote')} value={upiInfo.note} onChange={(e) => setUpiInfo({ ...upiInfo, note: e.target.value })} placeholder={t('paymentNotePlaceholder')} helperText={t('paymentNoteHelp')} InputProps={{ startAdornment: <MessageSquare style={{ marginRight: '8px' }} /> }} />
            </Grid>
        </Grid>
    );
};

export default QrUpiForm;