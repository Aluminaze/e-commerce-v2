export function jwtExpToDate(token: string): Date | null {
	try {
		const payloadB64 = token.split('.')[1];
		if (!payloadB64) return null;
		const json = JSON.parse(
			Buffer.from(payloadB64, 'base64url').toString('utf8')
		);
		if (typeof json.exp === 'number') return new Date(json.exp * 1000);
		return null;
	} catch {
		return null;
	}
}
