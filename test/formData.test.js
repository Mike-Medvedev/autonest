// test/formData.test.js

import { buildFormData } from '../src/buildFormData.js';
import { formDataToNestedObject } from '../src/formDataToNestedObject.js';

describe('FormData Utilities', () => {
	test('Handles simple key-value pairs', () => {
		const data = { name: 'Michael', age: 24 };
		const formData = buildFormData(data);
		const flatData = Object.fromEntries(formData.entries());
		const reconstructedData = formDataToNestedObject(flatData);

		expect(reconstructedData).toEqual({
			name: 'Michael',
			age: '24',
		});
	});

	test('Handles nested objects', () => {
		const data = {
			user: {
				name: 'Michael',
				address: {
					city: 'NYC',
					zip: '10001',
				},
			},
		};
		const formData = buildFormData(data);
		const flatData = Object.fromEntries(formData.entries());
		const reconstructedData = formDataToNestedObject(flatData);

		expect(reconstructedData).toEqual({
			user: {
				name: 'Michael',
				address: {
					city: 'NYC',
					zip: '10001',
				},
			},
		});
	});

	test('Handles arrays', () => {
		const data = {
			tags: ['javascript', 'npm', 'testing'],
		};
		const formData = buildFormData(data);
		const flatData = Object.fromEntries(formData.entries());
		const reconstructedData = formDataToNestedObject(flatData);

		expect(reconstructedData).toEqual({
			tags: ['javascript', 'npm', 'testing'],
		});
	});

	test('Handles nested arrays and objects', () => {
		const data = {
			users: [
				{
					name: 'Michael',
					hobbies: ['skateboarding', 'programming'],
				},
				{
					name: 'Alice',
					hobbies: ['reading', 'hiking'],
				},
			],
		};
		const formData = buildFormData(data);
		const flatData = Object.fromEntries(formData.entries());
		const reconstructedData = formDataToNestedObject(flatData);

		expect(reconstructedData).toEqual(data);
	});

	test('Handles null and undefined values', () => {
		const data = {
			name: 'Michael',
			age: null,
			email: undefined,
		};
		const formData = buildFormData(data);
		const flatData = Object.fromEntries(formData.entries());
		const reconstructedData = formDataToNestedObject(flatData);

		expect(reconstructedData).toEqual({
			name: 'Michael',
			// age and email are not included as FormData skips null/undefined
		});
	});

	test('Handles empty objects and arrays', () => {
		const data = {
			emptyObject: {},
			emptyArray: [],
		};
		const formData = buildFormData(data);
		const flatData = Object.fromEntries(formData.entries());
		const reconstructedData = formDataToNestedObject(flatData);

		expect(reconstructedData).toEqual(data);
	});

	test('Throws error on primitive data without parentKey', () => {
		expect(() => {
			buildFormData('just a string');
		}).toThrow('FormData key cannot be empty');
	});

	test('Handles Dates', () => {
		const date = new Date('2024-11-10T00:00:00Z');
		const data = {
			eventDate: date,
		};
		const formData = buildFormData(data);
		const flatData = Object.fromEntries(formData.entries());
		const reconstructedData = formDataToNestedObject(flatData);

		expect(new Date(reconstructedData.eventDate).toISOString()).toEqual(date.toISOString());
	});

	test('Handles deeply nested structures', () => {
		const data = {
			level1: {
				level2: {
					level3: {
						level4: {
							value: 'deep',
						},
					},
				},
			},
		};
		const formData = buildFormData(data);
		const flatData = Object.fromEntries(formData.entries());
		const reconstructedData = formDataToNestedObject(flatData);

		expect(reconstructedData).toEqual(data);
	});

	test('Handles special characters in keys', () => {
		const data = {
			'user-name': 'Michael',
			'user info': {
				'first name': 'Michael',
				'last name': 'Medvedev',
			},
		};
		const formData = buildFormData(data);
		const flatData = Object.fromEntries(formData.entries());
		const reconstructedData = formDataToNestedObject(flatData);

		expect(reconstructedData).toEqual(data);
	});

	test('Handles numbers and booleans', () => {
		const data = {
			count: 42,
			isActive: true,
		};
		const formData = buildFormData(data);
		const flatData = Object.fromEntries(formData.entries());
		const reconstructedData = formDataToNestedObject(flatData);

		expect(reconstructedData).toEqual({
			count: '42',
			isActive: 'true',
		});
	});

	test('Handles circular references (should throw an error)', () => {
		const data = {};
		data.self = data; // Circular reference

		expect(() => {
			buildFormData(data);
		}).toThrow();
	});

	test('Handles empty strings as keys and values', () => {
		const data = {
			'': '',
		};
		const formData = buildFormData(data);
		const flatData = Object.fromEntries(formData.entries());
		const reconstructedData = formDataToNestedObject(flatData);

		expect(reconstructedData).toEqual({
			'': '',
		});
	});

	test('Handles large datasets', () => {
		const largeArray = Array.from({ length: 1000 }, (_, i) => i);
		const data = {
			numbers: largeArray,
		};
		const formData = buildFormData(data);
		const flatData = Object.fromEntries(formData.entries());
		const reconstructedData = formDataToNestedObject(flatData);

		expect(reconstructedData.numbers.length).toBe(1000);
		expect(reconstructedData.numbers[999]).toBe('999');
	});

	test('Handles sample flat data (server-side scenario)', () => {
		const flatData = {
			'user[name]': 'Alice',
			'user[address][street]': '11 Tom Road',
			'user[address][city]': 'NYC',
			'user[address][zip]': '10001',
			age: '30',
			'preferences[colors][0]': 'red',
			'preferences[colors][1]': 'blue',
			'preferences[notifications]': 'true',
		};
		const reconstructedData = formDataToNestedObject(flatData);

		expect(reconstructedData).toEqual({
			user: {
				name: 'Alice',
				address: {
					street: '11 Tom Road',
					city: 'NYC',
					zip: '10001',
				},
			},
			age: '30',
			preferences: {
				colors: ['red', 'blue'],
				notifications: 'true',
			},
		});
	});
});
