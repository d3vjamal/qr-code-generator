import React from 'react';
import { TextField, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface WifiInfo {
    ssid: string;
    encryption: string;
    password?: string;
}

interface QrWifiFormProps {
    t: (key: string) => string;
    wifiInfo: WifiInfo;
    setWifiInfo: (info: WifiInfo) => void;
}

const QrWifiForm: React.FC<QrWifiFormProps> = ({ t, wifiInfo, setWifiInfo }) => {
    return (
        <Box>
            <TextField
                label={t('ssid')}
                value={wifiInfo.ssid}
                onChange={(e) => setWifiInfo({ ...wifiInfo, ssid: e.target.value })}
                fullWidth
                margin="normal"
                placeholder={t('ssidPlaceholder')}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>{t('encryption')}</InputLabel>
                <Select
                    value={wifiInfo.encryption}
                    label={t('encryption')}
                    onChange={(e) => setWifiInfo({ ...wifiInfo, encryption: e.target.value })}
                    sx={{ borderRadius: '19px' }}
                >
                    <MenuItem value="WPA">WPA/WPA2</MenuItem>
                    <MenuItem value="WEP">WEP</MenuItem>
                    <MenuItem value="nopass">None</MenuItem>
                </Select>
            </FormControl>
            {wifiInfo.encryption !== 'nopass' && (
                <TextField
                    label={t('password')}
                    type="password"
                    value={wifiInfo.password || ''}
                    onChange={(e) => setWifiInfo({ ...wifiInfo, password: e.target.value })}
                    fullWidth
                    margin="normal"
                    placeholder={t('passwordPlaceholder')}
                />
            )}
        </Box>
    );
};

export default QrWifiForm;