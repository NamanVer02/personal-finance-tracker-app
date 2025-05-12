import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, TextInput, FlatList } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { uploadCsv } from 'services/dataService';
import BaseModal from './BaseModal';
import { useTheme } from 'contexts/ThemeContext';
import { useThemeStyles } from 'contexts/ThemeUtils';
import * as FileSystem from 'expo-file-system';

// Define proper types for the component props
interface CsvUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onUploadSuccess: (data: any) => void;
}

interface CsvPreviewData {
  headers: string[];
  rows: string[][];
}

const CsvUploadModal = ({ visible, onClose, onUploadSuccess }: CsvUploadModalProps) => {
  const { isDarkMode } = useTheme();
  const styles = useThemeStyles();
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<CsvPreviewData | null>(null);
  const [entryCount, setEntryCount] = useState(0);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      setEntryCount(0);
      return;
    }

    generatePreview();
  }, [file]);

  const generatePreview = async () => {
    if (!file || !file.uri) return;

    try {
      const content = await FileSystem.readAsStringAsync(file.uri);
      const lines = content.split('\n').filter((line) => line.trim().length > 0);

      if (lines.length === 0) {
        setError('CSV file appears to be empty');
        return;
      }

      // Parse headers
      const headers = parseCSVLine(lines[0]);

      // Parse the first few rows for preview
      const previewRows = [];
      const maxPreviewRows = Math.min(5, lines.length - 1);

      for (let i = 1; i <= maxPreviewRows; i++) {
        previewRows.push(parseCSVLine(lines[i]));
      }

      setPreview({
        headers,
        rows: previewRows,
      });

      // Count entries (excluding header)
      setEntryCount(lines.length - 1);
    } catch (err) {
      console.error('Error generating preview:', err);
      setError('Failed to generate preview');
    }
  };

  const parseCSVLine = (line: string): string[] => {
    // Simple CSV parsing - this doesn't handle quoted fields with commas
    return line.split(',').map((item) => item.trim());
  };

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/csv',
        copyToCacheDirectory: true,
      });

      if (result.canceled === false) {
        // DocumentPicker returns an array of files in newer versions
        const selectedFile = result.assets[0];

        if (selectedFile.name.endsWith('.csv')) {
          setFile(selectedFile);
          setError('');
        } else {
          setFile(null);
          setError('Please select a valid CSV file');
        }
      }
    } catch (err) {
      console.error('Error picking document:', err);
      setError('Failed to pick document');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call the uploadCsv function directly with the file
      const response = await uploadCsv(file as any);

      setLoading(false);

      if (response.ok) {
        setFile(null);
        onUploadSuccess(response.data);
        onClose();
      } else {
        setError(
          typeof response.error === 'object'
            ? response.error.message || 'Error uploading CSV'
            : response.error || 'Failed to upload CSV'
        );
      }
    } catch (error: any) {
      setLoading(false);
      setError(
        typeof error === 'object' ? error.message || 'An unexpected error occurred' : String(error)
      );
      console.error('Upload error:', error);
    }
  };

  const renderPreview = () => {
    if (!preview) return null;

    return (
      <View
        className={`mt-4 rounded-xl border ${styles.borderColor} p-4`}
        style={{ backgroundColor: isDarkMode ? '#374151' : '#f9fafb' }}>
        <Text className={`mb-2 font-bold ${styles.textPrimary}`}>File Summary:</Text>

        {/* File information */}
        <View className="mb-3">
          <Text className={`${styles.textSecondary}`}>
            <Text className={`font-semibold ${styles.textPrimary}`}>Filename:</Text> {file.name}
          </Text>
          <Text className={`${styles.textSecondary}`}>
            <Text className={`font-semibold ${styles.textPrimary}`}>Size:</Text>{' '}
            {(file.size / 1024).toFixed(2)} KB
          </Text>
          <Text className={`${styles.textSecondary}`}>
            <Text className={`font-semibold ${styles.textPrimary}`}>Records:</Text> {entryCount}
          </Text>
        </View>

        {/* Headers information */}
        <Text className={`mb-1 font-medium ${styles.textPrimary}`}>Columns detected:</Text>
        <View className={`flex-row flex-wrap pb-2`}>
          {preview.headers.map((header, index) => (
            <View
              key={index}
              className={`mb-2 mr-2 rounded-lg ${
                isDarkMode ? 'bg-purple-800' : 'bg-purple-100'
              } px-2 py-1`}>
              <Text className={`${isDarkMode ? 'text-white' : 'text-purple-800'}`}>{header}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title="Import Transactions"
      actionButton={{
        label: loading ? 'Uploading...' : 'Import Transactions',
        onPress: handleUpload,
      }}>
      {/* Instructions */}
      <Text className={`mb-4 ${styles.textSecondary}`}>
        Upload a CSV file with your transactions. The file should have these columns: label, type,
        amount, category, date (YYYY-MM-DD format)
      </Text>

      {/* File Upload Area */}
      <TouchableOpacity
        onPress={handleFilePick}
        className={`mb-6 items-center justify-center rounded-xl border-2 border-dashed ${
          isDarkMode ? 'border-gray-600' : 'border-gray-300'
        } p-6`}
        style={{ backgroundColor: isDarkMode ? '#374151' : '#f9fafb' }}>
        <Text>
          <Octicons name="upload" size={40} color={isDarkMode ? '#9ca3af' : '#9ca3af'} />
        </Text>
        <Text className={`mt-2 font-medium ${styles.textSecondary}`}>
          {file ? file.name : 'Tap to select a CSV file'}
        </Text>
      </TouchableOpacity>

      {/* File Preview */}
      {renderPreview()}

      {/* Error Message */}
      {error ? (
        <View className="mt-4 flex-row items-center">
          <Text>
            <Octicons name="alert" size={16} color="#ef4444" />
          </Text>
          <Text className={`ml-2 text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
            {error}
          </Text>
        </View>
      ) : null}

      {/* Loading indicator */}
      {loading && (
        <View className="items-center justify-center py-2">
          <ActivityIndicator size="small" color="#8b5cf6" />
        </View>
      )}
    </BaseModal>
  );
};

export default CsvUploadModal;
