import { respond } from '../../src/util/util';

describe('util', () => {
	describe('respond', () => {
		const baseRes = {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'OPTIONS,GET',
				'Access-Control-Allow-Headers': 'Content-Type',
			},
		};

		test('200', () => {
			const res = respond(200);

			expect(res).toStrictEqual({
				statusCode: 200,
				...baseRes,
			});
		});
	});
});
