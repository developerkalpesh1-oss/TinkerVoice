// Fallback catalog used while the runtime voice catalog is loading or
// unavailable. These IDs mirror the values accepted by the LiveKit worker.

import type { VoiceCatalog } from "@/src/lib/api/types";

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "mr", label: "Marathi" },
  { code: "en-IN", label: "English (India)" },
] as const;

const ALL_LANGUAGE_CODES = LANGUAGES.map((language) => language.code);

export type VoiceGender = "feminine" | "masculine" | "neutral";
export type LanguageCode = string;

export interface ModelOption {
  id: string;
  label: string;
  provider: string;
}

export interface LanguageAwareModelOption extends ModelOption {
  languages: LanguageCode[];
}

export interface Voice {
  id: string;
  name: string;
  provider: string;
  gender: VoiceGender;
  locale: string;
  accent: string;
  languages: LanguageCode[];
  ttsModels: string[];
  styles: string[];
  useCases: string[];
}

export interface VoiceOptions {
  languages: Array<{ code: string; label: string; sampleText?: string | null }>;
  timezones: string[];
  sttModels: LanguageAwareModelOption[];
  llmModels: ModelOption[];
  ttsModels: LanguageAwareModelOption[];
  voices: Voice[];
}

export const VOICES: Voice[] = [
  {
    id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    provider: "ElevenLabs",
    gender: "feminine",
    locale: "en-US",
    accent: "American",
    languages: [...ALL_LANGUAGE_CODES],
    ttsModels: [
      "elevenlabs/eleven_flash_v2_5",
      "elevenlabs/eleven_turbo_v2_5",
    ],
    styles: ["Calm", "Narrative", "Clear"],
    useCases: ["Customer service", "Narration"],
  },
  {
    id: "ErXwobaYiN019PkySvjV",
    name: "Antoni",
    provider: "ElevenLabs",
    gender: "masculine",
    locale: "en-US",
    accent: "American",
    languages: [...ALL_LANGUAGE_CODES],
    ttsModels: [
      "elevenlabs/eleven_flash_v2_5",
      "elevenlabs/eleven_turbo_v2_5",
    ],
    styles: ["Well-rounded", "Warm"],
    useCases: ["Conversational agents", "Narration"],
  },
  {
    id: "EXAVITQu4vr4xnSDxMaL",
    name: "Bella",
    provider: "ElevenLabs",
    gender: "feminine",
    locale: "en-US",
    accent: "American",
    languages: [...ALL_LANGUAGE_CODES],
    ttsModels: [
      "elevenlabs/eleven_flash_v2_5",
      "elevenlabs/eleven_turbo_v2_5",
    ],
    styles: ["Soft", "Warm"],
    useCases: ["Customer service", "Conversational agents"],
  },
  {
    id: "pNInz6obpgDQGcFmaJgB",
    name: "Adam",
    provider: "ElevenLabs",
    gender: "masculine",
    locale: "en-US",
    accent: "American",
    languages: [...ALL_LANGUAGE_CODES],
    ttsModels: [
      "elevenlabs/eleven_flash_v2_5",
      "elevenlabs/eleven_turbo_v2_5",
    ],
    styles: ["Deep", "Narrative"],
    useCases: ["IVR", "Narration"],
  },
  {
    id: "f786b574-daa5-4673-aa0c-cbe3e8534c02",
    name: "Katie",
    provider: "Cartesia",
    gender: "feminine",
    locale: "en-US",
    accent: "American",
    languages: [...ALL_LANGUAGE_CODES],
    ttsModels: ["sonic-3.5", "sonic-3", "sonic-2", "sonic-turbo"],
    styles: ["Stable", "Realistic"],
    useCases: ["Voice agents", "Customer service"],
  },
  {
    id: "a5136bf9-224c-4d76-b823-52bd5efcffcc",
    name: "Jameson",
    provider: "Cartesia",
    gender: "masculine",
    locale: "en-US",
    accent: "American",
    languages: [...ALL_LANGUAGE_CODES],
    ttsModels: ["sonic-3.5", "sonic-3", "sonic-2", "sonic-turbo"],
    styles: ["Stable", "Realistic"],
    useCases: ["Voice agents", "Customer service"],
  },
  {
    id: "228fca29-3a0a-435c-8728-5cb483251068",
    name: "Kiefer",
    provider: "Cartesia",
    gender: "masculine",
    locale: "en-US",
    accent: "American",
    languages: [...ALL_LANGUAGE_CODES],
    ttsModels: ["sonic-3.5", "sonic-3", "sonic-2", "sonic-turbo"],
    styles: ["Stable", "Conversational"],
    useCases: ["Voice agents", "Support"],
  },
  {
    id: "6ccbfb76-1fc6-48f7-b71d-91ac6298247b",
    name: "Tessa",
    provider: "Cartesia",
    gender: "feminine",
    locale: "en-US",
    accent: "American",
    languages: [...ALL_LANGUAGE_CODES],
    ttsModels: ["sonic-3.5", "sonic-3", "sonic-2", "sonic-turbo"],
    styles: ["Expressive", "Emotive"],
    useCases: ["Companion apps", "Characters"],
  },
  {
    id: "astra",
    name: "Astra",
    provider: "Rime",
    gender: "feminine",
    locale: "en-US",
    accent: "American",
    languages: ["en"],
    ttsModels: ["rime-arcana", "rime-mist"],
    styles: ["Bright", "Expressive"],
    useCases: ["Voice agents", "Conversational agents"],
  },
  {
    id: "luna",
    name: "Luna",
    provider: "Rime",
    gender: "feminine",
    locale: "en-US",
    accent: "American",
    languages: ["en"],
    ttsModels: ["rime-arcana", "rime-mist"],
    styles: ["Bright", "Casual"],
    useCases: ["Voice agents", "Customer service"],
  },
  {
    id: "masonry",
    name: "Masonry",
    provider: "Rime",
    gender: "masculine",
    locale: "en-US",
    accent: "Southern",
    languages: ["en"],
    ttsModels: ["rime-arcana"],
    styles: ["Confident", "Low"],
    useCases: ["Professional agents", "Narration"],
  },
  {
    id: "cove",
    name: "Cove",
    provider: "Rime",
    gender: "feminine",
    locale: "en-US",
    accent: "American",
    languages: ["en"],
    ttsModels: ["rime-mist"],
    styles: ["Clear", "Natural"],
    useCases: ["Voice agents", "Customer service"],
  },
];

export function normalizeLanguageCode(
  language: string,
  languages: ReadonlyArray<{ code: string }> = LANGUAGES,
): LanguageCode {
  const normalized = language.trim().toLowerCase();
  const baseLanguage = normalized.split("-", 1)[0];
  const matched = languages.find(
    (option) => option.code.toLowerCase() === normalized,
  ) ?? languages.find(
    (option) => option.code.toLowerCase() === baseLanguage,
  );

  return matched?.code ?? language.trim();
}

function supportsLanguage(
  option: { languages: LanguageCode[] },
  language: string,
  languages: ReadonlyArray<{ code: string }>,
) {
  return option.languages.includes(normalizeLanguageCode(language, languages));
}

export function getVoicesForTtsModel(
  ttsModel: string,
  language = "en",
  options: VoiceOptions = STATIC_VOICE_OPTIONS,
) {
  return options.voices.filter(
    (voice) =>
      voice.ttsModels.includes(ttsModel) && supportsLanguage(voice, language, options.languages),
  );
}

export function getDefaultVoiceForTtsModel(
  ttsModel: string,
  language = "en",
  options: VoiceOptions = STATIC_VOICE_OPTIONS,
) {
  return (
    getVoicesForTtsModel(ttsModel, language, options)[0]?.id ??
    options.voices[0]?.id ??
    ""
  );
}

export const LLM_MODELS: ModelOption[] = [
  {
    id: "openai/gpt-4.1-mini",
    label: "GPT-4.1 mini",
    provider: "OpenAI",
  },
];

export const COMMON_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

export const STT_MODELS: LanguageAwareModelOption[] = [
  {
    id: "elevenlabs/scribe_v2_realtime",
    label: "Scribe v2 Realtime",
    provider: "ElevenLabs",
    languages: [...ALL_LANGUAGE_CODES],
  },
];

export const TTS_MODELS: LanguageAwareModelOption[] = [
  {
    id: "elevenlabs/eleven_flash_v2_5",
    label: "Eleven Flash v2.5",
    provider: "ElevenLabs",
    languages: [...ALL_LANGUAGE_CODES],
  },
  {
    id: "elevenlabs/eleven_turbo_v2_5",
    label: "Eleven Turbo v2.5",
    provider: "ElevenLabs",
    languages: [...ALL_LANGUAGE_CODES],
  },
];

export const STATIC_VOICE_OPTIONS: VoiceOptions = {
  languages: [...LANGUAGES],
  timezones: [...COMMON_TIMEZONES],
  sttModels: [...STT_MODELS],
  llmModels: [...LLM_MODELS],
  ttsModels: [...TTS_MODELS],
  voices: [...VOICES],
};

function providerModelId(provider: string, id: string) {
  return `${provider}/${id}`;
}

function catalogLanguages(languages: string[] | undefined) {
  return languages?.length ? languages : ["en"];
}

export function buildVoiceOptionsFromCatalog(
  catalog: VoiceCatalog,
): VoiceOptions {
  return {
    languages: catalog.languages.map((language) => ({
      code: language.id,
      label: language.label,
      ...(language.sample_text ? { sampleText: language.sample_text } : {}),
    })),
    timezones: catalog.timezones,
    sttModels: catalog.stt_models.map((model) => ({
      id: providerModelId(model.provider, model.id),
      label: model.label,
      provider: model.provider,
      languages: catalogLanguages(model.languages),
    })),
    llmModels: catalog.llm_models.map((model) => ({
      id: providerModelId(model.provider, model.id),
      label: model.label,
      provider: model.provider,
    })),
    ttsModels: catalog.tts_models.map((model) => ({
      id: providerModelId(model.provider, model.id),
      label: model.label,
      provider: model.provider,
      languages: catalogLanguages(model.languages),
    })),
    voices: catalog.voices.map((voice) => ({
      id: voice.id,
      name: voice.label,
      provider: voice.provider,
      gender: "neutral",
      locale: voice.languages?.[0] ?? "en",
      accent: "",
      languages: catalogLanguages(voice.languages),
      ttsModels: (voice.tts_models ?? []).map((model) =>
        providerModelId(voice.provider, model),
      ),
      styles: [],
      useCases: [],
    })),
  };
}

export function getSttModelsForLanguage(
  language: string,
  options: VoiceOptions = STATIC_VOICE_OPTIONS,
) {
  return options.sttModels.filter((model) => supportsLanguage(model, language, options.languages));
}

export function getTtsModelsForLanguage(
  language: string,
  options: VoiceOptions = STATIC_VOICE_OPTIONS,
) {
  return options.ttsModels.filter((model) => supportsLanguage(model, language, options.languages));
}

export function getDefaultSttModelForLanguage(
  language: string,
  options: VoiceOptions = STATIC_VOICE_OPTIONS,
) {
  return (
    getSttModelsForLanguage(language, options)[0]?.id ??
    options.sttModels[0]?.id ??
    ""
  );
}

export function getDefaultTtsModelForLanguage(
  language: string,
  options: VoiceOptions = STATIC_VOICE_OPTIONS,
) {
  return (
    getTtsModelsForLanguage(language, options)[0]?.id ??
    options.ttsModels[0]?.id ??
    ""
  );
}
