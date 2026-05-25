import { test, expect, request } from '@playwright/test';
import { geoLocationSchema, geoLocationErrorSchema } from './schema';
import { ApiClient } from '../../src/api/clients/ApiClient';
import Ajv from 'ajv';
import {GeocodingResponse} from "../API/geocoding-api.spec";
import { env } from '../../src/config/env';

const BASE_URL = env.apiBaseUrl;
const ajv = new Ajv();

test('Contract - validate response matches schema - successful status', { tag: ['@contract', '@success'] }, async ({ request }) => {
    const api = new ApiClient(request);
    const response = await api.get<GeocodingResponse>(BASE_URL, {
        name: 'Paris',
        count: 1,
        language: 'en',
        format: 'json',
    });

    expect(response.statusCode).toEqual(200);
    const data = await response.data;
    console.log(data);

    const validate = ajv.compile(geoLocationSchema);
    const isValid = validate(data.results[0]);

    expect(isValid, JSON.stringify(validate.errors, null, 2)).toBe(true);
});

test('Contract - validate response matches schema - error', { tag: ['@contract', '@error'] }, async ({ request }) => {
    const api = new ApiClient(request);

    const response = await api.get<unknown>(BASE_URL, {
        name: 'XYZ',
        count: 0,
        language: 'en',
        format: 'json',
    });

    const data = await response.data;
    console.log(data);

    expect(response.statusCode).toEqual(400);

    const validate = ajv.compile(geoLocationErrorSchema);
    const isValid = validate(data);

    expect(isValid, JSON.stringify(validate.errors, null, 2)).toBe(true);
});