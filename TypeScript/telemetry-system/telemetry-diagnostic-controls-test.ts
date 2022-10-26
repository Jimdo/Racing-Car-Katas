import { expect } from 'chai';
import 'mocha';
import TelemetryClient from './telemetry-client';
import TelemetryDiagnosticControls from './telemetry-diagnostic-controls';

describe('Telemetry System', () => {

	describe('TelemetryDiagnosticControls', () => {

		const clientMock = {
			diagnosticMessage: () => undefined,
			getOnlineStatus: () => true,
			connect: (_: string) => undefined,
			receive: () => undefined,
			send: (_: string) => undefined,
			disconnect: () => undefined,
		} as any as TelemetryClient;

		it('CheckTransmission should send a diagnostic message', () => {
			let message = '';
			const client = {
				...clientMock,
				diagnosticMessage: () => 'THE_DIAGNOSTIC_MESSAGE',
				send: (m: string) => { message = m },
			} as any as TelemetryClient;

			const controls = new TelemetryDiagnosticControls(client);

			controls.checkTransmission();

			expect(message).to.eql('THE_DIAGNOSTIC_MESSAGE');
		});

		it('CheckTransmission should receive the correct status message response', () => {
			const client = {
				...clientMock,
				receive: () => 'hello all',
			} as any as TelemetryClient;

			const controls = new TelemetryDiagnosticControls(client);

			controls.checkTransmission();

			expect(controls.readDiagnosticInfo()).to.eql("hello all");
		});

		it('CheckTransmission should throw if client is not connected', () => {
			const client = {
				...clientMock,
				getOnlineStatus: () => false,
			} as any as TelemetryClient;

			const controls = new TelemetryDiagnosticControls(client);

			expect(controls.checkTransmission).to.throw();
		});

		it('CheckTransmission should retry to connect', () => {
			let retryCount = 0;
			const client = {
				...clientMock,
				getOnlineStatus: () => retryCount == 3,
				connect: (_: string) => { retryCount++ },
			} as any as TelemetryClient;

			const controls = new TelemetryDiagnosticControls(client);

			controls.checkTransmission();

			expect(retryCount).to.eql(3);
		});

	});
});