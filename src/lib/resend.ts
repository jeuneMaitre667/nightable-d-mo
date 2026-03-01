import { Resend } from "resend";

type ReservationConfirmationParams = {
  to: string;
  reservationDetails: {
    reservationId: string;
    eventName: string;
    eventDate: string;
    tableName: string;
    amountPaid: number;
    qrCode: string;
  };
};

export function getResendClient(): Resend {
	const apiKey = process.env.RESEND_API_KEY;

	if (!apiKey) {
		throw new Error("RESEND_API_KEY manquante");
	}

	return new Resend(apiKey);
}

function formatEuros(value: number): string {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: 0,
	}).format(value);
}

export async function sendReservationConfirmation({
	to,
	reservationDetails,
}: ReservationConfirmationParams): Promise<{ success: boolean; id?: string }> {
	try {
		if (!to) {
			return { success: false };
		}

		const resend = getResendClient();
		const { data, error } = await resend.emails.send({
			from: "NightTable <no-reply@nighttable.app>",
			to,
			subject: `Réservation confirmée · ${reservationDetails.eventName}`,
			html: `
				<div style="font-family: Inter, sans-serif; background: #0A0F2E; color: #F7F6F3; padding: 24px; border-radius: 12px;">
					<h1 style="margin: 0 0 8px 0; color: #C9973A;">Votre table est confirmée ✨</h1>
					<p style="margin: 0 0 18px 0; color: #C9C9C9;">Merci pour votre réservation sur NightTable.</p>
					<ul style="line-height: 1.8; color: #F7F6F3;">
						<li><strong>Réservation</strong>: ${reservationDetails.reservationId}</li>
						<li><strong>Événement</strong>: ${reservationDetails.eventName}</li>
						<li><strong>Date</strong>: ${reservationDetails.eventDate}</li>
						<li><strong>Table</strong>: ${reservationDetails.tableName}</li>
						<li><strong>Montant payé</strong>: ${formatEuros(reservationDetails.amountPaid)}</li>
						<li><strong>Code d’accès</strong>: ${reservationDetails.qrCode}</li>
					</ul>
				</div>
			`,
		});

		if (error) {
			return { success: false };
		}

		return { success: true, id: data?.id };
	} catch {
		return { success: false };
	}
}
