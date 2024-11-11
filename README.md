# Renest

A lightweight utility for converting deeply nested data structures to `FormData` objects and back, preserving the original structure.

## Features

- Convert any deeply nested data structure into a `FormData` object.
- Reconstruct the original data structure from a `FormData` object.
- Supports arrays, objects, primitives, dates, and files (`File`/`Blob`).
- Handles empty objects, arrays, and special characters in keys.

## Installation

```bash
npm install renest
```

## Usage

### Importing the functions

```bash
import { buildFormData, formDataToNestedObject } from 'renest';
```

### Converting Data to FormData

```bash
const data = {
  user: {
    name: 'Michael',
    age: 24,
    hobbies: ['skateboarding', 'programming'],
    profilePicture: new File([/* file data */], 'profile.jpg', { type: 'image/jpeg' }),
    address: {
      city: 'NYC',
      zip: '10001',
    },
  },
};

const formData = buildFormData(data);

// Send formData via fetch or XMLHttpRequest
fetch('/api/upload', {
  method: 'POST',
  body: formData,
});
```

### Reconstructing the Nested Object from FormData

```bash
const reconstructedData = formDataToNestedObject(formData);

console.log(reconstructedData);
// Output:
// {
//   user: {
//     name: 'Michael',
//     age: '24',
//     hobbies: ['skateboarding', 'programming'],
//     profilePicture: File { ... },
//     address: {
//       city: 'NYC',
//       zip: '10001',
//     },
//   },
// }
```

# API

## `buildFormData(data, formData = new FormData(), parentKey)`

Converts a nested data structure into a `FormData` object.

### Parameters

- **data** (required): The data structure to convert.
- **formData** (optional): An existing `FormData` object to append to.
- **parentKey** (optional): Used internally for recursion.

### Returns

A `FormData` object representing the data.

---

## `formDataToNestedObject(formData)`

Reconstructs the original nested data structure from a `FormData` object.

### Parameters

- **formData** (required): The `FormData` object to convert.

### Returns

The reconstructed data structure.

## Examples

### Handling Files

```bash
const data = {
  document: new File([/* file data */], 'doc.pdf', { type: 'application/pdf' }),
};

const formData = buildFormData(data);

// Reconstructing
const reconstructedData = formDataToNestedObject(formData);

console.log(reconstructedData.document); // File object
```

## TESTING

Run tests to ensure everything is working correctly.

```bash
npm test
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
