export function formDataToNestedObject(data) {
	const obj = {};

	for (let [key, value] of Object.entries(data)) {
		const keys = parseFormDataKey(key);
		assignNestedValue(obj, keys, value);
	}

	return obj;
}

function parseFormDataKey(key) {
	if (key === '') {
		return [''];
	}
	const keyPattern = /([^\[\]]+)|(\[\])/g;
	const matches = key.match(keyPattern) || [];
	return matches.map(k => (k === '[]' ? '' : k.replace(/^\[|\]$/g, '')));
}

function assignNestedValue(obj, keys, value) {
	let current = obj;
	let parent = null;
	let lastKey = null;

	keys.forEach((key, index) => {
		const isArrayKey = key === '';

		if (index === keys.length - 1) {
			if (isArrayKey) {
				if (!Array.isArray(current)) {
					if (parent && lastKey !== null) {
						parent[lastKey] = [];
						current = parent[lastKey];
					} else {
						Object.keys(current).forEach(k => delete current[k]);
						current = [];
						obj = current;
					}
				}
				current.push(value);
			} else {
				current[key] = value;
			}
		} else {
			if (isArrayKey) {
				if (!Array.isArray(current)) {
					if (parent && lastKey !== null) {
						parent[lastKey] = [];
						current = parent[lastKey];
					} else {
						Object.keys(current).forEach(k => delete current[k]);
						current = [];
						obj = current;
					}
				}
			} else {
				const nextKeyIsIndex = keys[index + 1] === '' || /^\d+$/.test(keys[index + 1]);

				if (!current[key]) {
					current[key] = nextKeyIsIndex ? [] : {};
				}
				parent = current;
				lastKey = key;
				current = current[key];
			}
		}
	});
}
