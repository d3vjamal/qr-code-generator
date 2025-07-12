import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { SketchPicker } from 'react-color';

interface ColorPickerProps {
    t: (key: string) => string;
    foregroundColor: string;
    setForegroundColor: (color: string) => void;
    backgroundColor: string;
    setBackgroundColor: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
    t,
    foregroundColor,
    setForegroundColor,
    backgroundColor,
    setBackgroundColor,
}) => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                {t('colorPickerTitle')}
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={6}>
                    <Typography gutterBottom>{t('foregroundColor')}</Typography>
                    <SketchPicker
                        color={foregroundColor}
                        onChangeComplete={(color) => setForegroundColor(color.hex)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Typography gutterBottom>{t('backgroundColor')}</Typography>
                    <SketchPicker
                        color={backgroundColor}
                        onChangeComplete={(color) => setBackgroundColor(color.hex)}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default ColorPicker;