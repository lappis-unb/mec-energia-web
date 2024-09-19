import { formatCnpj } from "../src/utils/formatters/formatCnpj";
import '@testing-library/jest-dom'

describe('formatCnpj', () => {
    it('should return an empty string for undefined input', () => {
        expect(formatCnpj(undefined)).toBe('');
    });

    it('should return an empty string for null input', () => {
        expect(formatCnpj(null)).toBe('');
    });

    it('should return an empty string for empty string input', () => {
        expect(formatCnpj('')).toBe('');
    });

    it('should format a CNPJ correctly', () => {
        expect(formatCnpj('12345678000195')).toBe('12.345.678/0001-95');
    });

    it('should handle CNPJ shorter than 14 characters', () => {
        expect(formatCnpj('123')).toBe('12.3');
    });

    it('should handle CNPJ longer than 14 characters by trimming it', () => {
        expect(formatCnpj('123456780001950000')).toBe('12.345.678/0001-95');
    });
});
