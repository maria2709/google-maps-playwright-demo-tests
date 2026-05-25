import { test, expect, request } from '@playwright/test';
import { ApiClient } from '../../src/api/clients/ApiClient';
import { env } from '../../src/config/env';

const BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';

test.describe('Geocoding - search for locations', () => {

    let api: ApiClient;

    interface GeocodingResult {
        id: number;
        name: string;
        latitude: number;
        longitude: number;
        elevation: number;
        feature_code: string;
        country_code: string;
        admin1_id: number;
        admin2_id: number;
        admin3_id: number;
        admin4_id: number;
        timezone: string;
        population: number;
        postcodes: unknown[];          // the API returns an array (contents vary)
        country_id: number;
        country: string;
        admin1: string;
        admin2: string;
        admin3: string;
        admin4: string;
    }

    interface GeocodingResponse {
        results: GeocodingResult[];
        generationtime_ms: number;
    }

    test.beforeEach(({ request }) => {
        api = new ApiClient(request);
    });

    test('Search for Paris and return data ', { tag: ['@positive'] }, async () => {
        const response = await api.get<GeocodingResponse>(BASE_URL, {
            name: 'Paris',
            count: 1,
            language: 'en',
            format: 'json',
        });

        api.validateStatus(response, 200);
        expect(Array.isArray(response.data.results)).toBeTruthy();
        expect(response.data.results.length).toBe(1);

        const data = response.data;
        console.log(data);

        expect(data.results[0].name).toEqual('Paris');
        expect(data.results[0].country_code).toEqual('FR');

        expect(typeof data.results[0].latitude).toBe('number');
        expect(typeof data.results[0].longitude).toBe('number');

        // ── optional: reject NaN / Infinity ───────────────────────
        expect(Number.isFinite(data.results[0].latitude)).toBe(true);
        expect(Number.isFinite(data.results[0].longitude)).toBe(true);
    });

    test('Search for London and validate at least one result is return', { tag: ['@positive'] }, async () => {
        const response = await api.get<GeocodingResponse>(BASE_URL, {
            name: 'London',
            language: 'en',
            format: 'json',
        });

        api.validateStatus(response, 200);

        expect(Array.isArray(response.data.results)).toBeTruthy();
        expect(response.data.results.length).toBeGreaterThanOrEqual(1);

        const data = response.data;
        console.log(data);

        const countries = response.data.results.map(i => i.country_code);
        console.log(countries);
        console.log(typeof countries);
        expect(countries).toContain('GB');

    });

    test('Search for Paris and filter by country', { tag: ['@positive'] }, async () => {
        const response = await api.get<GeocodingResponse>(BASE_URL, {
            name: 'Paris',
            countryCode: 'FR',
            count: 1,
            language: 'en',
            format: 'json',
        });

        api.validateStatus(response, 200);

        expect(Array.isArray(response.data.results)).toBeTruthy();
        expect(response.data.results.length).toEqual(1);

        const data = response.data;
        console.log(data);

        expect(data.results[0].country_code).toEqual('FR');

    });

    test('Boundary or weak search term', { tag: ['@negative'] }, async () => {
        const response = await api.get<GeocodingResponse>(BASE_URL, {
            name: 'x',
            countryCode: 'FR',
            count: 1,
            language: 'en',
            format: 'json',
        });

        api.validateStatus(response, 200);

        const data = response.data;
        console.log(data);

        expect(data.results).toBeUndefined();

    });

    test('Invalid parameter', { tag: ['@negative'] }, async () => {
        const response = await api.get<GeocodingResponse>(BASE_URL, {
            name: 'Paris',
            count: 0,
            language: 'en',
            format: 'json',
        });

        api.validateStatus(response, 400);

        const data = response.data;
        console.log(data);

        expect(data.reason).toEqual('Parameter count must be between 1 and 100.');
        expect(data.error).toBe(true);
    });

});