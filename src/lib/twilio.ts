import twilio from "twilio";

type SendSMSParams = {
  to: string;
  body: string;
};

export function getTwilioClient(): ReturnType<typeof twilio> {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    throw new Error("Identifiants Twilio manquants");
  }

  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

export const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

export async function sendSMS({ to, body }: SendSMSParams): Promise<{ success: boolean; sid?: string }> {
  try {
    if (!to || !body) {
      return { success: false };
    }

    if (!twilioPhoneNumber) {
      return { success: false };
    }

    const client = getTwilioClient();
    const message = await client.messages.create({
      to,
      from: twilioPhoneNumber,
      body,
    });

    return {
      success: true,
      sid: message.sid,
    };
  } catch {
    return { success: false };
  }
}
