export const geoLocationSchema = {
    type: 'object',
    required: ['id', 'name', 'latitude', 'longitude', 'country_code', 'country', 'feature_code', 'timezone', 'population'],
    properties: {
        id: { type: 'number'},
        name: { type: 'string'},
        latitude: { type: 'number'},
        longitude: { type: 'number'},
        feature_code: { type: 'string'},
        country_code: { type: 'string'},
        timezone: { type: 'string'},
        population: { type: 'number'},
        country: { type: 'string'}
    }
}

export const geoLocationErrorSchema = {
    type: 'object',
    required: ['reason', 'error'],
    properties: {
        reason: { type: 'string'},
        error: { type: 'boolean'}
    }
}