import { expect } from 'chai';
import 'mocha';
import TelemetryClient from './telemetry-client';
import TelemetryDiagnosticControls from './telemetry-diagnostic-controls';

describe('Telemetry System', () => {

	describe('TelemetryDiagnosticControls', () => {

		it('CheckTransmission should send a diagnostic message', () => {
			let message = '';
			const client = {
				diagnosticMessage: () => 'AT#UD',
				getOnlineStatus: () => true,
				connect: (_: string) => undefined,
				receive: () => undefined,
				send: (m: string) => { message = m },
				disconnect: () => undefined,
			} as any as TelemetryClient;

			const controls = new TelemetryDiagnosticControls(client);
			controls.checkTransmission();

			let exp = 'AT#UD';

			expect(message).to.eql(exp);
		});

		it('CheckTransmission should receive the correct status message response', () => {
			const client = {
				diagnosticMessage: () => 'AT#UD',
				getOnlineStatus: () => true,
				connect: (_: string) => undefined,
				receive: () => 'hello all',
				send: () => '',
				disconnect: () => undefined,
			} as any as TelemetryClient;
			const controls = new TelemetryDiagnosticControls(client);
			controls.checkTransmission();

			let exp = "hello all";

			expect(controls.readDiagnosticInfo()).to.eql(exp);
		});

		it('CheckTransmission should throw if client is not connected', () => {
			const client = {
				diagnosticMessage: () => 'AT#UD',
				getOnlineStatus: () => false,
				connect: (_: string) => undefined,
				receive: () => 'hello all',
				send: () => '',
				disconnect: () => undefined,
			} as any as TelemetryClient;
			const controls = new TelemetryDiagnosticControls(client);

			expect(controls.checkTransmission).to.throw();
		});

	});
});