import React, { useState } from 'react';
import { User, Link, Phone, Mail, Building } from 'lucide-react';
import './QrContactForm.css';

interface ContactInfo {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    organization: string;
    url: string;
}

interface QrContactFormProps {
    t: (key: string) => string;
    contactInfo: ContactInfo;
    setContactInfo: React.Dispatch<React.SetStateAction<ContactInfo>>;
}

const QrContactForm: React.FC<QrContactFormProps> = ({ t, contactInfo, setContactInfo }) => {
    const [errors, setErrors] = useState<Partial<ContactInfo>>({});

    const validate = (name: string, value: string) => {
        let error = '';
        if (name === 'firstName' && !value) {
            error = t('firstNameRequired');
        } else if (name === 'lastName' && !value) {
            error = t('lastNameRequired');
        } else if (name === 'email') {
            if (!value) {
                error = t('emailRequired');
            } else if (!/\S+@\S+\.\S+/.test(value)) {
                error = t('emailInvalid');
            }
        } else if (name === 'phone') {
            if (!value) {
                error = t('phoneRequired');
            } else if (!/^\d{10,15}$/.test(value)) {
                error = t('phoneInvalid');
            }
        }
        return error;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setContactInfo({ ...contactInfo, [name]: value });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const error = validate(name, value);
        setErrors({ ...errors, [name]: error });
    };

    return (
        <form className="qr-contact-form">
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="firstName">{t('firstName')}</label>
                    <div className="input-with-icon">
                        <User />
                        <input type="text" id="firstName" name="firstName" value={contactInfo.firstName} onChange={handleChange} onBlur={handleBlur} placeholder={t('firstNamePlaceholder')} />
                    </div>
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">{t('lastName')}</label>
                    <div className="input-with-icon">
                        <User />
                        <input type="text" id="lastName" name="lastName" value={contactInfo.lastName} onChange={handleChange} onBlur={handleBlur} placeholder={t('lastNamePlaceholder')} />
                    </div>
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="phone">{t('phoneNumber')}</label>
                <div className="input-with-icon">
                    <Phone />
                    <input type="tel" id="phone" name="phone" value={contactInfo.phone} onChange={handleChange} onBlur={handleBlur} placeholder={t('phonePlaceholder')} />
                </div>
                {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="email">{t('emailAddress')}</label>
                <div className="input-with-icon">
                    <Mail />
                    <input type="email" id="email" name="email" value={contactInfo.email} onChange={handleChange} onBlur={handleBlur} placeholder={t('emailPlaceholder')} />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="organization">{t('organization')}</label>
                <div className="input-with-icon">
                    <Building />
                    <input type="text" id="organization" name="organization" value={contactInfo.organization} onChange={handleChange} placeholder={t('organizationPlaceholder')} />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="url">{t('website')}</label>
                <div className="input-with-icon">
                    <Link />
                    <input type="url" id="url" name="url" value={contactInfo.url} onChange={handleChange} placeholder={t('websitePlaceholder')} />
                </div>
            </div>
        </form>
    );
};

export default QrContactForm;
