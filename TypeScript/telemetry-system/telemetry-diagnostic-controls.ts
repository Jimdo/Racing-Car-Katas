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

		this.telemetryClient.disconnect();

		let retryLeft = 3;
		while (this.telemetryClient.getOnlineStatus() === false && retryLeft > 0) {
			this.telemetryClient.connect(this.diagnosticChannelConnectionString);
			retryLeft -= 1;
		}

		if (this.telemetryClient.getOnlineStatus() === false) {
			throw new Error('Unable to connect');
		}

		this.telemetryClient.send(this.telemetryClient.diagnosticMessage());
		this.writeDiagnosticInfo(this.telemetryClient.receive());
	}
}
