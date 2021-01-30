import jsonfile from 'jsonfile';

/**
 * This file should never be invoked manually.
 * Path is set for Github Actions to properly sanitize
 * Swagger documentation for upload to production documentation
 * bucket.
 */
const file = './src/swagger/swagger.json';

jsonfile.readFile(file, (err: NodeJS.ErrnoException | null, obj: any) => {
	if (err) {
		console.error(err);
	} else {
		const result = JSON.parse(
			JSON.stringify(obj, function (key, value) {
				return key !== 'options' ? value : undefined;
			}),
		);
		jsonfile.writeFile(file, result, function (err) {
			err ? console.error(err) : console.log('swagger.json exported successfully.');
		});
	}
});
