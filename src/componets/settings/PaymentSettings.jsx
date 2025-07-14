import React, { useState, useEffect } from 'react';
import InputField from './forms/InputField';
import SettingsFormSection from './forms/SettingsFormSection';

const PaymentSettings = ({ initialData, onSave, isLoading, sectionKey, lastSaved }) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? (parseFloat(value) || 0) : value }));
  };

  return (
    <SettingsFormSection title="Payment Details" onSave={() => onSave(sectionKey, formData)} isLoading={isLoading} sectionKey={sectionKey} lastSaved={lastSaved}>
      <InputField label="Account Name" id="accountName" name="accountName" value={formData.accountName || ''} onChange={handleChange} placeholder="e.g., John Doe" required />
      <InputField label="Account Number" id="accountNumber" name="accountNumber" value={formData.accountNumber || ''} onChange={handleChange} placeholder="e.g., 1234567890" required />
      <InputField label="Bank Name" id="bankName" name="bankName" value={formData.bankName || ''} onChange={handleChange} placeholder="e.g., Commercial Bank of Ethiopia" required />

      <InputField label="Telebirr Acc Number" id="telebirrAccountNumber" name="telebirrNumber" value={formData.telebirrNumber || ''} onChange={handleChange} placeholder="e.g., 0912345678" required />
      <InputField label="Telebirr Acc Name" id="telebirrAccountName" name="telebirrName" value={formData.telebirrName || ''} onChange={handleChange} placeholder="e.g., 0912345678" required />
    </SettingsFormSection>
  );
};

export default PaymentSettings;