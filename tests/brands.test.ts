import request from "supertest";

const baseUrl = 'https://api.practicesoftwaretesting.com';

describe('Test GET brands API', () => {
    it('should get brands with correct schema', async () => {
        const response = await request(baseUrl).get('/brands'); // async/await promise GET brands
        expect(response.status).toBe(200);
        const data = response.body;
        expect(data.length).toBeGreaterThanOrEqual(1); // Assert a brand is returned
        expect(data[0]).toHaveProperty('id'); // Assert brand has id
        expect(data[0]).toHaveProperty('name'); // Assert brand has name
        expect(data[0]).toHaveProperty('slug'); // Assert brand has slug
    });
});
describe('Test POST brands API', () => {
    it('should post new brand', async () => {
        let newBrand = {
            name: "Branding 100",
            slug: "branding-100",
        };
        let response = await request(baseUrl)
            .post('/brands')
            .send(newBrand)
            .set('Accept', 'application/json');

        // If status is 422 (Unprocessable), append date now and try again
        if (response.status === 422) {
            newBrand = {
                ...newBrand,
                name: newBrand.name + " " + Date.now(),
                slug: newBrand.slug + "-" + Date.now(),
            };
            response = await request(baseUrl)
                .post('/brands')
                .send(newBrand)
                .set('Accept', 'application/json');
        }
        expect(response.status).toBe(201);
        const data = response.body;
        expect(data).toHaveProperty('id');
        expect(data.name).toBe(newBrand.name);
        expect(data.slug).toBe(newBrand.slug);
    });
});

describe('Test GET search brands API with query', () => {
    it('should return brands by name', async () => {
        const searchQuery = 'Branding 100';
        const response = await request(baseUrl)
            .get('/brands/search')
            .query({ q: searchQuery });
        expect(response.status).toBe(200);
        const data = response.body;
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThanOrEqual(1);
        expect(data.some((brand: any) => brand.name === searchQuery)).toBe(true);
    });
});

describe('Test GET search brands API with query', () => {
    it('should return query status 200 with empty results', async () => {
        const searchQuery = 'NoBrandName';
        const response = await request(baseUrl)
            .get('/brands/search')
            .query({ q: searchQuery });
        expect(response.status).toBe(200);
        const data = response.body;
        expect(Object.keys(data).length).toBe(0);
    });
});