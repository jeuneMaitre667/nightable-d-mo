import twilio from "twilio";

export function getTwilioClient() {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    throw new Error("Identifiants Twilio manquants");
  }

  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

export const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
