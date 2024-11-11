export function buildFormData(data, formData = new FormData(), parentKey) {
	if (data === null || data === undefined) {
		return formData;
	}

	const isPrimitive = val => Object(val) !== val;
	const isFile = val => val instanceof File || val instanceof Blob;

	if (isPrimitive(data) || data instanceof Date || isFile(data)) {
		if (parentKey === undefined) {
			throw new Error('FormData key cannot be empty');
		}
		formData.append(parentKey, data);
	} else if (Array.isArray(data)) {
		if (data.length === 0) {
			formData.append(parentKey + '[]', '');
		} else {
			data.forEach((value, index) => {
				const key = `${parentKey}[${index}]`;
				buildFormData(value, formData, key);
			});
		}
	} else {
		const keys = Object.keys(data);
		if (keys.length === 0) {
			formData.append(parentKey, '');
		} else {
			keys.forEach(key => {
				const value = data[key];
				const fullKey = parentKey !== undefined ? `${parentKey}[${key}]` : key;
				buildFormData(value, formData, fullKey);
			});
		}
	}

	return formData;
}
