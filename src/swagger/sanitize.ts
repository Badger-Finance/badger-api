import jsonfile from 'jsonfile';

const file = './swagger.json';

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
