import React, { useState, useEffect, useRef } from 'react';
import TRANSLATIONS from './TRANSLATIONS';

// Add type for TRANSLATIONS with index signature for type safety
type TranslationDict = {
    [key: string]: { [key: string]: string };
};
const TRANSLATIONS_TYPED: TranslationDict = TRANSLATIONS;
import { Link, MessageSquare, User, Heart, CreditCard, Wifi, MessageCircle } from 'lucide-react';
import { Container, Box, Typography, Tabs, Tab, Paper, Grid } from '@mui/material';
import './custom-styles.css';
import QrUrlForm from './QrUrlForm';
import QrTextForm from './QrTextForm';
import QrContactForm from './QrContactForm';
import QrUpiForm from './QrUpiForm';
import QrWifiForm from './QrWifiForm';
import QrWhatsappForm from './QrWhatsappForm';
import QrCodeDisplay from './QrCodeDisplay';
import ColorPicker from './ColorPicker';
import AppearanceSettings from './AppearanceSettings';
import Header from './Header';
import IconPicker from './IconPicker';
import QRCodeStyling from 'qr-code-styling';

interface WhatsappInfo {
    phone: string;
    message: string;
}

interface WifiInfo {
    ssid: string;
    encryption: string;
    password?: string;
}

interface ContactInfo {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    organization: string;
    url: string;
}

interface UPIInfo {
    upiId: string;
    amount: string;
    recipientName: string;
    note: string;
}


const QRCodeGenerator: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('url');
    const [qrData, setQrData] = useState<string>('');
    const [copied, setCopied] = useState<boolean>(false);
    const [locale, setLocale] = useState<string>('en-US');
    const qrContainerRef = useRef<HTMLDivElement>(null);
    const [foregroundColor, setForegroundColor] = useState('#000000');
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
    const [size, setSize] = useState(300);
    const [level, setLevel] = useState('M');
    // Removed unused selectedFrame, setSelectedFrame
    const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

    // Form states for different types
    const [urlInput, setUrlInput] = useState<string>('');
    const [textInput, setTextInput] = useState<string>('');
    const [contactInfo, setContactInfo] = useState<ContactInfo>({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        organization: '',
        url: ''
    });
    const [upiInfo, setUpiInfo] = useState<UPIInfo>({
        upiId: '',
        amount: '',
        recipientName: '',
        note: ''
    });
    const [wifiInfo, setWifiInfo] = useState<WifiInfo>({
        ssid: '',
        encryption: 'WPA',
        password: ''
    });
    const [whatsappInfo, setWhatsappInfo] = useState<WhatsappInfo>({
        phone: '',
        message: ''
    });

    // Translation function
    const t = (key: string): string => {
        return TRANSLATIONS_TYPED[locale]?.[key] || TRANSLATIONS_TYPED['en-US'][key] || key;
    };

    // Helper to render appTitle in two lines, with only 'FREE' colored
    const renderAppTitle = () => {
        const line1 = t('appTitleLine1');
        const line2 = t('appTitleLine2');
        const parts = line2.split(/(FREE)/);
        return (
            <>
                <span style={{ color: '#222', display: 'block' }}>{line1}</span>
                <span style={{ display: 'block' }}>
                    {parts.map((part, idx) =>
                        part === 'FREE' ? (
                            <span key={idx} style={{ color: '#00a5f1', fontWeight: 'bold' }}>{part}</span>
                        ) : (
                            <span key={idx} style={{ color: '#222' }}>{part}</span>
                        )
                    )}
                </span>
            </>
        );
    };



    // Validate UPI ID
    const validateUpiId = (upiId: string): boolean => {
        const upiPattern = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
        return upiPattern.test(upiId);
    };

    // Validate amount
    const validateAmount = (amount: string): boolean => {
        if (!amount) return true; // Amount is optional
        const num = parseFloat(amount);
        return !isNaN(num) && num > 0;
    };

    // Generate UPI payment URL
    const generateUpiUrl = (upi: UPIInfo): string => {
        if (!upi.upiId.trim()) return '';

        const params = new URLSearchParams();
        params.append('pa', upi.upiId);

        if (upi.recipientName.trim()) {
            params.append('pn', upi.recipientName);
        }

        if (upi.amount.trim() && validateAmount(upi.amount)) {
            params.append('am', upi.amount);
        }

        if (upi.note.trim()) {
            params.append('tn', upi.note);
        }

        params.append('cu', 'INR');

        return `upi://pay?${params.toString()}`;
    };

    const qrCode = new QRCodeStyling({
        width: size,
        height: size,
        data: qrData,
        image: selectedIcon || '',
        dotsOptions: {
            color: foregroundColor,
            type: 'rounded'
        },
        backgroundOptions: {
            color: backgroundColor,
        },
        imageOptions: {
            crossOrigin: 'anonymous',
            margin: 5
        },
        qrOptions: {
            errorCorrectionLevel: level as 'L' | 'M' | 'Q' | 'H'
        }
    });

    const generateQRCode = async (text: string): Promise<void> => {
        if (!text.trim()) {
            if (qrContainerRef.current) {
                qrContainerRef.current.innerHTML = '';
            }
            return;
        }
        qrCode.update({
            data: text,
            width: size,
            height: size,
            dotsOptions: {
                color: foregroundColor
            },
            backgroundOptions: {
                color: backgroundColor
            },
            image: selectedIcon || '',
            qrOptions: {
                errorCorrectionLevel: level as 'L' | 'M' | 'Q' | 'H'
            }
        });
        if (qrContainerRef.current) {
            qrContainerRef.current.innerHTML = '';
            qrCode.append(qrContainerRef.current);
        }
    };

    const formatUrl = (url: string): string => {
        if (!url.trim()) return '';

        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return 'https://' + url;
        }
        return url;
    };

    const generateVCard = (contact: ContactInfo): string => {
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.firstName} ${contact.lastName}
N:${contact.lastName};${contact.firstName};;;
ORG:${contact.organization}
TEL:${contact.phone}
EMAIL:${contact.email}
URL:${contact.url}
END:VCARD`;
        return vcard;
    };

    const generateWifiString = (wifi: WifiInfo): string => {
        if (!wifi.ssid) return '';
        const password = wifi.password || '';
        return `WIFI:T:${wifi.encryption};S:${wifi.ssid};P:${password};;`;
    };

    const generateWhatsappUrl = (info: WhatsappInfo): string => {
        if (!info.phone) return '';
        const phone = info.phone.replace(/\D/g, '');
        const message = encodeURIComponent(info.message);
        return `https://wa.me/${phone}?text=${message}`;
    };

    useEffect(() => {
        let data = '';

        switch (activeTab) {
            case 'url':
                data = formatUrl(urlInput);
                break;
            case 'text':
                data = textInput;
                break;
            case 'contact':
                if (contactInfo.firstName || contactInfo.lastName || contactInfo.phone || contactInfo.email) {
                    data = generateVCard(contactInfo);
                }
                break;
            case 'upi':
                if (upiInfo.upiId && validateUpiId(upiInfo.upiId)) {
                    data = generateUpiUrl(upiInfo);
                }
                break;
            case 'wifi':
                data = generateWifiString(wifiInfo);
                break;
            case 'whatsapp':
                data = generateWhatsappUrl(whatsappInfo);
                break;
            default:
                data = '';
        }

        setQrData(data);
        generateQRCode(data);
    }, [activeTab, urlInput, textInput, contactInfo, upiInfo, wifiInfo, whatsappInfo, foregroundColor, backgroundColor, size, level, selectedIcon]);

    const downloadQRCode = (): void => {
        if (!qrData) return;

        qrCode.download({ name: `qr-code-${activeTab}`, extension: 'png' });
    };


    const copyToClipboard = async (): Promise<void> => {
        if (qrData) {
            try {
                await navigator.clipboard.writeText(qrData);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        }
    };

    // Removed unused resetForm

    // Removed unused handlePhoneChange

    const handleAmountChange = (value: string): void => {
        // Allow only numbers and decimal point
        const cleaned = value.replace(/[^\d.]/g, '');
        setUpiInfo({ ...upiInfo, amount: cleaned });
    };

    const tabs = [
        { id: 'url', label: t('urlTab'), icon: <Link /> },
        { id: 'text', label: t('textTab'), icon: <MessageSquare /> },
        { id: 'contact', label: t('contactTab'), icon: <User /> },
        { id: 'upi', label: t('upiTab'), icon: <CreditCard /> },
        { id: 'wifi', label: t('wifiTab'), icon: <Wifi /> },
        { id: 'whatsapp', label: t('whatsappTab'), icon: <MessageCircle /> }
    ];


    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to br, #f3e5f5, #e3f2fd, #e8eaf6)' }}>
            <Header locale={locale} setLocale={setLocale} t={t} />
            <Container maxWidth="lg" sx={{ p: { xs: 1, sm: 2, md: 4 } }}>
                <Box sx={{ textAlign: 'center', my: { xs: 2, sm: 4, md: 6 } }}>
                    <Typography variant="h3" component="h1" sx={{
                        fontWeight: 'bold',
                        mb: 2,
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        color: '#222',
                        letterSpacing: 0.5,
                        lineHeight: 1.1
                    }}>
                        {renderAppTitle()}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } }}>
                        {t('appDescription')}
                    </Typography>
                </Box>

                <Paper elevation={8} sx={{ borderRadius: { xs: 2, md: 5 }, overflow: 'hidden' }}>
                    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
                        <Grid container spacing={3} alignItems="stretch">
                            {/* Form and Settings */}
                            <Grid item xs={12} lg={7} order={{ xs: 1, lg: 1 }} display="flex" flexDirection="column">
                                <Tabs
                                    value={activeTab}
                                    onChange={(_, newValue) => setActiveTab(newValue)}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    allowScrollButtonsMobile
                                    indicatorColor="primary"
                                    textColor="primary"
                                    sx={{
                                        '.MuiTab-root': {
                                            minWidth: { xs: 'auto', sm: '120px' },
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                        }
                                    }}
                                >
                                    {tabs.map((tab) => (
                                        <Tab key={tab.id} value={tab.id} label={tab.label} icon={tab.icon} iconPosition="start" />
                                    ))}
                                </Tabs>
                                <Box sx={{ mt: { xs: 2, md: 2 } }}>
                                    {activeTab === 'url' && <QrUrlForm t={t} urlInput={urlInput} setUrlInput={setUrlInput} />}
                                    {activeTab === 'text' && <QrTextForm t={t} textInput={textInput} setTextInput={setTextInput} />}
                                    {activeTab === 'contact' && <QrContactForm t={t} contactInfo={contactInfo} setContactInfo={setContactInfo} />}
                                    {activeTab === 'upi' && <QrUpiForm t={t} upiInfo={upiInfo} setUpiInfo={setUpiInfo} validateUpiId={validateUpiId} validateAmount={validateAmount} handleAmountChange={handleAmountChange} />}
                                    {activeTab === 'wifi' && <QrWifiForm t={t} wifiInfo={wifiInfo} setWifiInfo={setWifiInfo} />}
                                    {activeTab === 'whatsapp' && <QrWhatsappForm t={t} whatsappInfo={whatsappInfo} setWhatsappInfo={setWhatsappInfo} />}
                                </Box>
                                {/* ColorPicker will be rendered below QR code on mobile, here only for desktop */}
                                <Box
                                    mt={{ xs: 0, md: 5 }}
                                    sx={{
                                        display: { xs: 'none', md: 'block' },
                                        maxWidth: { md: 320 },
                                        mx: { md: 0 },
                                        mb: { md: 0 },
                                        zIndex: 1,
                                        position: 'relative',
                                    }}
                                >
                                    <ColorPicker
                                        t={t}
                                        foregroundColor={foregroundColor}
                                        setForegroundColor={setForegroundColor}
                                        backgroundColor={backgroundColor}
                                        setBackgroundColor={setBackgroundColor}
                                    />
                                </Box>
                                <Box mt={{ xs: 2, md: 4 }}>
                                    <AppearanceSettings
                                        t={t}
                                        size={size}
                                        setSize={setSize}
                                        level={level}
                                        setLevel={setLevel}
                                    />
                                </Box>
                                <Box mt={{ xs: 2, md: 4 }}>
                                    <IconPicker
                                        t={t}
                                        selectedIcon={selectedIcon}
                                        setSelectedIcon={setSelectedIcon}
                                    />
                                </Box>
                            </Grid>
                            {/* QR Code Display */}
                            <Grid item xs={12} lg={5} order={{ xs: 2, lg: 2 }} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                                <QrCodeDisplay
                                    qrData={qrData}
                                    qrRef={qrContainerRef}
                                    onDownload={downloadQRCode}
                                    onCopy={copyToClipboard}
                                    copied={copied}
                                    t={t}
                                />
                                {/* ColorPicker for mobile, below QR code */}
                                <Box
                                    mt={2}
                                    sx={{
                                        display: { xs: 'block', md: 'none' },
                                        width: '100%',
                                        maxWidth: 320,
                                        mx: 'auto',
                                        zIndex: 1,
                                        position: 'relative',
                                    }}
                                >
                                    <ColorPicker
                                        t={t}
                                        foregroundColor={foregroundColor}
                                        setForegroundColor={setForegroundColor}
                                        backgroundColor={backgroundColor}
                                        setBackgroundColor={setBackgroundColor}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>

                {/* Footer with Developer Credit */}
                <Box sx={{ textAlign: 'center', mt: { xs: 4, md: 6 }, py: 2 }}>
                    <Typography variant="body2">{t('footerText')}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 1 }}>
                        <Typography variant="body2">{t('developedBy')}</Typography>
                        <Heart style={{ fontSize: 16, color: 'red' }} /> by
                        <a href="https://www.linkedin.com/in/d3vjamal" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Typography variant="body2">{t('developerName')}</Typography>
                        </a>

                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default QRCodeGenerator;
