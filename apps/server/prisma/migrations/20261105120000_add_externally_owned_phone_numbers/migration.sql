-- Numbers already purchased in Twilio are stored here without buying them
-- again. Releasing one removes it from TinkerVoice and leaves it on Twilio.

ALTER TABLE "PhoneNumber"
  ADD COLUMN "externallyOwned" BOOLEAN NOT NULL DEFAULT false;
