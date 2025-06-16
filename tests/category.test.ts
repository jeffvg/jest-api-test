import request from "supertest";

const baseUrl = 'https://api.practicesoftwaretesting.com';

describe('Test GET categories API', () => {
    it('should get categories with correct schema', async () => {
        const response = await request(baseUrl).get('/categories'); // async/await promise GET categories
        expect(response.status).toBe(200);
        const data = response.body;
        expect(data.length).toBeGreaterThanOrEqual(1); // Assert category is returned
        expect(data[0]).toHaveProperty('id'); // Assert category has id
        expect(data[0]).toHaveProperty('name'); // Assert category has name
        expect(data[0]).toHaveProperty('slug'); // Assert category has slug
        expect(data[0]).toHaveProperty('parent_id'); // Assert category has parent_id
    });
});

describe('Test POST categories API', () => {
    it('should post new category', async () => {
        let newCategory = {
            name: "Category 100",
            slug: "Category-100",
        };
        let response = await request(baseUrl)
            .post('/categories')
            .send(newCategory)
            .set('Accept', 'application/json');

        // If status is 422 (Unprocessable), append date now and try again
        if (response.status === 422) {
            newCategory = {
                ...newCategory,
                name: newCategory.name + " " + Date.now(),
                slug: newCategory.slug + "-" + Date.now(),
            };
            response = await request(baseUrl)
                .post('/categories')
                .send(newCategory)
                .set('Accept', 'application/json');
        }
        expect(response.status).toBe(201);
        const data = response.body;
        expect(data).toHaveProperty('id');
        expect(data.name).toBe(newCategory.name);
        expect(data.slug).toBe(newCategory.slug);
    });
});

describe('Test GET search categories API with query', () => {
    it('should return categories by name', async () => {
        const searchQuery = 'Hand Tools';
        const response = await request(baseUrl)
            .get('/categories/search')
            .query({ q: searchQuery });
        expect(response.status).toBe(200);
        const data = response.body;
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThanOrEqual(1);
        expect(data.some((category: any) => category.name === searchQuery)).toBe(true);
    });
});

describe('Test GET search categories API with query', () => {
    it('should return query status 200 with empty results', async () => {
        const searchQuery = 'NoCategoryName';
        const response = await request(baseUrl)
            .get('/categories/search')
            .query({ q: searchQuery });
        expect(response.status).toBe(200);
        const data = response.body;
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBe(0); // Expect no results
    });
});

describe('Test categories API', () => {
    it('should post new category name', async () => {
        let newCategory = {
            name: "Reciprocating Saw",
            slug: "reciprocating-saw",
        };
        let response = await request(baseUrl)
            .post('/categories')
            .send(newCategory)
            .set('Accept', 'application/json');

        // If status is 422 (Unprocessable), append date now and try again
        if (response.status === 422) {
            newCategory = {
                ...newCategory,
                name: newCategory.name + " " + Date.now(),
                slug: newCategory.slug + "-" + Date.now(),
            };
            response = await request(baseUrl)
                .post('/categories')
                .send(newCategory)
                .set('Accept', 'application/json');
        }
        expect(response.status).toBe(201);
        const data = response.body;
        expect(data).toHaveProperty('id');
        expect(data.name).toBe(newCategory.name);
        expect(data.slug).toBe(newCategory.slug);
    }
    );
    it('should search new category and update(PUT) name by id', async () => {
        const searchQuery = 'Reciprocating Saw';
        const response = await request(baseUrl)
            .get('/categories/search')
            .query({ q: searchQuery });
        expect(response.status).toBe(200);
        const data = response.body;
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThanOrEqual(1);
        expect(data[0]).toHaveProperty('id'); // Assert category has id
        const categoryId = data[0].id;  // Store category ID for further tests     

        // PATCH(PUT) name by categoryID stored in categoryId variable
        const updatedName = "Cordless " + searchQuery; // appends to beginning of name
        // const updatedName = searchQuery + " Cordless"; // appends to end of name
        const putResponse = await request(baseUrl)
            .put(`/categories/${categoryId}`)
            .send({ name: updatedName, slug: updatedName.toLowerCase().replace(/\s+/g, '-') }) // convert slug updatedName to lowercase and replace spaces with hyphens
            .set('Accept', 'application/json');
        expect(putResponse.status).toBe(200);
        expect(putResponse.body).toHaveProperty('success', true);
    });
});