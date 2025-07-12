import React, { useState } from 'react';
import { Tabs, Tab, Box, Paper } from '@mui/material';
import QrUrlForm from './QrUrlForm';
import QrTextForm from './QrTextForm';
import QrContactForm from './QrContactForm';

const QRCodeTabs: React.FC<any> = ({ t, urlInput, setUrlInput, textInput, setTextInput, contactInfo, setContactInfo }) => {
    const [tab, setTab] = useState(0);

    return (
        <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
                <Tab label="URL" />
                <Tab label="Text" />
                <Tab label="Contact" />
            </Tabs>
            <Box p={4}>
                {tab === 0 && <QrUrlForm t={t} urlInput={urlInput} setUrlInput={setUrlInput} />}
                {tab === 1 && <QrTextForm t={t} textInput={textInput} setTextInput={setTextInput} />}
                {tab === 2 && <QrContactForm t={t} contactInfo={contactInfo} setContactInfo={setContactInfo} />}
            </Box>
        </Paper>
    );
};

export default QRCodeTabs;
