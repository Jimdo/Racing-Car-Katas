import TelemetryClient from './telemetry-client';

export default class TelemetryDiagnosticControls {
	private diagnosticChannelConnectionString: string;
	private diagnosticInfo: string;

	constructor(private readonly telemetryClient: TelemetryClient) {
		this.diagnosticChannelConnectionString = '*111#';
		this.diagnosticInfo = '';
	}

	public readDiagnosticInfo() {
		return this.diagnosticInfo;
	}

	public writeDiagnosticInfo(newValue: string) {
		this.diagnosticInfo = newValue;
	}

	public checkTransmission() {
		this.writeDiagnosticInfo('')
		this.connect();

		this.telemetryClient.send(this.telemetryClient.diagnosticMessage());
		this.writeDiagnosticInfo(this.telemetryClient.receive());
	}

	private connect() {
		this.telemetryClient.disconnect();

		for (let retries = 0; retries < 3; retries++) {
			console.log('fored!');
			this.telemetryClient.connect(this.diagnosticChannelConnectionString);
			if (this.telemetryClient.getOnlineStatus()) {
				return;
			}

		}

		throw new Error('Unable to connect');
	}
}
